import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCompany,
  createCompanyAdmin,
  getCompanies,
  toggleCompanyStatus,
} from "../../api/company.api";

export default function Companies() {
  const queryClient = useQueryClient();

  const [companyName, setCompanyName] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const {
  data: companies = [],
  isLoading,
  isError,
  error,
} = useQuery({
  queryKey: ["companies"],
  queryFn: getCompanies,
});

//   const companies = Array.isArray(data) ? data : data?.data || [];

  const createCompanyMutation = useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      setCompanyName("");
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }) =>
      toggleCompanyStatus(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  const createAdminMutation = useMutation({
    mutationFn: ({ companyId, payload }) =>
      createCompanyAdmin(companyId, payload),
    onSuccess: () => {
      setSelectedCompany(null);
      setAdminForm({
        name: "",
        email: "",
        password: "",
      });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  function handleCreateCompany(e) {
    e.preventDefault();

    console.log("SUBMIT CLICKED", companyName);

    if (!companyName.trim()) return;

    createCompanyMutation.mutate({
      name: companyName,
    });
  }

  function handleCreateAdmin(e) {
    e.preventDefault();

    if (!selectedCompany) return;

    createAdminMutation.mutate({
      companyId: selectedCompany.id,
      payload: adminForm,
    });
  }

  if (isLoading) {
    return <div className="text-gray-500">Loading companies...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-xl bg-red-50 p-4 text-red-600">
        {error?.response?.data?.message || "Failed to load companies"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
          <p className="text-sm text-gray-500">
            Manage tenant companies and company admins.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleCreateCompany}
        className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm md:flex-row"
      >
        <input
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Company name"
          className="flex-1 rounded-xl border border-gray-200 px-4 py-2 outline-none focus:border-gray-400"
        />

        <button
          type="submit"
          disabled={createCompanyMutation.isPending}
          className="rounded-xl bg-gray-900 px-5 py-2 text-white disabled:opacity-60"
        >
          {createCompanyMutation.isPending ? "Creating..." : "Create Company"}
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {companies.map((company) => (
                <tr key={company.id}>
                  <td className="px-4 py-3 text-gray-500">{company.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {company.name}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        company.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {company.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {company.createdAt
                      ? new Date(company.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedCompany(company)}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
                      >
                        Add Admin
                      </button>

                      <button
                        onClick={() =>
                          toggleStatusMutation.mutate({
                            id: company.id,
                            isActive: !company.isActive,
                          })
                        }
                        className={`rounded-lg px-3 py-1.5 text-white ${
                          company.isActive ? "bg-red-600" : "bg-green-600"
                        }`}
                      >
                        {company.isActive ? "Disable" : "Enable"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {companies.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No companies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900">
              Add Admin
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Company: {selectedCompany.name}
            </p>

            <form onSubmit={handleCreateAdmin} className="mt-5 space-y-3">
              <input
                value={adminForm.name}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, name: e.target.value })
                }
                placeholder="Admin name"
                className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:border-gray-400"
              />

              <input
                value={adminForm.email}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, email: e.target.value })
                }
                placeholder="Admin email"
                type="email"
                className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:border-gray-400"
              />

              <input
                value={adminForm.password}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, password: e.target.value })
                }
                placeholder="Password"
                type="password"
                className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:border-gray-400"
              />

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedCompany(null)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-gray-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={createAdminMutation.isPending}
                  className="rounded-xl bg-gray-900 px-4 py-2 text-white disabled:opacity-60"
                >
                  {createAdminMutation.isPending ? "Creating..." : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}