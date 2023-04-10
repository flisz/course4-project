import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { updateTodo } from '../../helpers/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import {createLogger} from "../../utils/logger";

const logger = createLogger("updateTodo")

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const todoId = event.pathParameters.todoId
      const todoData: UpdateTodoRequest = JSON.parse(event.body)
      const userId = getUserId(event)

      logger.info(`Attempting to update todo: ${todoId} with user ${userId} with data: ${todoData}`)

      // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
      await updateTodo(todoId, todoData, userId)

      return {
          statusCode: 200,
          body: JSON.stringify({})
      }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
