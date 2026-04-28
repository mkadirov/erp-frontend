// src/pages/auth/Login.jsx

import { useState } from "react";
import { Mail, LockKeyhole, Loader2 } from "lucide-react";
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

      const data = res.data.data || res.data;

      if (!data?.token) {
        throw new Error("Token kelmadi");
      }

      setAuth(data);

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
    <div className="min-h-screen bg-slate-50 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
              <span className="text-2xl font-bold">M</span>
            </div>

            <h1 className="text-3xl font-bold text-slate-900">Magnus</h1>
            <p className="mt-1 text-sm text-slate-500">ERP boshqaruv tizimi</p>
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-slate-900">
              Xush kelibsiz
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Hisobingizga kirish uchun ma’lumotlaringizni kiriting
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email manzil
              </label>

              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email manzilingizni kiriting"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Parol
              </label>

              <div className="relative">
                <LockKeyhole
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  name="password"
                  type="password"
                  placeholder="Parolingizni kiriting"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          <button
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Kirilmoqda..." : "Kirish"}
          </button>

          <p className="mt-6 text-center text-xs text-slate-400">
            Magnus ERP — biznesingizni samarali boshqaring
          </p>
        </form>
      </div>
    </div>
  );
}