import http from "./http";

export async function getTransactions() {
  const res = await http.get("/transactions");
  return res.data.data || res.data;
}

export async function getStock() {
  const res = await http.get("/transactions/stock");
  return res.data.data || res.data;
}

export async function createTransaction(data) {
  const res = await http.post("/transactions", data);
  return res.data.data || res.data;
}

export async function updateTransactionNote(id, data) {
  const res = await http.patch(`/transactions/${id}/note`, data);
  return res.data.data || res.data;
}

export async function deleteTransaction(id) {
  const res = await http.delete(`/transactions/${id}`);
  return res.data.data || res.data;
}