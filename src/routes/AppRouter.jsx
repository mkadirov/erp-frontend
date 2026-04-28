import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Companies from "../pages/companies/Companies";
import CompanyDetail from "../pages/companies/CompanyDetail";
import WarehouseDashboard from "../pages/warehouse/WarehouseDashboard";
import Categories from "../pages/categories/Categories";
import Products from "../pages/products/Products";
import Transactions from "../pages/transactions/Transactions";
import Stock from "../pages/stock/Stock";
import Projects from "../pages/projects/Projects";
import Expenses from "../pages/expenses/Expenses";
import CompanyUsers from "../pages/companyUsers/CompanyUsers";
import AuditLogs from "../pages/auditLogs/AuditLogs";
import Settings from "../pages/settings/Settings";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/warehouse-dashboard" element={<WarehouseDashboard />} />
          <Route path="/categories" element={<Categories/>} />
          <Route path="/products" element={<Products/>} />
          <Route path="/transactions" element={<Transactions/>} />
          <Route path="/stock" element={<Stock/>} />
          <Route path="/projects" element={<Projects/>} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/company-users" element={<CompanyUsers />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}