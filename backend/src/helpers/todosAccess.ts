import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
const AWSXRay = require('aws-xray-sdk')

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess {
    // XRAY is implemented down in the createDynamoDBClient below
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosIndex = process.env.TODOS_CREATED_AT_INDEX
    ) {
    }

    async getAllTodos(userId: string): Promise<TodoItem[]> {
        logger.info('Getting all todos')

        const result = await this.docClient
            .query({
                TableName: this.todosTable,
                IndexName: this.todosIndex,
                ExpressionAttributeValues: {
                    ':userId': userId
                },
                KeyConditionExpression: 'userId = :userId'
            })
            .promise()

        const items = result.Items
        logger.info(`items: ${items}`)
        return items as TodoItem[]
    }

    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        logger.info(`Creating item: ${todoItem}`)
        logger.info(`todoItem.userId: ${todoItem.userId}`)
        logger.info(`todoItem.todoId: ${todoItem.todoId}`)
        logger.info(`todoItem.createdAt: ${todoItem.createdAt}`)
        logger.info(`todoItem.name: ${todoItem.name}`)
        logger.info(`todoItem.dueDate: ${todoItem.dueDate}`)
        logger.info(`todoItem.done: ${todoItem.done}`)
        logger.info(`todoItem.attachmentUrl: ${todoItem.attachmentUrl}`)

        const params = {
            TableName: this.todosTable,
            Item: todoItem
        }
        await this.docClient.put(params).promise()
        return todoItem
    }

    async updateTodo(
        todoId: string,
        updateTodoData: TodoUpdate,
        userId: string): Promise<TodoUpdate> {
        logger.info(`updating user: ${userId}, todo: ${todoId}`)



        const params = {
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: "set #name = :name, dueDate = :dueDate, done = :done",
            ExpressionAttributeNames: {"#name": "name"},
            ExpressionAttributeValues: {
                ":name": updateTodoData.name,
                ":dueDate": updateTodoData.dueDate,
                ":done": updateTodoData.done
            },
            ReturnValues: 'ALL_NEW'
        };
        const updatedTodo = await this.docClient.update(params).promise()

        logger.info(`Updated: ${updatedTodo.Attributes}`)

        return updateTodoData
    }

    async deleteTodo(todoId: string, userId:string): Promise<boolean> {
        const param = {
            TableName: this.todosTable,
            Key: {
                todoId: todoId,
                userId: userId
            }
        }
        await this.docClient.delete(param).promise()
        return true
    }
};

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
