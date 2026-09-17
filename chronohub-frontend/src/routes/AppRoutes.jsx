import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminLeaves from "../pages/admin/AdminLeaves";
import AdminReimbursements from "../pages/admin/AdminReimbursements";
import ProtectedRoute from "../components/ProtectedRoute";
import Landing from "../pages/Landing";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Profile from "../pages/Profile";
import MyLeaves from "../pages/employee/MyLeaves";
import MyReimbursements from "../pages/employee/MyReimbursements";
import Calendar from "../pages/Calendar";
import Settings from "../pages/Settings";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["employee", "manager", "admin"]}>
            <Profile />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/calendar"
        element={
          <ProtectedRoute allowedRoles={["employee", "manager", "admin"]}>
            <Calendar />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={["employee", "manager", "admin"]}>
            <Settings />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/employee/leaves"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <MyLeaves />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      {/* Manager Routes */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/leaves"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/leaves"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLeaves />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reimbursements"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminReimbursements />
          </ProtectedRoute>
        }
      />

      {/* Employee Reimbursements */}
      <Route
        path="/employee/reimbursements"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <MyReimbursements />
          </ProtectedRoute>
        }
      />

      {/* Manager Reimbursements - managers can also review claims */}
      <Route
        path="/manager/reimbursements"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <AdminReimbursements />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
