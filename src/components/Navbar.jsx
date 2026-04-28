import { Bell, User, Menu, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";



export default function Navbar({ setOpen }) {
  const user = getUser();
  const location = useLocation();
  const navigate = useNavigate();


  const path = location.pathname;

  const titles = {
    "/companies": "Companies",
    "/dashboard": "Dashboard",
    "/warehouse-dashboard": "Warehouse Dashboard",
    "/company-users": "Company Users",
    "/products": "Products",
    "/categories": "Categories",
    "/transactions": "Transactions",
    "/stock": "Stock",
    "/projects": "Projects",
    "/expenses": "Expenses",
    "/expense-categories": "Expense Categories",
    "/audit-logs": "Audit Logs",
    "/settings": "Settings",
  };

  const title = titles[path] || "ERP System";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-slate-100"
          onClick={() => setOpen(true)}
        >
          <Menu size={24} className="text-slate-700" />
        </button>

        <h2 className="font-semibold text-slate-900">{title}</h2>
      </div>

      

      <div className="flex items-center gap-3 md:gap-5">
        <div className="relative">
          <Bell size={22} className="text-slate-600" />
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            3
          </span>
        </div>

        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
          <User size={20} className="text-slate-600" />
        </div>

        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-slate-900">
            {user?.name || "Super Admin"}
          </p>
          <p className="text-xs text-slate-500">{user?.role}</p>
        </div>

        <div className="flex items-center gap-4">
  <button
    onClick={handleLogout}
    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-red-600 cursor-pointer"
    title="Logout"
  >
    <LogOut size={20} />
  </button>
</div>
      </div>
    </header>
  );
}