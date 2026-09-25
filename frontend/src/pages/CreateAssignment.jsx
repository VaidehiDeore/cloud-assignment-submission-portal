import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { createAssignment } from "../services/assignmentService";
import { errorMessage } from "../utils/formatters";

export default function CreateAssignment() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    course_id: "", title: "", description: "", deadline: "", max_marks: 100,
    allowed_file_types: ["pdf", "docx"], max_file_size: 10485760,
    allow_late_submission: true, allow_resubmission: true, max_attempts: 3,
  });
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      await createAssignment({
        ...form,
        deadline: new Date(form.deadline).toISOString(),
        max_marks: Number(form.max_marks),
        max_file_size: Number(form.max_file_size),
        max_attempts: Number(form.max_attempts),
      });
      navigate("/assignments");
    } catch (e) {
      setError(errorMessage(e));
    }
  }

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <Layout>
      <header className="page-header"><div><div className="eyebrow">TEACHER TOOLS</div><h1>Create Assignment</h1><p>Publish structured coursework with clear submission rules.</p></div></header>
      <form className="panel form-grid" onSubmit={submit}>
        {error && <div className="alert error span-2">{error}</div>}
        <div><label>Course ID</label><input required value={form.course_id} onChange={e => update("course_id", e.target.value)} placeholder="Course UUID" /></div>
        <div><label>Title</label><input required value={form.title} onChange={e => update("title", e.target.value)} /></div>
        <div className="span-2"><label>Description</label><textarea required rows="5" value={form.description} onChange={e => update("description", e.target.value)} /></div>
        <div><label>Deadline</label><input type="datetime-local" required value={form.deadline} onChange={e => update("deadline", e.target.value)} /></div>
        <div><label>Maximum Marks</label><input type="number" min="1" required value={form.max_marks} onChange={e => update("max_marks", e.target.value)} /></div>
        <div><label>Allowed File Types</label><input value={form.allowed_file_types.join(",")} onChange={e => update("allowed_file_types", e.target.value.split(",").map(x => x.trim()).filter(Boolean))} /></div>
        <div><label>Max Attempts</label><input type="number" min="1" value={form.max_attempts} onChange={e => update("max_attempts", e.target.value)} /></div>
        <label className="check"><input type="checkbox" checked={form.allow_late_submission} onChange={e => update("allow_late_submission", e.target.checked)}/> Allow late submissions</label>
        <label className="check"><input type="checkbox" checked={form.allow_resubmission} onChange={e => update("allow_resubmission", e.target.checked)}/> Allow resubmissions</label>
        <button className="primary-btn span-2">Publish Assignment</button>
      </form>
    </Layout>
  );
}
