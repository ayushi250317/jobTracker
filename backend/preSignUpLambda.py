import json

def lambda_handler(event, context):

# Auto confirm user so that they can proceed with login
  event["response"]["autoConfirmUser"] = True

  return event
