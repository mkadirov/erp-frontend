// src/pages/warehouse/WarehouseDashboard.jsx

import { useQuery } from "@tanstack/react-query";
import {
  Package,
  Boxes,
  Warehouse,
  Wallet,
  AlertTriangle,
  XCircle,
  ArrowDownUp,
} from "lucide-react";
import { getWarehouseDashboard } from "../../api/warehouseDashboard.api";

function formatMoney(value = 0) {
  return new Intl.NumberFormat("uz-UZ").format(value) + " so'm";
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

export default function WarehouseDashboard() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["warehouse-dashboard"],
    queryFn: getWarehouseDashboard,
  });

  if (isLoading) {
    return <div className="text-slate-500">Ombor dashboard yuklanmoqda...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
        {error?.response?.data?.message ||
          "Ombor dashboard ma’lumotlarini olishda xatolik"}
      </div>
    );
  }

  const dashboard = data || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Ombor Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Mahsulotlar, zaxira va oxirgi ombor harakatlari
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Jami mahsulotlar"
          value={dashboard.totalProducts || 0}
          icon={Package}
          color="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Jami kategoriyalar"
          value={dashboard.totalCategories || 0}
          icon={Boxes}
          color="bg-violet-50 text-violet-600"
        />

        <StatCard
          title="Umumiy zaxira"
          value={dashboard.totalStockQuantity || 0}
          icon={Warehouse}
          color="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Zaxira qiymati"
          value={formatMoney(dashboard.totalStockValue)}
          icon={Wallet}
          color="bg-orange-50 text-orange-600"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ProductTable
          title="Kam qolgan mahsulotlar"
          description="Zaxirasi 5 dan kam bo‘lgan mahsulotlar"
          icon={AlertTriangle}
          iconColor="text-amber-500"
          data={dashboard.lowStockProducts || []}
          emptyText="Kam qolgan mahsulotlar yo‘q"
          badgeClass="bg-amber-50 text-amber-700"
        />

        <ProductTable
          title="Tugagan mahsulotlar"
          description="Zaxirasi tugagan yoki 0 bo‘lgan mahsulotlar"
          icon={XCircle}
          iconColor="text-red-500"
          data={dashboard.outOfStockProducts || []}
          emptyText="Tugagan mahsulotlar yo‘q"
          badgeClass="bg-red-50 text-red-700"
        />
      </div>

      <RecentTransactions transactions={dashboard.recentTransactions || []} />
    </div>
  );
}

function ProductTable({
  title,
  description,
  icon: Icon,
  iconColor,
  data,
  emptyText,
  badgeClass,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <div className="flex items-center gap-2">
          <Icon size={20} className={iconColor} />
          <div>
            <h2 className="font-semibold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="pb-3">Mahsulot</th>
                  <th className="pb-3">Kategoriya</th>
                  <th className="pb-3">Qoldiq</th>
                  <th className="pb-3">Qiymat</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item) => (
                  <tr key={item.productId} className="border-b last:border-0">
                    <td className="py-3 font-medium text-slate-800">
                      {item.productName}
                    </td>
                    <td className="py-3 text-slate-500">
                      {item.categoryName || "-"}
                    </td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClass}`}
                      >
                        {item.currentStock} {item.unit}
                      </span>
                    </td>
                    <td className="py-3 text-slate-700">
                      {formatMoney(item.stockValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-500">{emptyText}</p>
        )}
      </div>
    </div>
  );
}

function RecentTransactions({ transactions }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <div className="flex items-center gap-2">
          <ArrowDownUp size={20} className="text-blue-600" />
          <div>
            <h2 className="font-semibold text-slate-900">
              Oxirgi ombor harakatlari
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              So‘nggi kirim va chiqim transactionlar
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="pb-3">Turi</th>
                  <th className="pb-3">Mahsulot</th>
                  <th className="pb-3">Miqdor</th>
                  <th className="pb-3">Narx</th>
                  <th className="pb-3">Project</th>
                  <th className="pb-3">User</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.type === "IN"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-orange-50 text-orange-700"
                        }`}
                      >
                        {item.type === "IN" ? "Kirim" : "Chiqim"}
                      </span>
                    </td>

                    <td className="py-3 font-medium text-slate-800">
                      {item.product?.name || "-"}
                    </td>

                    <td className="py-3 text-slate-600">
                      {item.quantity} {item.product?.unit}
                    </td>

                    <td className="py-3 text-slate-600">
                      {formatMoney(item.price)}
                    </td>

                    <td className="py-3 text-slate-600">
                      {item.project?.name || "-"}
                    </td>

                    <td className="py-3 text-slate-600">
                      {item.user?.name || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Hozircha ombor harakatlari mavjud emas.
          </p>
        )}
      </div>
    </div>
  );
}