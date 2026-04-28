import http from "./http";

export async function getProducts() {
  const res = await http.get("/products");
  console.log(res?.data);
  
  return res?.data?.data || res?.data;
}

export async function createProduct(data) {
  const res = await http.post("/products", data);
  return res?.data?.data || res.data;
}

export async function updateProduct(id, data) {
  const res = await http.patch(`/products/${id}`, data);
  return res?.data?.data || res?.data;
}

export async function deleteProduct(id) {
  const res = await http.delete(`/products/${id}`);
  return res?.data?.data || res?.data;
}