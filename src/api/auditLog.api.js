import http from "./http";

export async function getAuditLogs(page = 1, limit = 20) {
  const res = await http.get(`/audit-logs?page=${page}&limit=${limit}`);
  return res.data.data || res.data;
}