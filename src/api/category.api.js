import http from "./http";

export async function getCategories() {
  const res = await http.get("/categories");
  
  return res.data.data || res.data;
}

export async function createCategory(data) {
  const res = await http.post("/categories", data);
  return res.data.data || res.data;
}

export async function updateCategory(id, data) {
  const res = await http.patch(`/categories/${id}`, data);
  return res.data.data || res.data;
}

export async function deleteCategory(id) {
  const res = await http.delete(`/categories/${id}`);
  return res.data.data || res.data;
}