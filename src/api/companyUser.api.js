import http from "./http";

export async function getCompanyUsers() {
  const res = await http.get("/company-users");
  return res.data.data || res.data;
}

export async function createCompanyUser(data) {
  const res = await http.post("/company-users", data);
  return res.data.data || res.data;
}

export async function updateCompanyUser(id, data) {
  const res = await http.patch(`/company-users/${id}`, data);
  return res.data.data || res.data;
}

export async function updateCompanyUserStatus(id, data) {
  const res = await http.patch(`/company-users/${id}/status`, data);
  return res.data.data || res.data;
}