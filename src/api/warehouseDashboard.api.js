// src/api/warehouseDashboard.api.js

import http from "./http";

export async function getWarehouseDashboard() {
  const res = await http.get("/warehouse-dashboard");
  return res.data.data || res.data;
}