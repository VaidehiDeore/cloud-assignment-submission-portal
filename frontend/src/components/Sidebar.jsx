import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ClipboardList, UploadCloud, LogOut, GraduationCap, PlusCircle
} from "lucide-react";
import { getUser } from "../utils/auth";
import { logout } from "../services/authService";

export default function Sidebar() {
  const navigate = useNavigate();
  const user = getUser();

  const links = user?.role === "teacher"
    ? [
        ["/dashboard", LayoutDashboard, "Dashboard"],
        ["/assignments", ClipboardList, "Assignments"],
        ["/create-assignment", PlusCircle, "Create Assignment"],
      ]
    : [
        ["/dashboard", LayoutDashboard, "Dashboard"],
        ["/assignments", ClipboardList, "Assignments"],
        ["/submissions", UploadCloud, "My Submissions"],
      ];

  function signOut() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><GraduationCap size={22} /></div>
        <div>
          <strong>CloudPortal</strong>
          <span>Assignment Hub</span>
        </div>
      </div>

      <div className="user-mini">
        <div className="avatar">{user?.email?.[0]?.toUpperCase() || "U"}</div>
        <div>
          <strong>{user?.email || "User"}</strong>
          <span>{user?.role || "student"}</span>
        </div>
      </div>

      <nav className="nav">
        {links.map(([to, Icon, label]) => (
          <NavLink key={to} to={to} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>

      <button className="nav-link logout-btn" onClick={signOut}>
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}
