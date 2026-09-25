import { useEffect, useState } from "react";
import { ClipboardList, Clock3, CheckCircle2, AlertTriangle, GraduationCap, Users, UploadCloud } from "lucide-react";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { getUser } from "../utils/auth";
import { getStudentDashboard, getTeacherDashboard } from "../services/dashboardService";
import { formatDate } from "../utils/formatters";

export default function Dashboard() {
  const user = getUser();
  const teacher = user?.role === "teacher";
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (teacher ? getTeacherDashboard() : getStudentDashboard())
      .then(setData)
      .catch(() => setError("Unable to load dashboard data."));
  }, [teacher]);

  const stats = data?.stats || {};

  return (
    <Layout>
      <header className="page-header">
        <div>
          <div className="eyebrow">OVERVIEW</div>
          <h1>{teacher ? "Teacher Dashboard" : "Student Dashboard"}</h1>
          <p>Track assignments, submissions, deadlines and feedback from one workspace.</p>
        </div>
      </header>

      {error && <div className="alert error">{error}</div>}

      <section className="stats-grid">
        {teacher ? <>
          <StatCard icon={ClipboardList} label="Assignments" value={stats.total_assignments} />
          <StatCard icon={Users} label="Students" value={stats.total_students} />
          <StatCard icon={UploadCloud} label="Submissions" value={stats.total_submissions} />
          <StatCard icon={Clock3} label="Pending Reviews" value={stats.pending_reviews} />
          <StatCard icon={AlertTriangle} label="Late" value={stats.late_submissions} />
          <StatCard icon={CheckCircle2} label="Graded" value={stats.graded_submissions} />
        </> : <>
          <StatCard icon={ClipboardList} label="Total Assignments" value={stats.total_assignments} />
          <StatCard icon={Clock3} label="Pending" value={stats.pending_assignments} />
          <StatCard icon={UploadCloud} label="Submitted" value={stats.submitted_assignments} />
          <StatCard icon={AlertTriangle} label="Late" value={stats.late_assignments} />
          <StatCard icon={GraduationCap} label="Graded" value={stats.graded_assignments} />
        </>}
      </section>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-title"><h2>{teacher ? "Recent Uploads" : "Upcoming Deadlines"}</h2></div>
          {(!data || (teacher ? !data.recent_uploads?.length : !data.upcoming_deadlines?.length)) && <div className="empty">No records yet.</div>}
          {teacher ? data?.recent_uploads?.map(item => (
            <div className="list-row" key={item.id}>
              <div><strong>Submission #{item.id.slice(0, 8)}</strong><span>{formatDate(item.submitted_at)}</span></div>
              <StatusBadge status={item.submission_status}/>
            </div>
          )) : data?.upcoming_deadlines?.map(item => (
            <div className="list-row" key={item.id}>
              <div><strong>{item.title}</strong><span>Deadline: {formatDate(item.deadline)}</span></div>
              <span className="deadline-dot">●</span>
            </div>
          ))}
        </section>

        <section className="panel">
          <div className="panel-title"><h2>{teacher ? "Upcoming Deadlines" : "Recent Feedback"}</h2></div>
          {teacher ? data?.upcoming_deadlines?.map(item => (
            <div className="list-row" key={item.id}>
              <div><strong>{item.title}</strong><span>{formatDate(item.deadline)}</span></div>
            </div>
          )) : data?.recent_feedback?.map(item => (
            <div className="list-row" key={item.id}>
              <div><strong>{item.feedback || "No written feedback"}</strong><span>Marks: {item.marks ?? "—"}</span></div>
              <CheckCircle2 size={18} />
            </div>
          ))}
          {!teacher && !data?.recent_feedback?.length && <div className="empty">No graded submissions yet.</div>}
        </section>
      </div>
    </Layout>
  );
}
