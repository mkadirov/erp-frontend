import http from "./http";

export async function getDashboard() {
  const res = await http.get("/dashboard");
  return res.data.data || res.data;
}