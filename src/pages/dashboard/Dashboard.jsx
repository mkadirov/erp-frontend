import { useQuery } from "@tanstack/react-query";
import {
  FolderKanban,
  Activity,
  CheckCircle2,
  Wallet,
  ReceiptText,
  AlertTriangle,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import { getDashboard } from "../../api/dashboard.api";
import { getTransactions } from "../../api/transaction.api";
import { getExpenses } from "../../api/expense.api";

function formatMoney(value = 0) {
  return new Intl.NumberFormat("uz-UZ").format(value || 0) + " so'm";
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
        </div>

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f97316",
  "#9333ea",
  "#dc2626",
  "#0891b2",
  "#ca8a04",
];

function groupMaterialCosts(transactions = []) {
  const map = {};

  transactions
    .filter((item) => item.type === "OUT")
    .forEach((item) => {
      const name = item.product?.name || "Noma’lum material";
      const cost = Number(item.quantity || 0) * Number(item.price || 0);
      map[name] = (map[name] || 0) + cost;
    });

  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

function groupExpenseCosts(expenses = []) {
  const map = {};

  expenses.forEach((item) => {
    const name = item.category?.name || "Noma’lum xarajat";
    const cost = Number(item.amount || 0);
    map[name] = (map[name] || 0) + cost;
  });

  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

function PieCard({ title, description, data = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      {data.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name }) => name}
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip formatter={(value) => formatMoney(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-80 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
          Ma’lumot mavjud emas
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    isError: dashboardIsError,
    error: dashboardError,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  const { data: expenses = [], isLoading: expensesLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });

  if (dashboardLoading || transactionsLoading || expensesLoading) {
    return <div className="text-slate-500">Dashboard yuklanmoqda...</div>;
  }

  if (dashboardIsError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
        {dashboardError?.response?.data?.message ||
          "Dashboard ma’lumotlarini olishda xatolik"}
      </div>
    );
  }

  const dashboard = dashboardData || {};
  const lowStockProducts = dashboard.lowStockProducts || [];

  const materialChartData = groupMaterialCosts(transactions);
  const expenseChartData = groupExpenseCosts(expenses);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Kompaniya bo‘yicha umumiy ko‘rsatkichlar
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Jami loyihalar"
          value={dashboard.totalProjects || 0}
          icon={FolderKanban}
          color="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Aktiv loyihalar"
          value={dashboard.activeProjects || 0}
          icon={Activity}
          color="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Tugallangan loyihalar"
          value={dashboard.completedProjects || 0}
          icon={CheckCircle2}
          color="bg-violet-50 text-violet-600"
        />

        <StatCard
          title="Material xarajatlari"
          value={formatMoney(dashboard.totalMaterialCost)}
          icon={Wallet}
          color="bg-orange-50 text-orange-600"
        />

        <StatCard
          title="Qo‘shimcha xarajatlar"
          value={formatMoney(dashboard.totalExpenseCost)}
          icon={ReceiptText}
          color="bg-cyan-50 text-cyan-600"
        />

        <StatCard
          title="Umumiy xarajat"
          value={formatMoney(dashboard.totalCost)}
          icon={Wallet}
          color="bg-slate-100 text-slate-700"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <PieCard
          title="Material xarajatlari"
          description="Materiallar bo‘yicha sarflangan xarajatlar"
          data={materialChartData}
        />

        <PieCard
          title="Boshqa xarajatlar"
          description="Xarajat kategoriyalari bo‘yicha taqsimot"
          data={expenseChartData}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-amber-500" />
            <h2 className="font-semibold text-slate-900">
              Kam qolgan mahsulotlar
            </h2>
          </div>
        </div>

        <div className="p-5">
          {lowStockProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-slate-500">
                    <th className="pb-3">Mahsulot</th>
                    <th className="pb-3">Birlik</th>
                    <th className="pb-3">Qoldiq</th>
                  </tr>
                </thead>

                <tbody>
                  {lowStockProducts.map((item) => (
                    <tr key={item.productId} className="border-b last:border-0">
                      <td className="py-3 font-medium text-slate-800">
                        {item.productName}
                      </td>
                      <td className="py-3 text-slate-500">{item.unit}</td>
                      <td className="py-3">
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                          {item.currentStock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Hozircha kam qolgan mahsulotlar yo‘q.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}