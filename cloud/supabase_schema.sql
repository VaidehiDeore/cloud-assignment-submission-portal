-- Run this SQL in Supabase SQL Editor.
-- Enable UUID generation.
create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text unique not null,
  role text not null default 'student'
    check (role in ('student','teacher','admin')),
  created_at timestamptz not null default now()
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  course_name text not null,
  teacher_id uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id),
  title text not null,
  description text not null,
  deadline timestamptz not null,
  max_marks numeric(8,2) not null check (max_marks > 0),
  allowed_file_types text[] not null default array['pdf','docx'],
  max_file_size bigint not null default 10485760,
  allow_late_submission boolean not null default true,
  allow_resubmission boolean not null default true,
  max_attempts integer not null default 3,
  created_by uuid not null references profiles(id),
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references assignments(id) on delete cascade,
  student_id uuid not null references profiles(id),
  file_name text not null,
  storage_path text not null,
  submitted_at timestamptz not null default now(),
  submission_status text not null check (submission_status in ('SUBMITTED','LATE','GRADED')),
  marks numeric(8,2),
  feedback text,
  graded_at timestamptz,
  attempt_number integer not null default 1
);

create index if not exists idx_assignments_course on assignments(course_id);
create index if not exists idx_assignments_creator on assignments(created_by);
create index if not exists idx_assignments_deadline on assignments(deadline);
create index if not exists idx_submissions_student on submissions(student_id);
create index if not exists idx_submissions_assignment on submissions(assignment_id);
create index if not exists idx_submissions_status on submissions(submission_status);

-- Create the private storage bucket from the Supabase dashboard:
-- Storage -> New Bucket -> assignment-files -> Private.
--
-- For the student project, backend service-role access is used for storage operations.
-- Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
