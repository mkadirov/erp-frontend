import { useState } from "react";
import { Building2, User, Shield, Palette, Save } from "lucide-react";
import { getUser } from "../../utils/auth";

export default function Settings() {
  const user = getUser();

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
    companyId: user?.companyId || "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    alert("Profile update endpoint hali backendda ulanmagan.");
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Sozlamalar</h1>
        <p className="text-sm text-slate-500">
          Profil, company va tizim sozlamalari
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <User size={22} />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">
                Profil sozlamalari
              </h2>
              <p className="text-sm text-slate-500">
                Foydalanuvchi ma’lumotlari
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Ism
              </label>
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                value={profile.email}
                disabled
                className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-slate-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Role
              </label>
              <input
                value={profile.role}
                disabled
                className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-slate-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Company ID
              </label>
              <input
                value={profile.companyId || "-"}
                disabled
                className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            <Save size={18} />
            Saqlash
          </button>
        </form>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <Building2 size={22} />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Company</h2>
                <p className="text-sm text-slate-500">Company ma’lumotlari</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Company ID</span>
                <span className="font-medium text-slate-900">
                  {profile.companyId || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                <Shield size={22} />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Security</h2>
                <p className="text-sm text-slate-500">Xavfsizlik sozlamalari</p>
              </div>
            </div>

            <button
              type="button"
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              onClick={() =>
                alert("Change password endpoint hali backendda yo‘q.")
              }
            >
              Password o‘zgartirish
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Palette size={22} />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Preferences</h2>
                <p className="text-sm text-slate-500">Tizim ko‘rinishi</p>
              </div>
            </div>

            <div className="space-y-3">
              <select
                disabled
                className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-slate-500"
              >
                <option>O‘zbek tili</option>
              </select>

              <select
                disabled
                className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-slate-500"
              >
                <option>UZS — so‘m</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}