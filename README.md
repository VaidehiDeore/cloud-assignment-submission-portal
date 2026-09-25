# Cloud-Based Student Assignment Submission & Feedback Portal

A cloud-enabled web application that allows students to submit assignments online while enabling teachers to create assignments, review submissions, assign marks, and provide feedback through a centralized portal.

## Features

### Student
- Student registration and login
- View assignments and deadlines
- Upload assignment files
- Resubmit assignments based on attempt limits
- Track submission status
- View marks and teacher feedback
- Access previous submission information

### Teacher
- Secure teacher authentication
- Create, update, and manage assignments
- Set deadlines, maximum marks, and allowed file types
- View student submissions
- Download submitted files through secure temporary URLs
- Grade submissions
- Provide written feedback
- Monitor assignment and submission statistics

### System
- Role-based access control
- RESTful API architecture
- Cloud database integration
- Private cloud object storage
- File type and size validation
- Deadline and late-submission handling
- Ownership and authorization checks
- Structured error handling
- Responsive professional dashboard UI

## Architecture

Student / Teacher → React + Vite Frontend → FastAPI REST API → Supabase Auth / PostgreSQL / Storage

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Axios, Recharts, Lucide |
| Backend | Python, FastAPI |
| Authentication | Supabase Auth |
| Database | Supabase PostgreSQL |
| File Storage | Supabase Storage |
| API | REST API |
| Testing | Manual end-to-end validation + testing foundation |
| Development | VS Code, Git, GitHub |

## Cloud Computing Concepts Demonstrated

- Cloud-based application architecture
- Managed authentication
- Managed PostgreSQL database
- Cloud object storage
- REST API communication
- Role-Based Access Control (RBAC)
- Secure file access using signed URLs
- Environment variables and secrets management
- Backend authorization
- Application logging and error handling
- Scalability and cloud deployment concepts

## Database Design

The system uses PostgreSQL with the following core entities:

- `profiles` — user information and roles
- `courses` — course information and teacher ownership
- `assignments` — assignment details, deadlines and configuration
- `submissions` — submission metadata, attempts, marks and feedback

Assignment files are stored separately in the private `assignment-files` Supabase Storage bucket.

## Security

- Service-role credentials are used only by the backend.
- Secrets are stored in environment variables and excluded from Git.
- Students cannot select the teacher role during registration.
- Backend authorization is enforced independently of frontend route protection.
- Students can access only their own submission-related data.
- Files are stored in private cloud storage.
- Downloads use temporary signed URLs.
- File type and size validation is performed by the backend.
- Assignment ownership and grading permissions are validated server-side.

## Project Structure

Cloud-Assignment-Submission-Portal/
├── backend/
├── frontend/
├── cloud/
├── docs/
├── reports/
├── screenshots/
├── tests/
├── sample_files/
├── .env.example
├── .gitignore
└── README.md

## Setup

### 1. Create Supabase Project

Create a Supabase project and obtain:

- Project URL
- Legacy `anon` key
- `service_role` key

Keep the `service_role` key private and use it only in the backend environment.

### 2. Configure Database

Open the Supabase SQL Editor and execute:

`cloud/supabase_schema.sql`

Create a private storage bucket named:

`assignment-files`

### 3. Configure Backend

Run:

`cd backend`

Create a virtual environment:

`python -m venv .venv`

Windows PowerShell:

`.venv\Scripts\Activate.ps1`

Install dependencies:

`pip install -r requirements.txt`

Create `backend/.env` from `.env.example` and configure the Supabase credentials.

Start the backend:

`uvicorn app:app --reload --port 8000`

API documentation:

`http://localhost:8000/docs`

### 4. Configure Frontend

Run:

`cd frontend`

Install dependencies:

`npm install`

Create `frontend/.env` from `frontend/.env.example`.

Start the frontend:

`npm run dev`

Open:

`http://localhost:5173`

## Creating a Teacher Account

Public registration creates student accounts only.

For development/demo purposes:

1. Register the account normally.
2. Update the corresponding profile role to `teacher` from a trusted Supabase/admin environment.
3. Create a course associated with the teacher profile.

## Verified Workflow

Teacher Login → Create Assignment → Assignment Stored in Cloud Database → Student Views Assignment → Student Uploads Assignment → File Stored in Cloud Storage → Submission Metadata Stored in Database → Teacher Reviews Submission → Teacher Assigns Marks & Feedback → Student Views Grade & Feedback

## Screenshots

Project screenshots are available in the `screenshots/` directory:

- Teacher Dashboard
- Create Assignment
- Assignments
- Student Dashboard
- My Submissions

## Limitations

- Teacher accounts are provisioned manually for the current implementation.
- Advanced cloud monitoring is not included.
- Malware scanning and resumable uploads are not currently implemented.
- Advanced notification services are not currently implemented.
- Production deployment has not yet been completed.

## Future Enhancements

- Email and in-app notifications
- Assignment rubrics
- Advanced submission history
- CSV/report export
- Cloud deployment
- Automated CI/CD pipeline
- Advanced monitoring and audit logs
- AI-assisted plagiarism/similarity detection

## Author

**Vaidehi Deore**

Cloud Computing Project