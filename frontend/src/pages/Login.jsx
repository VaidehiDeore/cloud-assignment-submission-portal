import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cloud, LockKeyhole, Mail } from "lucide-react";
import { login } from "../services/authService";
import { errorMessage } from "../utils/formatters";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(form);
      navigate(result.user?.role === "teacher" ? "/dashboard" : "/dashboard");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to manage your coursework in the cloud.">
      <form onSubmit={submit} className="form">
        {error && <div className="alert error">{error}</div>}
        <label>Email</label>
        <div className="input-wrap"><Mail size={17} /><input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
        <label>Password</label>
        <div className="input-wrap"><LockKeyhole size={17} /><input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></div>
        <button className="primary-btn" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
        <p className="muted center">New student? <Link to="/register">Create an account</Link></p>
      </form>
    </AuthLayout>
  );
}

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-page">
      <div className="auth-brand"><Cloud size={22} /> CloudPortal</div>
      <div className="auth-card">
        <div className="eyebrow">SECURE CLOUD WORKSPACE</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
