import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, X, Power, PowerOff } from "lucide-react";

import {
  getCompanyUsers,
  createCompanyUser,
  updateCompanyUser,
  updateCompanyUserStatus,
} from "../../api/companyUser.api";

function getRoleLabel(role) {
  if (role === "MANAGER") return "Manager";
  if (role === "ACCOUNTANT") return "Accountant";
  if (role === "WAREHOUSE") return "Warehouse";
  return role || "-";
}

function getRoleClass(role) {
  if (role === "MANAGER") return "bg-blue-50 text-blue-700";
  if (role === "ACCOUNTANT") return "bg-purple-50 text-purple-700";
  if (role === "WAREHOUSE") return "bg-emerald-50 text-emerald-700";
  return "bg-slate-50 text-slate-700";
}

export default function CompanyUsers() {
  const queryClient = useQueryClient();

  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "MANAGER",
  });

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["company-users"],
    queryFn: getCompanyUsers,
  });

  const users = Array.isArray(data) ? data : [];

  const createMutation = useMutation({
    mutationFn: createCompanyUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-users"] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCompanyUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-users"] });
      resetForm();
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, data }) => updateCompanyUserStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-users"] });
    },
  });

  function resetForm() {
    setEditingUser(null);
    setForm({
      name: "",
      email: "",
      password: "",
      role: "MANAGER",
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.role) return;

    if (!editingUser) {
      if (!form.email.trim() || !form.password.trim()) return;

      createMutation.mutate({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });

      return;
    }

    updateMutation.mutate({
      id: editingUser.id,
      data: {
        name: form.name.trim(),
        role: form.role,
      },
    });
  }

  function handleEdit(user) {
    setEditingUser(user);

    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "MANAGER",
    });
  }

  function handleToggleStatus(user) {
    const actionText = user.isActive ? "disable" : "enable";

    const confirmed = window.confirm(
      `Bu userni ${actionText} qilmoqchimisiz?`
    );

    if (!confirmed) return;

    statusMutation.mutate({
      id: user.id,
      data: {
        isActive: !user.isActive,
      },
    });
  }

  if (isLoading) {
    return <div className="p-6">Yuklanmoqda...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Company userlarni yuklashda xatolik yuz berdi.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Company Users</h1>
        <p className="text-sm text-slate-500">
          Company ichidagi manager, accountant va warehouse userlarni boshqarish
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
          <input
            type="text"
            name="name"
            placeholder="Ism"
            value={form.name}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            disabled={!!editingUser}
            className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
          />

          <input
            type="password"
            name="password"
            placeholder={editingUser ? "Password o‘zgarmaydi" : "Password"}
            value={form.password}
            onChange={handleChange}
            disabled={!!editingUser}
            className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
          >
            <option value="MANAGER">Manager</option>
            <option value="ACCOUNTANT">Accountant</option>
            <option value="WAREHOUSE">Warehouse</option>
          </select>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              <Plus size={18} />
              {editingUser ? "Saqlash" : "Qo‘shish"}
            </button>

            {editingUser && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                ID
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Ism
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Email
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Role
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Status
              </th>
              <th className="px-5 py-3 text-right text-sm font-semibold text-slate-600">
                Amallar
              </th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-5 py-8 text-center text-slate-500"
                >
                  Hozircha company user yo‘q
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {user.id}
                  </td>

                  <td className="px-5 py-4 font-medium text-slate-900">
                    {user.name}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {user.email}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleClass(
                        user.role
                      )}`}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(user)}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(user)}
                        disabled={statusMutation.isPending}
                        className={`rounded-lg p-2 disabled:opacity-50 ${
                          user.isActive
                            ? "text-red-600 hover:bg-red-50"
                            : "text-emerald-600 hover:bg-emerald-50"
                        }`}
                      >
                        {user.isActive ? (
                          <PowerOff size={18} />
                        ) : (
                          <Power size={18} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}