import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import API from "../../api/axios";
import Layout from "../../components/layout/Layout";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function ManagerDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const fetchLeaves = async () => {
    try {
      const { data } = await API.get("/leaves");
      setLeaves(data);
    } catch {
      toast.error("Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchTerm]);

  const updateStatus = async (id, status, employeeName) => {
    try {
      await API.put(`/leaves/${id}`, { status });
      toast.success(`Leave request ${status} for ${employeeName}`);
      fetchLeaves();
    } catch {
      toast.error(`Failed to ${status} leave request`);
    }
  };

  // Filter leaves based on status and search
  const filteredLeaves = leaves.filter((leave) => {
    const matchesStatus = filterStatus === "all" || leave.status === filterStatus;
    const matchesSearch = 
      leave.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.employee?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.leaveType?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLeaves.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeaves = filteredLeaves.slice(startIndex, startIndex + itemsPerPage);

  const pending = leaves.filter(l => l.status === "pending").length;
  const approved = leaves.filter(l => l.status === "approved").length;
  const rejected = leaves.filter(l => l.status === "rejected").length;

  // Chart data for Leave Status Distribution
  const statusChartData = {
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [
      {
        label: "Leave Requests",
        data: [pending, approved, rejected],
        backgroundColor: [
          "rgba(234, 179, 8, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgba(234, 179, 8, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Chart data for Leave Requests by Type
  const leaveTypes = {};
  leaves.forEach(leave => {
    leaveTypes[leave.leaveType] = (leaveTypes[leave.leaveType] || 0) + 1;
  });

  const typeChartData = {
    labels: Object.keys(leaveTypes),
    datasets: [
      {
        label: "Number of Requests",
        data: Object.values(leaveTypes),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
      },
    ],
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

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
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

  const FilterButton = ({ status, label, count, color }) => (
    <button
      onClick={() => setFilterStatus(status)}
      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
        filterStatus === status
          ? color
          : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700"
      }`}
    >
      {label} ({count})
    </button>
  );

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
              Review and manage leave requests from your team
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="group bg-white dark:bg-slate-900 
                rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800
                hover:shadow-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Pending Requests</p>
                  <h3 className="text-4xl font-bold mt-2 text-yellow-400">
                    {pending}
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-xl bg-yellow-500/20 
                  flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="group bg-white dark:bg-slate-900 
                rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800
                hover:shadow-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Approved Leaves</p>
                  <h3 className="text-4xl font-bold mt-2 text-green-400">
                    {approved}
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-xl bg-green-500/20 
                  flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="group bg-white dark:bg-slate-900 
                rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800
                hover:shadow-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Rejected Requests</p>
                  <h3 className="text-4xl font-bold mt-2 text-red-400">
                    {rejected}
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-xl bg-red-500/20 
                  flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                Leave Status Distribution
              </h3>
              <div className="h-64">
                <Doughnut data={statusChartData} options={chartOptions} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 
              rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                Leave Requests by Type
              </h3>
              <div className="h-64">
                <Bar data={typeChartData} options={chartOptions} />
              </div>
            </div>
          </motion.div>

          {/* Leave Requests Table with Filters & Pagination */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-slate-900 
              rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-300 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  Leave Requests
                </h3>
                
                {/* Search Box */}
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search employee or leave type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-xl border-2 border-slate-300 dark:border-slate-700 
                      bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white text-sm
                      focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
                  />
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2 mt-4">
                <FilterButton 
                  status="all" 
                  label="All" 
                  count={leaves.length} 
                  color="bg-blue-600 text-white"
                />
                <FilterButton 
                  status="pending" 
                  label="Pending" 
                  count={pending} 
                  color="bg-yellow-500/20 text-yellow-400"
                />
                <FilterButton 
                  status="approved" 
                  label="Approved" 
                  count={approved} 
                  color="bg-green-500/20 text-green-400"
                />
                <FilterButton 
                  status="rejected" 
                  label="Rejected" 
                  count={rejected} 
                  color="bg-red-500/20 text-red-400"
                />
              </div>
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
            ) : filteredLeaves.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-slate-400">
                  No leave requests found
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="bg-slate-800/50">
                        <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Leave Type
                        </th>
                        <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Reason
                        </th>
                        <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedLeaves.map((leave, index) => (
                        <motion.tr
                          key={leave._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="p-4">
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-white">
                                {leave.employee?.name || "Unknown"}
                              </p>
                              <p className="text-xs text-slate-500">
                                {leave.employee?.email || ""}
                              </p>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
                              {leave.leaveType}
                            </span>
                          </td>

                          <td className="p-4 text-slate-600 dark:text-slate-300">
                            <div className="text-sm">
                              <p>{formatDate(leave.fromDate)}</p>
                              <p className="text-slate-500">to</p>
                              <p>{formatDate(leave.toDate)}</p>
                            </div>
                          </td>

                          <td className="p-4 text-slate-600 dark:text-slate-300 text-sm max-w-xs truncate">
                            {leave.reason}
                          </td>

                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                leave.status === "approved"
                                  ? "bg-green-500/20 text-green-400"
                                  : leave.status === "rejected"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                              }`}
                            >
                              {leave.status}
                            </span>
                          </td>

                          <td className="p-4">
                            {leave.status === "pending" && (
                              <div className="flex gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => updateStatus(leave._id, "approved", leave.employee?.name || "Employee")}
                                  className="px-4 py-2 text-xs rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
                                >
                                  Approve
                                </motion.button>

                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => updateStatus(leave._id, "rejected", leave.employee?.name || "Employee")}
                                  className="px-4 py-2 text-xs rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all"
                                >
                                  Reject
                                </motion.button>
                              </div>
                            )}
                            {leave.status !== "pending" && (
                              <span className="text-slate-500 text-xs">No action needed</span>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredLeaves.length)} of {filteredLeaves.length} entries
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 
                          hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 
                          hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}

export default ManagerDashboard;
