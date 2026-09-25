import { useEffect, useState } from "react";
import { Download, MessageSquare } from "lucide-react";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import { getMySubmissions, getDownloadUrl } from "../services/submissionService";
import { formatDate, errorMessage } from "../utils/formatters";

export default function MySubmissions() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getMySubmissions().then(r => setItems(r.submissions || [])).catch(e => setError(errorMessage(e)));
  }, []);

  async function download(id) {
    try {
      const result = await getDownloadUrl(id);
      window.open(result.download_url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setError(errorMessage(e));
    }
  }

  return (
    <Layout>
      <header className="page-header"><div><div className="eyebrow">YOUR WORK</div><h1>My Submissions</h1><p>Review submission status, marks and feedback.</p></div></header>
      {error && <div className="alert error">{error}</div>}
      <div className="table-wrap panel">
        <table>
          <thead><tr><th>Assignment</th><th>Submitted</th><th>Status</th><th>Marks</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td><strong>{item.assignments?.title || "Assignment"}</strong><span className="cell-sub">{item.file_name}</span></td>
                <td>{formatDate(item.submitted_at)}</td>
                <td><StatusBadge status={item.submission_status}/></td>
                <td>{item.marks ?? "—"} {item.assignments?.max_marks ? `/ ${item.assignments.max_marks}` : ""}</td>
                <td><button className="icon-btn" onClick={() => download(item.id)} title="Download"><Download size={17}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!items.length && <div className="empty">No submissions yet.</div>}
      </div>
    </Layout>
  );
}
