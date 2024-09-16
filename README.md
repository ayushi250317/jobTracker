# Job Tracker Project

The **Job Tracker** project is designed to help users manage and track their job applications efficiently. It integrates multiple AWS services to provide a scalable, efficient, and reliable solution. The project architecture is entirely serverless, utilizing AWS services for storage, processing, and deployment.


## Project Overview

The Job Tracker application allows users to:
- Add job postings manually or extract key details from documents.
- Upload their resume and automatically match it with job descriptions.
- Use AWS Comprehend to extract keywords from both the resume and job descriptions, finding similarity between the two and identifying keyword matches.
- Store user data and job-related information in DynamoDB.
- Manage job applications and statuses in a user-friendly interface.

## Architecture

The project is designed using a microservice architecture, where each AWS service plays a unique role. Here's a high-level overview of the system's architecture:


## AWS Services Used

1. **AWS CloudFormation**: Automates the provisioning of all AWS resources and sets up the entire infrastructure as code.
2. **S3**: Stores assets like resumes and provides object storage for the frontend.
3. **DynamoDB**: NoSQL database for storing job application data, including job details, status, and timestamps.
4. **Elastic Beanstalk**: Hosts and deploys the React frontend, providing a scalable platform for the application.
5. **API Gateway**: Manages API requests from the frontend and routes them to appropriate AWS Lambda functions.
6. **Lambda**: Handles backend logic, processes API requests, and connects with other AWS services.
7. **Comprehend**: Extracts keywords from job descriptions and resumes, performs text analysis, and finds similarities between the two, enabling better job-resume matches.
8. **Textract**: Extracts text and structured data (e.g., company names, roles) from uploaded job descriptions and resumes for further processing and matching.

