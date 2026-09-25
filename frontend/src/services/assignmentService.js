import api from "./api";

export const getAssignments = async () => (await api.get("/assignments")).data;
export const getAssignment = async (id) => (await api.get(`/assignments/${id}`)).data;
export const createAssignment = async (payload) => (await api.post("/assignments", payload)).data;
export const updateAssignment = async (id, payload) => (await api.put(`/assignments/${id}`, payload)).data;
export const deleteAssignment = async (id) => (await api.delete(`/assignments/${id}`)).data;
