import api from "./api";

export const getStudentDashboard = async () =>
  (await api.get("/dashboard/student")).data;

export const getTeacherDashboard = async () =>
  (await api.get("/dashboard/teacher")).data;
