import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler } from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import API from "../../api/axios";
import Layout from "../../components/layout/Layout";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/users");
      setUsers(data);
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  const fetchLeaves = async () => {
    try {
      const { data } = await API.get("/leaves");
      setLeaves(data);
    } catch {
      toast.error("Failed to fetch leave data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchLeaves();
  }, []);

  const updateRole = async (id, role, userName) => {
    try {
      await API.put(`/users/${id}`, { role });
      toast.success(`${userName}'s role updated to ${role}`);
      fetchUsers();
    } catch {
      toast.error("Failed to update user role");
    }
  };

  const deleteUser = async (id, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) return;
    
    try {
      await API.delete(`/users/${id}`);
      toast.success(`${userName} deleted successfully`);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const totalUsers = users.length;
  const employees = users.filter(u => u.role === "employee").length;
  const managers = users.filter(u => u.role === "manager").length;
  const admins = users.filter(u => u.role === "admin").length;

  // Chart data for User Roles Distribution
  const roleChartData = {
    labels: ["Employees", "Managers", "Admins"],
    datasets: [
      {
        label: "Users",
        data: [employees, managers, admins],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(234, 179, 8, 0.8)",
          "rgba(168, 85, 247, 0.8)",
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(234, 179, 8, 1)",
          "rgba(168, 85, 247, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Chart data for Leave Status - Line Chart
  const leaveStatus = {
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [
      {
        label: "Leave Requests",
        data: [
          leaves.filter(l => l.status === "pending").length,
          leaves.filter(l => l.status === "approved").length,
          leaves.filter(l => l.status === "rejected").length,
        ],
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 3,
        pointBackgroundColor: [
          "rgba(234, 179, 8, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 10,
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
        },
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Layout>
      <div className="relative min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 relative z-10"
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Manage users, roles, and view system statistics
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="group bg-white dark:bg-slate-900 
                rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Users</p>
                  <h3 className="text-4xl font-bold mt-2 text-blue-400">
                    {totalUsers}
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-xl bg-blue-500/20 
                  flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="group bg-white dark:bg-slate-900 
                rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800
                hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Employees</p>
                  <h3 className="text-4xl font-bold mt-2 text-green-400">
                    {employees}
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-xl bg-green-500/20 
                  flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="group bg-white dark:bg-slate-900 
                rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800
                hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Managers</p>
                  <h3 className="text-4xl font-bold mt-2 text-yellow-400">
                    {managers}
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-xl bg-yellow-500/20 
                  flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="group bg-white dark:bg-slate-900 
                rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800
                hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Admins</p>
                  <h3 className="text-4xl font-bold mt-2 text-blue-400">
                    {admins}
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-xl bg-blue-500/20 
                  flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Charts */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 
              rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                User Roles Distribution
              </h3>
              <div className="h-64">
                <Doughnut data={roleChartData} options={chartOptions} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 
              rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                Leave Request Status
              </h3>
              <div className="h-64">
                <Line data={leaveStatus} options={lineChartOptions} />
              </div>
            </div>
          </motion.div>

          {/* Users Table */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-slate-900 
              rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-300 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                User Management
              </h3>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"
                />
                <p className="text-slate-400">Loading...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-slate-400">
                  No users found
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800/50">
                      <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                        Email
                      </th>
                      <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 
                              flex items-center justify-center text-white font-bold">
                              {user.name?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-white">{user.name}</p>
                              <p className="text-xs text-slate-500 sm:hidden">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-300 hidden sm:table-cell">
                          {user.email}
                        </td>

                        <td className="p-4">
                          <select
                            value={user.role}
                            onChange={(e) => updateRole(user._id, e.target.value, user.name)}
                            className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm rounded-xl border-2 
                              border-slate-300 dark:border-slate-700 
                              bg-slate-100 dark:bg-slate-800 
                              text-slate-800 dark:text-white
                              focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 
                              transition-all font-medium"
                          >
                            <option value="employee">Employee</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>

                        <td className="p-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => deleteUser(user._id, user.name)}
                            className="px-4 py-2 text-xs sm:text-sm rounded-xl 
                              bg-red-600 
                              text-white font-semibold hover:bg-red-700 transition-all"
                          >
                            Delete
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;
