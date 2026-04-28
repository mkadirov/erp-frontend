import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollText, ChevronLeft, ChevronRight } from "lucide-react";
import { getAuditLogs } from "../../api/auditLog.api";

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("uz-UZ");
}

function formatMetadata(metadata) {
  if (!metadata) return "-";

  try {
    return JSON.stringify(metadata, null, 2);
  } catch {
    return "-";
  }
}

export default function AuditLogs() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["audit-logs", page],
    queryFn: () => getAuditLogs(page, limit),
  });

  const logs = Array.isArray(data?.data) ? data.data : [];
  const pagination = data?.pagination || {
    total: 0,
    page: 1,
    limit,
    totalPages: 1,
  };

  if (isLoading) {
    return <div className="p-6">Yuklanmoqda...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Audit loglarni yuklashda xatolik yuz berdi.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
          <ScrollText size={26} />
          Audit Logs
        </h1>
        <p className="text-sm text-slate-500">
          Tizimdagi muhim amallar tarixi
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                ID
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Action
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Entity
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Entity ID
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                User ID
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Company ID
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                Sana
              </th>
            </tr>
          </thead>

          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-5 py-8 text-center text-slate-500"
                >
                  Hozircha audit log yo‘q
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-t border-slate-100 align-top hover:bg-slate-50"
                >
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {log.id}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {log.action}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-medium text-slate-900">
                    {log.entity}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {log.entityId || "-"}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {log.userId || "-"}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {log.companyId || "-"}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {formatDate(log.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {logs.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-3">
            <h2 className="font-semibold text-slate-900">Metadata</h2>
          </div>

          <div className="space-y-4 p-5">
            {logs.map((log) => (
              <div
                key={`metadata-${log.id}`}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">
                    #{log.id} — {log.action}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDate(log.createdAt)}
                  </p>
                </div>

                <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-slate-700">
                  {formatMetadata(log.metadata)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">
          Jami: {pagination.total} ta log | Sahifa: {pagination.page} /{" "}
          {pagination.totalPages}
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
            Oldingi
          </button>

          <button
            type="button"
            disabled={page >= pagination.totalPages}
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, pagination.totalPages))
            }
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Keyingi
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}