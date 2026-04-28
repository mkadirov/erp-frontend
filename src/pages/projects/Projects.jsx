import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../api/project.api";

function getStatusClass(status) {
  if (status === "ACTIVE") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "PAUSED") {
    return "bg-amber-50 text-amber-700";
  }

  if (status === "FINISHED") {
    return "bg-blue-50 text-blue-700";
  }

  return "bg-slate-50 text-slate-700";
}

function getStatusLabel(status) {
  if (status === "ACTIVE") return "Faol";
  if (status === "PAUSED") return "Pauza";
  if (status === "FINISHED") return "Tugagan";
  return status || "-";
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("uz-UZ");
}

export default function Projects() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [editingProject, setEditingProject] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "ACTIVE",
  });

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const projects = Array.isArray(data) ? data : [];

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function resetForm() {
    setEditingProject(null);
    setForm({
      name: "",
      description: "",
      status: "ACTIVE",
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) return;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      status: form.status,
    };

    if (editingProject) {
      updateMutation.mutate({
        id: editingProject.id,
        data: payload,
      });
    } else {
      createMutation.mutate(payload);
    }
  }

  function handleEdit(project) {
    setEditingProject(project);

    setForm({
      name: project.name || "",
      description: project.description || "",
      status: project.status || "ACTIVE",
    });
  }

  function handleDelete(id) {
    const confirmed = window.confirm("Bu projectni o‘chirmoqchimisiz?");

    if (confirmed) {
      deleteMutation.mutate(id);
    }
  }

  if (isLoading) {
    return <div className="p-6">Yuklanmoqda...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Projectlarni yuklashda xatolik yuz berdi.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Projectlar</h1>
        <p className="text-sm text-slate-500">
          Qurilish projectlarini boshqarish
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
            placeholder="Project nomi"
            value={form.name}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500 lg:col-span-1"
          />

          <input
            type="text"
            name="description"
            placeholder="Izoh"
            value={form.description}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500 lg:col-span-2"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
          >
            <option value="ACTIVE">Faol</option>
            <option value="PAUSED">Pauza</option>
            <option value="FINISHED">Tugagan</option>
          </select>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              <Plus size={18} />
              {editingProject ? "Saqlash" : "Qo‘shish"}
            </button>

            {editingProject && (
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
                Nomi
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Izoh
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Status
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Sana
              </th>
              <th className="px-5 py-3 text-right text-sm font-semibold text-slate-600">
                Amallar
              </th>
            </tr>
          </thead>

          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-5 py-8 text-center text-slate-500"
                >
                  Hozircha project yo‘q
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {project.id}
                  </td>

                  <td className="px-5 py-4 font-medium text-slate-900">
                    {project.name}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {project.description || "-"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                        project.status
                      )}`}
                    >
                      {getStatusLabel(project.status)}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {formatDate(project.createdAt)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEdit(project)}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(project.id)}
                        disabled={deleteMutation.isPending}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 size={18} />
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