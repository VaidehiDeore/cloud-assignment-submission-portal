# System Architecture

## Core

Users -> React -> Authentication -> REST API -> FastAPI -> PostgreSQL + Object Storage -> Monitoring

## Submission flow

1. Student authenticates.
2. Student opens an assignment.
3. React sends multipart file upload to FastAPI.
4. Backend validates identity, assignment access, deadline, file type and size.
5. File is stored in private object storage.
6. Submission metadata is saved in PostgreSQL.
7. Student receives confirmation.
8. Teacher later accesses the authorized submission.
9. Teacher grades and writes feedback.
10. Student retrieves feedback from the API.

## Advanced evolution

CDN -> Frontend Hosting -> API Gateway -> Backend/Serverless -> Managed DB + Object Storage -> Monitoring.

The advanced components are architectural options and should only be added where they provide a real operational benefit.
