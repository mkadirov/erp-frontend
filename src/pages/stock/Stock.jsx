import { useQuery } from "@tanstack/react-query";
import { PackageSearch, AlertTriangle } from "lucide-react";
import { getStock } from "../../api/transaction.api";

export default function Stock() {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["stock"],
    queryFn: getStock,
  });

  const stock = Array.isArray(data) ? data : [];
  console.log(stock);
  

  if (isLoading) {
    return <div className="p-6">Yuklanmoqda...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Stock ma’lumotlarini yuklashda xatolik yuz berdi.
      </div>
    );
  }

  const totalItems = stock.length;
  const lowStockCount = stock.filter((item) => Number(item.stock) <= 5).length;
  const outOfStockCount = stock.filter((item) => Number(item.stock) <= 0).length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Stock</h1>
        <p className="text-sm text-slate-500">
          Ombordagi mahsulotlarning joriy qoldig‘i
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Jami mahsulot</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {totalItems}
              </h3>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <PackageSearch size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Kam qolgan</p>
              <h3 className="mt-2 text-2xl font-bold text-amber-600">
                {lowStockCount}
              </h3>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Tugagan</p>
              <h3 className="mt-2 text-2xl font-bold text-red-600">
                {outOfStockCount}
              </h3>
            </div>

            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Product ID
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Mahsulot
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Birlik
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Qoldiq
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Holat
              </th>
            </tr>
          </thead>

          <tbody>
            {stock.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-5 py-8 text-center text-slate-500"
                >
                  Hozircha stock ma’lumoti yo‘q
                </td>
              </tr>
            ) : (
              stock.map((item) => {
                const currentStock = Number(item.stock);

                let status = "Yetarli";
                let statusClass = "bg-emerald-50 text-emerald-700";

                if (currentStock <= 0) {
                  status = "Tugagan";
                  statusClass = "bg-red-50 text-red-700";
                } else if (currentStock <= 5) {
                  status = "Kam qolgan";
                  statusClass = "bg-amber-50 text-amber-700";
                }

                return (
                  <tr
                    key={item.productId}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {item.productId}
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-900">
                      {item.name}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {item.unit}
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {currentStock} {item.unit}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}