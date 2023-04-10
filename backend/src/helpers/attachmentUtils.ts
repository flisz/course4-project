import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic

import {createLogger} from "../utils/logger";
const logger = createLogger('attachmentUtils')
const s3 = new XAWS.S3({signatureVersion: 'v4'})


export async function getUploadUrl(todoId: string) {
  logger.info(`getting upload URL for: ${todoId}`)

  return s3.getSignedUrl('putObject', {
    Bucket: process.env.ATTACHMENT_S3_BUCKET,
    Key: todoId,
    Expires: process.env.SIGNED_URL_EXPIRATION
  })
}
