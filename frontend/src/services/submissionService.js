import api from "./api";

export const submitAssignment = async (assignmentId, file) => {
  const form = new FormData();
  form.append("file", file);
  return (await api.post(`/assignments/${assignmentId}/submit`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  })).data;
};

export const getMySubmissions = async () => (await api.get("/submissions/me")).data;
export const getAssignmentSubmissions = async (id) => (await api.get(`/assignments/${id}/submissions`)).data;
export const getSubmission = async (id) => (await api.get(`/submissions/${id}`)).data;

export const getDownloadUrl = async (id) => {
  return (await api.get(`/submissions/${id}/download`)).data;
};
