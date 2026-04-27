// src/pages/auth/Login.jsx

import { useState } from "react";
import { login } from "../../api/auth.api";
import { setAuth } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

 async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await login(form);

    // 🔥 universal parsing
    const data = res.data.data || res.data;

    if (!data?.token) {
      throw new Error("Token kelmadi");
    }

    // token + user saqlaymiz
    setAuth(data);

    // role bo‘yicha redirect
    const role = data.user.role;

    if (role === "SUPER_ADMIN") {
      navigate("/companies");
    } else if (role === "WAREHOUSE") {
      navigate("/warehouse-dashboard");
    } else {
      navigate("/dashboard");
    }

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    setError(err.response?.data?.message || err.message || "Login error");
  } finally {
    setLoading(false);
  }
}
  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-80"
      >
        <h1 className="text-xl font-bold mb-4">Login</h1>

        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3"
          onChange={handleChange}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}