import http from "./http";

export async function getTransactions(params = {}) {
  const res = await http.get("/transactions", {
    params,
  });

  // backend:
  // { message, data: { data: [], pagination: {} } }

  return res.data.data;
}

export async function getAllTransactionsForDashboard() {
  const res = await http.get("/transactions", {
    params: {
      page: 1,
      limit: 100000,
    },
  });

  return res.data.data?.data || [];
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