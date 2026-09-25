import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import { register } from "../services/authService";
import { errorMessage } from "../utils/formatters";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await register(form);
      setMessage("Registration successful. You can now sign in.");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-brand">☁ CloudPortal</div>
      <div className="auth-card">
        <div className="eyebrow">STUDENT REGISTRATION</div>
        <h1>Create your account</h1>
        <p>Start submitting, tracking and reviewing coursework online.</p>
        <form onSubmit={submit} className="form">
          {error && <div className="alert error">{error}</div>}
          {message && <div className="alert success">{message}</div>}
          <label>Name</label>
          <div className="input-wrap"><User size={17}/><input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}/></div>
          <label>Email</label>
          <div className="input-wrap"><Mail size={17}/><input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}/></div>
          <label>Password</label>
          <div className="input-wrap"><Lock size={17}/><input type="password" minLength="8" required value={form.password} onChange={e => setForm({...form, password: e.target.value})}/></div>
          <button className="primary-btn" disabled={loading}>{loading ? "Creating..." : "Create Student Account"}</button>
          <p className="muted center">Already registered? <Link to="/login">Sign in</Link></p>
        </form>
      </div>
    </div>
  );
}
