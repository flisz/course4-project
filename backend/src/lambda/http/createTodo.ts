import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../helpers/todos'
import { createLogger } from "../../utils/logger";

const logger = createLogger('CreateTodo');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      logger.info('Processing event: ', event);
      const todoData: CreateTodoRequest = JSON.parse(event.body)
      logger.info('Creating new todo item')

      const userId = getUserId(event);
      const newTodo = createTodo(todoData, userId)

      return {
          statusCode: 201,
          body: JSON.stringify({
              "item": newTodo
          })
      }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
