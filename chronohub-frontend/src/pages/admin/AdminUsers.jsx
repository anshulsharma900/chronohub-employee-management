import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import API from "../../api/axios";
import Layout from "../../components/layout/Layout";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/users");
      // Filter to show only one admin (current logged in admin)
      // Other admins won't be shown to prevent multiple admin accounts
      const adminUser = JSON.parse(localStorage.getItem("user"));
      const filteredData = data.filter(user => 
        user.role !== "admin" || user._id === adminUser?._id || user._id === adminUser?.id
      );
      setUsers(filteredData);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id, role, userName) => {
    try {
      await API.put(`/users/${id}`, { role });
      toast.success(`${userName}'s role updated to ${role}`);
      fetchUsers();
    } catch (error) {
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

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

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
          className="space-y-6 relative z-10"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                User Management
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Manage all registered users and their roles
              </p>
            </div>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 pl-10 rounded-xl border-2 border-slate-300 dark:border-slate-700 
                    bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-blue-600"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 rounded-xl border-2 border-slate-300 dark:border-slate-700 
                  bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-blue-600"
              >
                <option value="all">All Roles</option>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Users</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{users.length}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Employees</p>
              <p className="text-2xl font-bold text-green-400">{users.filter(u => u.role === "employee").length}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Managers</p>
              <p className="text-2xl font-bold text-yellow-400">{users.filter(u => u.role === "manager").length}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Admins</p>
              <p className="text-2xl font-bold text-blue-400">{users.filter(u => u.role === "admin").length}</p>
            </div>
          </motion.div>

          {/* Users Table */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-slate-900 
              rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            {loading ? (
              <div className="text-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"
                />
                <p className="text-slate-400">Loading...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-slate-400">
                  {search || roleFilter !== "all" ? "No users found matching your search" : "No users found"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="bg-slate-800/50">
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">
                        Email
                      </th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.map((user, index) => (
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
                              <p className="text-xs text-slate-500 md:hidden">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-300 hidden md:table-cell">
                          {user.email}
                        </td>

                        <td className="p-4">
                          <select
                            value={user.role}
                            onChange={(e) => updateRole(user._id, e.target.value, user.name)}
                            className="px-3 py-2 text-sm rounded-xl border-2 
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

                        <td className="p-4 text-slate-600 dark:text-slate-300">
                          {user.department || "-"}
                        </td>

                        <td className="p-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => deleteUser(user._id, user.name)}
                            className="px-4 py-2 text-sm rounded-xl 
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

export default AdminUsers;
