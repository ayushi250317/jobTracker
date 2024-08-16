import json
import boto3
from urllib.parse import urlparse

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('application')
s3_client = boto3.client('s3')

def parse_s3_url(s3_url):
    parsed_url = urlparse(s3_url)
    return parsed_url.netloc.split('.')[0], parsed_url.path.lstrip('/')

def lambda_handler(event, context):
    username = event['pathParameters']['username']

    try:
        response = table.scan(
            FilterExpression=boto3.dynamodb.conditions.Attr('username').eq(username)
        )
        
        applications = response.get('Items', [])
        
        for application in applications:
            resumeFileUrl=application.get('resumeFileUrl')
            s3_bucket, s3_key = parse_s3_url(resumeFileUrl)
            preSignedUrl=s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': s3_bucket,
                                                            'Key': s3_key},
                                                    ExpiresIn=3600)
            application['resumeFileUrl']=preSignedUrl

        return {
            'statusCode': 200,
            'headers': {
             'Access-Control-Allow-Origin': '*'
           },
            'body': json.dumps(response['Items']),
             
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
             'Access-Control-Allow-Origin': '*'
           },
            'body': json.dumps({'message': 'Failed to fetch applications', 'error': str(e)}),
        }

