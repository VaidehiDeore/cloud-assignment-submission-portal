import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, CalendarDays, ArrowRight } from "lucide-react";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import { getAssignments } from "../services/assignmentService";
import { getUser } from "../utils/auth";
import { formatDate } from "../utils/formatters";

export default function Assignments() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const user = getUser();

  useEffect(() => {
    getAssignments().then(r => setItems(r.assignments || [])).catch(() => setError("Unable to load assignments."));
  }, []);

  return (
    <Layout>
      <header className="page-header">
        <div>
          <div className="eyebrow">COURSEWORK</div>
          <h1>Assignments</h1>
          <p>Browse coursework and manage submission activity.</p>
        </div>
        {user?.role === "teacher" && <Link className="primary-btn small" to="/create-assignment"><Plus size={17}/> New Assignment</Link>}
      </header>

      {error && <div className="alert error">{error}</div>}

      <div className="assignment-grid">
        {items.map(item => (
          <article className="assignment-card" key={item.id}>
            <div className="card-top"><span className="tag">COURSEWORK</span><StatusBadge status={item.allow_late_submission ? "OPEN" : "STRICT"}/></div>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <div className="assignment-meta">
              <span><CalendarDays size={16}/> {formatDate(item.deadline)}</span>
              <span>{item.max_marks} marks</span>
            </div>
            <Link to={`/assignments/${item.id}`} className="text-link">Open assignment <ArrowRight size={16}/></Link>
          </article>
        ))}
      </div>
      {!items.length && <div className="empty panel">No assignments available.</div>}
    </Layout>
  );
}
