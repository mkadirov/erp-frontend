import http from "./http";

export async function getProjects() {
  const res = await http.get("/projects");
  return res.data.data || res.data;
}

export async function getProjectById(id) {
  const res = await http.get(`/projects/${id}`);
  return res.data.data || res.data;
}

export async function createProject(data) {
  const res = await http.post("/projects", data);
  return res.data.data || res.data;
}

export async function updateProject(id, data) {
  const res = await http.patch(`/projects/${id}`, data);
  return res.data.data || res.data;
}

export async function deleteProject(id) {
  const res = await http.delete(`/projects/${id}`);
  return res.data.data || res.data;
}

export async function getProjectMaterials(id) {
  const res = await http.get(`/projects/${id}/materials`);
  return res.data.data || res.data;
}

export async function getProjectSummary(id) {
  const res = await http.get(`/projects/${id}/summary`);
  return res.data.data || res.data;
}