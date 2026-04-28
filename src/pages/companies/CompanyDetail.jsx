import { useParams } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createCompanyAdmin } from "../../api/company.api";

export default function CompanyDetail() {
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const createAdminMutation = useMutation({
    mutationFn: (data) => createCompanyAdmin(id, data),
  });

  function handleSubmit(e) {
    e.preventDefault();
    createAdminMutation.mutate(form);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Company Detail</h1>
        <p className="text-gray-500">Company ID: {id}</p>
      </div>

      {/* COMPANY INFO (hozircha minimal) */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="font-medium text-gray-900">Company Info</h2>
        <p className="text-sm text-gray-500">
          Bu yerga keyin company data qo‘shamiz
        </p>
      </div>

      {/* ADMIN FORM */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="font-medium text-gray-900">Add Admin</h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full border px-3 py-2 rounded-lg"
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full border px-3 py-2 rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full border px-3 py-2 rounded-lg"
          />

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Create Admin
          </button>
        </form>
      </div>
    </div>
  );
}