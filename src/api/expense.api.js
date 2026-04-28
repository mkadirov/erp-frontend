import http from "./http";

export async function getExpenses() {
  const res = await http.get("/expenses");
  return res.data.data || res.data;
}

export async function createExpense(data) {
  const res = await http.post("/expenses", data);
  return res.data.data || res.data;
}

export async function updateExpense(id, data) {
  const res = await http.patch(`/expenses/${id}`, data);
  return res.data.data || res.data;
}

export async function deleteExpense(id) {
  const res = await http.delete(`/expenses/${id}`);
  return res.data.data || res.data;
}