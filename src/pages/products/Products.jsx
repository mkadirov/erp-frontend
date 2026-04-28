import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X } from "lucide-react";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/product.api";

import { getCategories } from "../../api/category.api";

export default function Products() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    unit: "",
    categoryId: "",
  });

  const [editingProduct, setEditingProduct] = useState(null);

  const {
    data: productsData = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const {
    data: categoriesData = [],
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const products = Array.isArray(productsData?.products) ? productsData?.products : [];
  const categories = Array.isArray(categoriesData?.categories) ? categoriesData?.categories : [];

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
    setForm({
      name: "",
      unit: "",
      categoryId: "",
    });
    setEditingProduct(null);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.unit.trim() || !form.categoryId) {
      return;
    }

    const payload = {
      name: form.name.trim(),
      unit: form.unit.trim(),
      categoryId: Number(form.categoryId),
    };

    if (editingProduct) {
      updateMutation.mutate({
        id: editingProduct.id,
        data: payload,
      });
    } else {
      createMutation.mutate(payload);
    }
  }

  function handleEdit(product) {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      unit: product.unit || "",
      categoryId: product.categoryId ? String(product.categoryId) : "",
    });
  }

  function handleDelete(id) {
    const confirmed = window.confirm("Bu mahsulotni o‘chirmoqchimisiz?");

    if (confirmed) {
      deleteMutation.mutate(id);
    }
  }

  if (productsLoading || categoriesLoading) {
    return <div className="p-6">Yuklanmoqda...</div>;
  }

  if (productsError) {
    return (
      <div className="p-6 text-red-500">
        Mahsulotlarni yuklashda xatolik yuz berdi.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mahsulotlar</h1>
        <p className="text-sm text-slate-500">
          Ombor mahsulotlari va materiallarini boshqarish
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <input
            type="text"
            name="name"
            placeholder="Mahsulot nomi"
            value={form.name}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
          />

          <input
            type="text"
            name="unit"
            placeholder="Birlik: kg, dona, m3..."
            value={form.unit}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
          />

          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
          >
            <option value="">Kategoriya tanlang</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              <Plus size={18} />
              {editingProduct ? "Saqlash" : "Qo‘shish"}
            </button>

            {editingProduct && (
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
                Birlik
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Kategoriya
              </th>
              <th className="px-5 py-3 text-right text-sm font-semibold text-slate-600">
                Amallar
              </th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-5 py-8 text-center text-slate-500"
                >
                  Hozircha mahsulot yo‘q
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {product.id}
                  </td>

                  <td className="px-5 py-4 font-medium text-slate-900">
                    {product.name}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {product.unit}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {product.category?.name || "-"}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
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