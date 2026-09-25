# REST API

## Authentication
POST /api/register
POST /api/login
POST /api/logout

## Assignments
POST /api/assignments
GET /api/assignments
GET /api/assignments/{id}
PUT /api/assignments/{id}
DELETE /api/assignments/{id}

## Submissions
POST /api/assignments/{id}/submit
GET /api/submissions/me
GET /api/assignments/{id}/submissions
GET /api/submissions/{id}

## Feedback
POST /api/submissions/{id}/grade
GET /api/submissions/{id}/feedback

## Files
GET /api/submissions/{id}/download

Interactive API documentation is available at `/docs` when FastAPI is running.
