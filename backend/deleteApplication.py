import json
import boto3

# Initialize the DynamoDB resource 
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('application')

def lambda_handler(event, context):
    try:
        # Get the item ID from the path parameters
        item_id = event['pathParameters']['application_id']
        
        # Delete the item from DynamoDB 
        response = table.delete_item(
            Key={'application_id': item_id},
            ReturnValues='ALL_OLD'
        )
        
        # Check if the item was deleted 
        if 'Attributes' in response:
            response_body = {
                "message": "Application information deleted successfully",
                "item": response['Attributes']
            }
            status_code = 200
        else:
            response_body = {
                "message": "Application not found"
            }
            status_code = 404
        
        return {
            "statusCode": status_code,
            "headers": {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            "body": json.dumps(response_body)
        }
    except Exception as e:
        # Handle any exceptions by returning a 500 error status code with the error message
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
        }
