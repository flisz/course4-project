import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

// import { getUserId } from '../utils'
// import {getSignedAttachmentUrl} from "../../helpers/todos";
import {createLogger} from "../../utils/logger";

import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger("generateUploadUrl")
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      logger.info(`Path: ${event.path}`)
      const todoId = event.pathParameters.todoId
      // const userId = getUserId(event)

      // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

      // const uploadUrl = getSignedAttachmentUrl(todoId, userId)
      const uploadUrl = getUploadUrl(todoId)

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


function getUploadUrl(todoId: string) {
  logger.info(`getting upload URL for: ${todoId}`)
  const params = {
    Bucket: process.env.ATTACHMENT_S3_BUCKET,
    Key: todoId,
    Expires: parseInt(process.env.SIGNED_URL_EXPIRATION)
  }
  logger.info(`Bucket: ${params.Bucket}`)
  logger.info(`Key: ${params.Key}`)
  logger.info(`Expires: ${params.Expires}`)
  const url = s3.getSignedUrl('putObject', params)
  logger.info(`got url: ${url}`)
  return url
}
