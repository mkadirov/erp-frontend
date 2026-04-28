import http from "./http";

export async function getExpenseCategories() {
  const res = await http.get("/expense-categories");
  return res.data.data || res.data;
}

export async function createExpenseCategory(data) {
  const res = await http.post("/expense-categories", data);
  return res.data.data || res.data;
}

export async function updateExpenseCategory(id, data) {
  const res = await http.patch(`/expense-categories/${id}`, data);
  return res.data.data || res.data;
}

export async function deleteExpenseCategory(id) {
  const res = await http.delete(`/expense-categories/${id}`);
  return res.data.data || res.data;
}