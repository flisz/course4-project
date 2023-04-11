import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUserId } from '../utils'
import {createLogger} from "../../utils/logger";
import {generateUploadUrl} from "../../helpers/todos";

const logger = createLogger("generateUploadUrl")

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      logger.info(`Path: ${event.path}`)
      const todoId = event.pathParameters.todoId
      const userId = getUserId(event)

      // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

      const uploadUrl = await generateUploadUrl(todoId, userId)

      logger.info(`Got upload url: ${uploadUrl}`)

      return {
          statusCode: 200,
          body: JSON.stringify({
              uploadUrl
          })
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
