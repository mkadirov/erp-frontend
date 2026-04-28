import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";

import {
  getTransactions,
  createTransaction,
  deleteTransaction,
} from "../../api/transaction.api";

import { getProducts } from "../../api/product.api";
import { getProjects } from "../../api/project.api";

function formatMoney(value = 0) {
  return new Intl.NumberFormat("uz-UZ").format(value) + " so'm";
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("uz-UZ");
}

export default function Transactions() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    type: "IN",
    productId: "",
    quantity: "",
    price: "",
    projectId: "",
    note: "",
  });

  const {
    data: transactionsData = [],
    isLoading: transactionsLoading,
    isError: transactionsError,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  const { data: productsData = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const { data: projectsData = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const transactions = Array.isArray(transactionsData)
    ? transactionsData
    : [];

  const products = Array.isArray(productsData?.products) ? productsData?.products : [];
  const projects = Array.isArray(projectsData) ? projectsData : [];

  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["warehouse-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      setForm({
        type: "IN",
        productId: "",
        quantity: "",
        price: "",
        projectId: "",
        note: "",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["warehouse-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => {
      const next = {
        ...prev,
        [name]: value,
      };

      if (name === "type" && value === "IN") {
        next.projectId = "";
      }

      if (name === "type" && value === "OUT") {
        next.price = "";
      }

      return next;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.productId || !form.quantity || Number(form.quantity) <= 0) {
      return;
    }

    if (form.type === "IN" && (!form.price || Number(form.price) <= 0)) {
      return;
    }

    if (form.type === "OUT" && !form.projectId) {
      return;
    }

    const payload = {
      type: form.type,
      productId: Number(form.productId),
      quantity: Number(form.quantity),
      note: form.note.trim() || undefined,
    };

    if (form.type === "IN") {
      payload.price = Number(form.price);
    }

    if (form.type === "OUT") {
      payload.projectId = Number(form.projectId);
    }

    createMutation.mutate(payload);
  }

  function handleDelete(id) {
    const confirmed = window.confirm(
      "Bu transactionni o‘chirmoqchimisiz?"
    );

    if (confirmed) {
      deleteMutation.mutate(id);
    }
  }

  if (transactionsLoading || productsLoading || projectsLoading) {
    return <div className="p-6">Yuklanmoqda...</div>;
  }

  if (transactionsError) {
    return (
      <div className="p-6 text-red-500">
        Transactionlarni yuklashda xatolik yuz berdi.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Transactionlar
        </h1>
        <p className="text-sm text-slate-500">
          Omborga kirim va projectga chiqim operatsiyalari
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
          >
            <option value="IN">Kirim / IN</option>
            <option value="OUT">Chiqim / OUT</option>
          </select>

          <select
            name="productId"
            value={form.productId}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
          >
            <option value="">Mahsulot tanlang</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.unit})
              </option>
            ))}
          </select>

          <input
            type="number"
            name="quantity"
            placeholder="Miqdor"
            value={form.quantity}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
          />

          {form.type === "IN" && (
            <input
              type="number"
              name="price"
              placeholder="Narx"
              value={form.price}
              onChange={handleChange}
              className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            />
          )}

          {form.type === "OUT" && (
            <select
              name="projectId"
              value={form.projectId}
              onChange={handleChange}
              className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            >
              <option value="">Project tanlang</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          )}

          <input
            type="text"
            name="note"
            placeholder="Izoh"
            value={form.note}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            <Plus size={18} />
            Qo‘shish
          </button>
        </div>

        {form.type === "OUT" && (
          <p className="mt-3 text-sm text-amber-600">
            OUT transaction uchun price yuborilmaydi. Backend average cost
            asosida hisoblaydi.
          </p>
        )}
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                ID
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Turi
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Mahsulot
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Miqdor
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Narx
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Project
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
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="px-5 py-8 text-center text-slate-500"
                >
                  Hozircha transaction yo‘q
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {transaction.id}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        transaction.type === "IN"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-orange-50 text-orange-700"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-medium text-slate-900">
                    {transaction.product?.name || "-"}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {transaction.quantity} {transaction.product?.unit || ""}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {transaction.price ? formatMoney(transaction.price) : "-"}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {transaction.project?.name || "-"}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {formatDate(transaction.createdAt)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDelete(transaction.id)}
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