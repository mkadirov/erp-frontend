import http from "./http";

export async function getCompanies() {
  const res = await http.get("/companies");

  console.log("API RESPONSE:", res.data); // DEBUG

  return res.data || []; // MUHIM
}

export async function createCompany(data) {
  const res = await http.post("/companies", data);
  return res.data;
}

export async function toggleCompanyStatus(id, data) {
  const res = await http.patch(`/companies/${id}/status`, data);
  return res.data;
}

export async function createCompanyAdmin(companyId, data) {
  const res = await http.post(`/companies/${companyId}/admins`, data);
  return res.data;
}