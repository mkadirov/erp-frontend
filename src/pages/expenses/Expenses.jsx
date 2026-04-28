import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X } from "lucide-react";

import {
  getExpenseCategories,
  createExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
} from "../../api/expenseCategory.api";

import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../../api/expense.api";

import { getProjects } from "../../api/project.api";

function formatMoney(value = 0) {
  return new Intl.NumberFormat("uz-UZ").format(value) + " so'm";
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("uz-UZ");
}

export default function Expenses() {
  const queryClient = useQueryClient();

  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    categoryId: "",
    projectId: "",
    description: "",
    date: "",
  });

  const [editingExpense, setEditingExpense] = useState(null);

  const {
    data: categoriesData = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery({
    queryKey: ["expense-categories"],
    queryFn: getExpenseCategories,
  });

  const {
    data: expensesData = [],
    isLoading: expensesLoading,
    isError: expensesError,
  } = useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });

  const { data: projectsData = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  const expenses = Array.isArray(expensesData) ? expensesData : [];
  const projects = Array.isArray(projectsData) ? projectsData : [];

  const createCategoryMutation = useMutation({
    mutationFn: createExpenseCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
      setCategoryName("");
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }) => updateExpenseCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
      setCategoryName("");
      setEditingCategory(null);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteExpenseCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
    },
  });

  const createExpenseMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      resetExpenseForm();
    },
  });

  const updateExpenseMutation = useMutation({
    mutationFn: ({ id, data }) => updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      resetExpenseForm();
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  function resetExpenseForm() {
    setExpenseForm({
      amount: "",
      categoryId: "",
      projectId: "",
      description: "",
      date: "",
    });
    setEditingExpense(null);
  }

  function handleCategorySubmit(e) {
    e.preventDefault();

    if (!categoryName.trim()) return;

    const payload = {
      name: categoryName.trim(),
    };

    if (editingCategory) {
      updateCategoryMutation.mutate({
        id: editingCategory.id,
        data: payload,
      });
    } else {
      createCategoryMutation.mutate(payload);
    }
  }

  function handleCategoryEdit(category) {
    setEditingCategory(category);
    setCategoryName(category.name);
  }

  function handleCategoryDelete(id) {
    const confirmed = window.confirm(
      "Bu xarajat kategoriyasini o‘chirmoqchimisiz?"
    );

    if (confirmed) {
      deleteCategoryMutation.mutate(id);
    }
  }

  function cancelCategoryEdit() {
    setEditingCategory(null);
    setCategoryName("");
  }

  function handleExpenseChange(e) {
    const { name, value } = e.target;

    setExpenseForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleExpenseSubmit(e) {
    e.preventDefault();

    if (
      !expenseForm.amount ||
      Number(expenseForm.amount) <= 0 ||
      !expenseForm.categoryId
    ) {
      return;
    }

    const payload = {
      amount: Number(expenseForm.amount),
      categoryId: Number(expenseForm.categoryId),
      description: expenseForm.description.trim() || undefined,
      projectId: expenseForm.projectId
        ? Number(expenseForm.projectId)
        : undefined,
      date: expenseForm.date || undefined,
    };

    if (editingExpense) {
      updateExpenseMutation.mutate({
        id: editingExpense.id,
        data: payload,
      });
    } else {
      createExpenseMutation.mutate(payload);
    }
  }

  function handleExpenseEdit(expense) {
    setEditingExpense(expense);

    setExpenseForm({
      amount: expense.amount ? String(expense.amount) : "",
      categoryId: expense.categoryId ? String(expense.categoryId) : "",
      projectId: expense.projectId ? String(expense.projectId) : "",
      description: expense.description || "",
      date: expense.date ? expense.date.slice(0, 10) : "",
    });
  }

  function handleExpenseDelete(id) {
    const confirmed = window.confirm("Bu xarajatni o‘chirmoqchimisiz?");

    if (confirmed) {
      deleteExpenseMutation.mutate(id);
    }
  }

  if (categoriesLoading || expensesLoading || projectsLoading) {
    return <div className="p-6">Yuklanmoqda...</div>;
  }

  if (categoriesError || expensesError) {
    return (
      <div className="p-6 text-red-500">
        Xarajatlar ma’lumotlarini yuklashda xatolik yuz berdi.
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Xarajatlar</h1>
        <p className="text-sm text-slate-500">
          Xarajat kategoriyalari va xarajatlarni boshqarish
        </p>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Xarajat kategoriyalari
          </h2>
          <p className="text-sm text-slate-500">
            Transport, ish haqi, texnika, ijara kabi kategoriyalar
          </p>
        </div>

        <form
          onSubmit={handleCategorySubmit}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              placeholder="Kategoriya nomi"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="flex-1 rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={
                createCategoryMutation.isPending ||
                updateCategoryMutation.isPending
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              <Plus size={18} />
              {editingCategory ? "Saqlash" : "Qo‘shish"}
            </button>

            {editingCategory && (
              <button
                type="button"
                onClick={cancelCategoryEdit}
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
                    Hozircha xarajat kategoriyasi yo‘q
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
                          onClick={() => handleCategoryEdit(category)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCategoryDelete(category.id)}
                          disabled={deleteCategoryMutation.isPending}
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
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Xarajat qo‘shish
          </h2>
          <p className="text-sm text-slate-500">
            Projectga bog‘langan yoki umumiy xarajat qo‘shish
          </p>
        </div>

        <form
          onSubmit={handleExpenseSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-6">
            <input
              type="number"
              name="amount"
              placeholder="Summa"
              value={expenseForm.amount}
              onChange={handleExpenseChange}
              className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            />

            <select
              name="categoryId"
              value={expenseForm.categoryId}
              onChange={handleExpenseChange}
              className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            >
              <option value="">Kategoriya tanlang</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              name="projectId"
              value={expenseForm.projectId}
              onChange={handleExpenseChange}
              className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            >
              <option value="">Umumiy xarajat</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="date"
              value={expenseForm.date}
              onChange={handleExpenseChange}
              className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            />

            <input
              type="text"
              name="description"
              placeholder="Izoh"
              value={expenseForm.description}
              onChange={handleExpenseChange}
              className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={
                  createExpenseMutation.isPending ||
                  updateExpenseMutation.isPending
                }
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                <Plus size={18} />
                {editingExpense ? "Saqlash" : "Qo‘shish"}
              </button>

              {editingExpense && (
                <button
                  type="button"
                  onClick={resetExpenseForm}
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
                  Summa
                </th>
                <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                  Kategoriya
                </th>
                <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                  Project
                </th>
                <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                  Sana
                </th>
                <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                  Izoh
                </th>
                <th className="px-5 py-3 text-right text-sm font-semibold text-slate-600">
                  Amallar
                </th>
              </tr>
            </thead>

            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-8 text-center text-slate-500"
                  >
                    Hozircha xarajat yo‘q
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {expense.id}
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {formatMoney(expense.amount)}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {expense.category?.name || "-"}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {expense.project?.name || "Umumiy"}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {formatDate(expense.date)}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {expense.description || "-"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleExpenseEdit(expense)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleExpenseDelete(expense.id)}
                          disabled={deleteExpenseMutation.isPending}
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
      </section>
    </div>
  );
}