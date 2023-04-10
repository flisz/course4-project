import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic

import {createLogger} from "../utils/logger";
const logger = createLogger('attachmentUtils')


export async function getUploadUrl(imageId: string) {
  logger.info(`getting upload URL for: ${imageId}`)

  let s3 = undefined
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    s3 = new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  } else {
    console.log('Not Offline!')
    s3 = new XAWS.S3({signatureVersion: 'v4'})
  }


  return s3.getSignedUrl('putObject', {
    Bucket: process.env.ATTACHMENT_S3_BUCKET,
    Key: imageId,
    Expires: process.env.SIGNED_URL_EXPIRATION
  })
}
