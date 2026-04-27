// src/api/auth.api.js
import http from "./http";

export function login(data) {
  return http.post("/auth/login", data);
}

export function getMe() {
  return http.get("/me");
}