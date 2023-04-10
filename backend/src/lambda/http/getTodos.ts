import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils';
import { getAllTodos } from "../../helpers/todos";
import {createLogger} from "../../utils/logger";

const logger = createLogger("getTodos")

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      // TODO: Get all TODO items for a current user

      const userId = getUserId(event)
      logger.info(`Getting todos for user: ${userId}`)
      const todos = await getAllTodos(userId)

      return {
          statusCode: 200,
          body: JSON.stringify({
              items: todos
          })
      }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
