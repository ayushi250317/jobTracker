import json
import boto3
import datetime
import base64
import uuid
import logging

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('application')
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    try:
        # Parse the incoming request body
        body = json.loads(event['body'])
        username = body['username']
        company_name = body['companyName']
        position = body['position']
        applied_date = body['appliedDate']
        status = body['status']
        jobDescription = body['jobDescription']
        pdfFile = body.get('pdfFile')
        application_id = body.get('application_id', str(uuid.uuid4()))

        logger.info(f"Processing application with ID: {application_id}")

        if pdfFile:
            # Decode the Base64 encoded resume file
            decode_pdf = base64.b64decode(pdfFile)
            # Upload the resume file to the S3 bucket
            bucket_name = 'resumebucket2607'
            file_name = f"{username}/{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
            s3.put_object(Bucket=bucket_name, Key=file_name, Body=decode_pdf)
            resume_file_url = f"https://{bucket_name}.s3.amazonaws.com/{file_name}"
        else:
            resume_file_url = body.get('resumeFileUrl', '')

        # Store or update the job application details in the DynamoDB table
        job_application = {
            'application_id': application_id,
            'username': username,
            'companyName': company_name,
            'position': position,
            'appliedDate': applied_date,
            'status': status,
            'jobDescription': jobDescription,
            'resumeFileUrl': resume_file_url
        }

        logger.info(job_application)
        table.put_item(Item=job_application)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': 'Job application details saved successfully'}),
        }

    except Exception as e:
        logger.error(f"Error processing application: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
        }
