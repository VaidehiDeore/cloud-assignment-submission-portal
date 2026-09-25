# Security Design

- Authentication is handled by Supabase Auth.
- The backend validates the access token before protected operations.
- Public registration always creates a student role.
- Teacher/admin roles must be provisioned by a trusted administrator.
- Backend authorization checks ownership of courses, assignments and submissions.
- Student IDs are derived from the authenticated user, not trusted from request bodies.
- Marks are validated against the actual assignment maximum stored in the database.
- Student files are stored in a private bucket.
- Downloads are exposed through short-lived signed URLs.
- Service-role credentials are backend-only.
- Environment variables hold secrets and deployment configuration.
- HTTPS should be used in production.
