import api from "./api";

export const gradeSubmission = async (id, payload) =>
  (await api.post(`/submissions/${id}/grade`, payload)).data;

export const getFeedback = async (id) =>
  (await api.get(`/submissions/${id}/feedback`)).data;
