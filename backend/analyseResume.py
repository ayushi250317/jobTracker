import json
import boto3
import time
import string
import logging
from urllib.parse import urlparse,unquote

dynamodb = boto3.resource('dynamodb')
textract = boto3.client('textract')
comprehend = boto3.client('comprehend')
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Precompute translation table for punctuation removal
PUNCTUATION_TRANSLATOR = str.maketrans('', '', string.punctuation)

def extract_text_from_pdf(s3_bucket, s3_key):
    response = textract.start_document_text_detection(
        DocumentLocation={'S3Object': {'Bucket': s3_bucket, 'Name': s3_key}}
    )
    job_id = response['JobId']
    
    while True:
        response = textract.get_document_text_detection(JobId=job_id)
        if response['JobStatus'] in ['SUCCEEDED', 'FAILED']:
            break
        time.sleep(5)
    
    if response['JobStatus'] == 'SUCCEEDED':
        return ''.join(block['Text'] + '\n' for block in response['Blocks'] if block['BlockType'] == 'LINE')
    else:
        raise Exception('Textract job failed')

def clean_text(text):
    return text.lower().translate(PUNCTUATION_TRANSLATOR)

def extract_bucket_key_from_presigned_url(presigned_url):
    parsed_url = urlparse(presigned_url)
    
    hostname = parsed_url.hostname
    
    bucket_name = hostname.split('.')[0]
    
    key = unquote(parsed_url.path.lstrip('/'))
    
    return bucket_name, key

def get_key_phrases(text):
    return {phrase['Text'] for phrase in comprehend.detect_key_phrases(Text=text, LanguageCode='en')['KeyPhrases']}

def lambda_handler(event, context):
    try:
        body = json.loads(event.get('body', '{}'))
        s3_url = body.get('resumeFileUrl')
        application_id = body.get('application_id')
        
        if not s3_url or not application_id:
            raise ValueError('resumeFileUrl or application_id is missing or empty')

        s3_bucket, s3_key = extract_bucket_key_from_presigned_url(s3_url)
        logger.info(f"Processing file: {s3_key}")
        
        # Extract and clean text from resume
        resume_text = clean_text(extract_text_from_pdf(s3_bucket, s3_key))
        
        # Get job description from DynamoDB
        table = dynamodb.Table('application')
        job_description = clean_text(table.get_item(Key={'application_id': application_id})['Item']['jobDescription'])
        
        # Get key phrases
        resume_phrases = get_key_phrases(resume_text)
        job_description_phrases = get_key_phrases(job_description)
        
        # Calculate similarity score
        intersection = resume_phrases & job_description_phrases
        union = resume_phrases | job_description_phrases
        similarity_score = len(intersection) / len(union) if union else 0

        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'similarity_score': similarity_score,
                'resume_phrases': list(resume_phrases),
                'job_description_phrases': list(job_description_phrases)
            })
        }
    except Exception as e:
        logger.error(f"Error: {str(e)}", exc_info=True)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }