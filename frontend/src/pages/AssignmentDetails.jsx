import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UploadCloud, CalendarClock, ClipboardList } from "lucide-react";
import Layout from "../components/Layout";
import { getAssignment } from "../services/assignmentService";
import { submitAssignment } from "../services/submissionService";
import { errorMessage, formatDate } from "../utils/formatters";
import { getUser } from "../utils/auth";

export default function AssignmentDetails() {
  const { id } = useParams();
  const user = getUser();

  const [assignment, setAssignment] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAssignment(id)
      .then(setAssignment)
      .catch((e) => setError(errorMessage(e)));
  }, [id]);

  async function submit(e) {
    e.preventDefault();

    if (!file) {
      setError("Please select a file.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      await submitAssignment(id, file);
      setMessage("Assignment submitted successfully.");
      setFile(null);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  if (!assignment) {
    return (
      <Layout>
        <div className="loading">Loading assignment...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="detail-layout">

        {/* Assignment Information */}
        <section className="panel">
          <div className="eyebrow">ASSIGNMENT DETAILS</div>

          <h1>{assignment.title}</h1>

          <p className="large-text">
            {assignment.description}
          </p>

          <div className="detail-meta">
            <span>
              <CalendarClock size={18} />
              Deadline: {formatDate(assignment.deadline)}
            </span>

            <span>
              Maximum marks: {assignment.max_marks}
            </span>

            <span>
              Allowed:{" "}
              {(assignment.allowed_file_types || []).join(", ")}
            </span>
          </div>

          {/* Teacher Review Button */}
          {user?.role === "teacher" && (
            <div style={{ marginTop: "28px" }}>
              <Link
                to={`/assignments/${id}/submissions`}
                className="primary-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  textDecoration: "none",
                }}
              >
                <ClipboardList size={20} />
                Review Submissions
              </Link>
            </div>
          )}
        </section>

        {/* Student Upload Section */}
        {user?.role === "student" && (
          <section className="panel upload-panel">
            <h2>Submit your work</h2>

            <p className="muted">
              Upload the latest version of your assignment.
            </p>

            {error && (
              <div className="alert error">
                {error}
              </div>
            )}

            {message && (
              <div className="alert success">
                {message}
              </div>
            )}

            <form onSubmit={submit}>
              <label className="dropzone">
                <UploadCloud size={34} />

                <strong>
                  {file ? file.name : "Choose a file"}
                </strong>

                <span>
                  Drag/drop UI can be enhanced later.
                  File validation is enforced by the backend.
                </span>

                <input
                  type="file"
                  onChange={(e) =>
                    setFile(e.target.files?.[0] || null)
                  }
                  hidden
                />
              </label>

              <button
                className="primary-btn full"
                disabled={loading}
              >
                {loading
                  ? "Uploading..."
                  : "Submit Assignment"}
              </button>
            </form>
          </section>
        )}

      </div>
    </Layout>
  );
}