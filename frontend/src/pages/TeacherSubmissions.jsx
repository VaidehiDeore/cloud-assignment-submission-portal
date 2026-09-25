import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import { getAssignmentSubmissions, getDownloadUrl } from "../services/submissionService";
import { gradeSubmission } from "../services/feedbackService";
import { formatDate, errorMessage } from "../utils/formatters";

export default function TeacherSubmissions() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const result = await getAssignmentSubmissions(id);
      setItems(result.submissions || []);
    } catch (e) { setError(errorMessage(e)); }
  }

  useEffect(() => { load(); }, [id]);

  async function download(submissionId) {
    try {
      const result = await getDownloadUrl(submissionId);
      window.open(result.download_url, "_blank", "noopener,noreferrer");
    } catch (e) { setError(errorMessage(e)); }
  }

  async function grade() {
    if (!selected) return;
    try {
      await gradeSubmission(selected.id, { marks: Number(marks), feedback });
      setSelected(null);
      setMarks("");
      setFeedback("");
      await load();
    } catch (e) { setError(errorMessage(e)); }
  }

  return (
    <Layout>
      <header className="page-header"><div><div className="eyebrow">TEACHER REVIEW</div><h1>Submission Review</h1><p>Review files and provide marks and written feedback.</p></div></header>
      {error && <div className="alert error">{error}</div>}
      <div className="review-layout">
        <section className="panel table-wrap">
          <table>
            <thead><tr><th>Student</th><th>Submitted</th><th>Status</th><th>File</th><th></th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.profiles?.name || item.profiles?.email || item.student_id.slice(0, 8)}</td>
                  <td>{formatDate(item.submitted_at)}</td>
                  <td><StatusBadge status={item.submission_status}/></td>
                  <td>{item.file_name}</td>
                  <td><button className="secondary-btn" onClick={() => { setSelected(item); setMarks(item.marks ?? ""); setFeedback(item.feedback ?? ""); }}>Review</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {selected && (
          <section className="panel grade-panel">
            <div className="eyebrow">EVALUATION</div>
            <h2>{selected.file_name}</h2>
            <button className="secondary-btn" onClick={() => download(selected.id)}>Open file</button>
            <label>Marks</label>
            <input type="number" min="0" value={marks} onChange={e => setMarks(e.target.value)} />
            <label>Feedback</label>
            <textarea rows="8" value={feedback} onChange={e => setFeedback(e.target.value)} />
            <button className="primary-btn full" onClick={grade}>Save Grade</button>
          </section>
        )}
      </div>
    </Layout>
  );
}
