import { TodosAccess } from './todosAccess'
import { getUploadUrl} from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import {TodoUpdate} from "../models/TodoUpdate";

const logger = createLogger('Todo-Logic')
const bucket = process.env.ATTACHMENT_S3_BUCKET

const todosAccess = new TodosAccess()

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
    try {
      return await todosAccess.getAllTodos(userId)
    } catch (error) {
      createError(error);
    }
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {

  try {
    const todoId = uuid.v4()

    return await todosAccess.createTodo({
      userId: userId,
      todoId: todoId,
      createdAt: new Date().toISOString(),
      name: createTodoRequest.name,
      dueDate: createTodoRequest.dueDate,
      done: false,
      attachmentUrl: `https://${bucket}.s3.amazonaws.com/${todoId}`
    })
  } catch (error) {
    createError(error);
  }
}

export async function updateTodo(
    todoId: string,
    updateTodoRequest: UpdateTodoRequest,
    userId: string
): Promise<TodoUpdate> {
  try {
    return await todosAccess.updateTodo(todoId, updateTodoRequest, userId)
  } catch (error) {
    createError(error);
  }
}

export async function deleteTodo(todoId: string, userId: string) {
  try {
    return await todosAccess.deleteTodo(todoId, userId)
  } catch (error) {
    createError(error);
  }
}

export function getSignedAttachmentUrl(todoId: string, userId: string) {
  try {
    logger.info(`getting signed attachment url for user: ${userId}, image: ${todoId}`)
    const url = getUploadUrl(todoId)
    logger.info(`got url: ${url}`)
  } catch (error) {
    createError(error);
  }
}