import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Assignments from "./pages/Assignments";
import AssignmentDetails from "./pages/AssignmentDetails";
import CreateAssignment from "./pages/CreateAssignment";
import MySubmissions from "./pages/MySubmissions";
import TeacherSubmissions from "./pages/TeacherSubmissions";
import ProtectedRoute from "./components/ProtectedRoute";
import { isLoggedIn } from "./utils/auth";

function HomeRedirect() {
  return <Navigate to={isLoggedIn() ? "/dashboard" : "/login"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
      <Route path="/assignments/:id" element={<ProtectedRoute><AssignmentDetails /></ProtectedRoute>} />

      <Route path="/create-assignment" element={<ProtectedRoute roles={["teacher"]}><CreateAssignment /></ProtectedRoute>} />
      <Route path="/submissions" element={<ProtectedRoute roles={["student"]}><MySubmissions /></ProtectedRoute>} />
      <Route path="/assignments/:id/submissions" element={<ProtectedRoute roles={["teacher"]}><TeacherSubmissions /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
