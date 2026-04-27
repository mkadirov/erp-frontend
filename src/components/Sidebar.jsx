import {
  Building2,
  Users,
  Boxes,
  Package,
  ArrowLeftRight,
  Warehouse,
  FolderKanban,
  ReceiptText,
  Tags,
  ScrollText,
  BarChart3,
  Settings,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { getUser } from "../utils/auth";

const menuByRole = {
  SUPER_ADMIN: [
    { label: "Companies", path: "/companies", icon: Building2 },
    { label: "Audit Logs", path: "/audit-logs", icon: ScrollText },
  ],
  ADMIN: [
    { label: "Dashboard", path: "/dashboard", icon: BarChart3 },
    { label: "Warehouse Dashboard", path: "/warehouse-dashboard", icon: Warehouse },
    { label: "Company Users", path: "/company-users", icon: Users },
    { label: "Categories", path: "/categories", icon: Boxes },
    { label: "Products", path: "/products", icon: Package },
    { label: "Transactions", path: "/transactions", icon: ArrowLeftRight },
    { label: "Stock", path: "/stock", icon: Warehouse },
    { label: "Projects", path: "/projects", icon: FolderKanban },
    { label: "Expenses", path: "/expenses", icon: ReceiptText },
    { label: "Expense Categories", path: "/expense-categories", icon: Tags },
    { label: "Audit Logs", path: "/audit-logs", icon: ScrollText },
  ],
  MANAGER: [
    { label: "Dashboard", path: "/dashboard", icon: BarChart3 },
    { label: "Projects", path: "/projects", icon: FolderKanban },
    { label: "Products", path: "/products", icon: Package },
    { label: "Categories", path: "/categories", icon: Boxes },
    { label: "Stock", path: "/stock", icon: Warehouse },
  ],
  ACCOUNTANT: [
    { label: "Dashboard", path: "/dashboard", icon: BarChart3 },
    { label: "Expenses", path: "/expenses", icon: ReceiptText },
    { label: "Expense Categories", path: "/expense-categories", icon: Tags },
  ],
  WAREHOUSE: [
    { label: "Warehouse Dashboard", path: "/warehouse-dashboard", icon: Warehouse },
    { label: "Categories", path: "/categories", icon: Boxes },
    { label: "Products", path: "/products", icon: Package },
    { label: "Transactions", path: "/transactions", icon: ArrowLeftRight },
    { label: "Stock", path: "/stock", icon: Warehouse },
  ],
};

export default function Sidebar({ open, setOpen }) {
  const user = getUser();
  const menu = menuByRole[user?.role] || [];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-[260px] bg-[#061d38] text-white flex flex-col
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="h-20 flex items-center justify-between gap-3 px-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Building2 size={24} />
            </div>

            <div>
              <h1 className="text-xl font-bold leading-5">ERP System</h1>
              <p className="text-xs text-slate-300 mt-1">{user?.role}</p>
            </div>
          </div>

          <button className="lg:hidden text-slate-300" onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={20} />
                {item.label}
              </NavLink>
            );
          })}

          <NavLink
            to="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <Settings size={20} />
            Settings
          </NavLink>
        </nav>

        <div className="p-5 border-t border-white/10">
          <p className="font-semibold">{user?.name || "Super Admin"}</p>
          <p className="text-sm text-slate-300 truncate">
            {user?.email || "superadmin@erp.com"}
          </p>
        </div>
      </aside>
    </>
  );
}