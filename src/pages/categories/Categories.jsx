import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/category.api";
import { Plus, Pencil, Trash2, X } from "lucide-react";

export default function Categories() {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories = Array.isArray(data?.categories) ? data?.categories : [];

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setName("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setName("");
      setEditingCategory(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) return;

    if (editingCategory) {
      updateMutation.mutate({
        id: editingCategory.id,
        data: { name: name.trim() },
      });
    } else {
      createMutation.mutate({
        name: name.trim(),
      });
    }
  }

  function handleEdit(category) {
    setEditingCategory(category);
    setName(category.name);
  }

  function handleCancelEdit() {
    setEditingCategory(null);
    setName("");
  }

  function handleDelete(id) {
    const isConfirmed = window.confirm(
      "Bu kategoriyani o‘chirmoqchimisiz?"
    );

    if (isConfirmed) {
      deleteMutation.mutate(id);
    }
  }

  if (isLoading) {
    return <div className="p-6">Yuklanmoqda...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Kategoriyalarni yuklashda xatolik yuz berdi.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Kategoriyalar
        </h1>
        <p className="text-sm text-slate-500">
          Mahsulot kategoriyalarini boshqarish
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            placeholder="Kategoriya nomi"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            <Plus size={18} />
            {editingCategory ? "Saqlash" : "Qo‘shish"}
          </button>

          {editingCategory && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-2 text-slate-700 hover:bg-slate-50"
            >
              <X size={18} />
              Bekor qilish
            </button>
          )}
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
              <th className="px-5 py-3 text-right text-sm font-semibold text-slate-600">
                Amallar
              </th>
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="px-5 py-8 text-center text-slate-500"
                >
                  Hozircha kategoriya yo‘q
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {category.id}
                  </td>

                  <td className="px-5 py-4 font-medium text-slate-900">
                    {category.name}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(category)}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(category.id)}
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