import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

function MyLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  
  const [searchParams] = useSearchParams();
  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  const fetchLeaves = async () => {
    try {
      const { data } = await API.get("/leaves");
      setLeaves(data);
    } catch {
      toast.error("Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
    
    const applyParam = searchParams.get("apply");
    if (applyParam === "true") {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const filteredLeaves = leaves.filter((leave) =>
    leave.leaveType.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(fromDate) > new Date(toDate)) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      await API.post("/leaves", {
        leaveType,
        fromDate,
        toDate,
        reason,
      });

      toast.success("Leave request submitted successfully!");
      
      setLeaveType("");
      setFromDate("");
      setToDate("");
      setReason("");
      setIsModalOpen(false);
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit leave request");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this leave request?")) return;
    
    try {
      await API.put(`/leaves/${id}/cancel`, { status: "cancelled" });
      toast.success("Leave request cancelled successfully");
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel leave request");
    }
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
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Layout>
      <div className="relative min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300">

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 sm:space-y-8 relative z-10"
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
                  My Leaves
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Track and manage your time off requests
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700
                  text-white rounded-xl shadow-lg hover:shadow-2xl 
                  transition-all font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> Apply for Leave
              </motion.button>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div variants={itemVariants}>
            <div className="bg-white dark:bg-slate-900 
              rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 p-4 sm:p-5">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  type="text"
                  placeholder="Search by leave type..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 
                    bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white text-sm sm:text-base
                    focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
                />
              </div>
            </div>
          </motion.div>

          {/* Leave Cards - Mobile / Table - Desktop */}
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
            ) : filteredLeaves.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                <p className="text-slate-400">
                  No leave records found
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="bg-slate-800/50">
                        <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Leave Type
                        </th>
                        <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Start Date
                        </th>
                        <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          End Date
                        </th>
                        <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Duration
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
                      {filteredLeaves.map((leave, index) => {
                        const duration =
                          (new Date(leave.toDate) - new Date(leave.fromDate)) /
                          (1000 * 60 * 60 * 24) + 1;

                        return (
                          <motion.tr
                            key={leave._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <td className="p-4">
                              <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-semibold">
                                {leave.leaveType}
                              </span>
                            </td>
                            <td className="p-4 text-slate-600 dark:text-slate-300">
                              {formatDate(leave.fromDate)}
                            </td>
                            <td className="p-4 text-slate-600 dark:text-slate-300">
                              {formatDate(leave.toDate)}
                            </td>
                            <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                              {duration} {duration === 1 ? "day" : "days"}
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                              <div className="flex items-center gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setSelectedLeave(leave)}
                                  className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                </motion.button>

                                {leave.status === "pending" && (
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleCancel(leave._id)}
                                    className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400"
                                    title="Cancel Leave"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                  </motion.button>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-3 p-3">
                  {filteredLeaves.map((leave, index) => {
                    const duration =
                      (new Date(leave.toDate) - new Date(leave.fromDate)) /
                      (1000 * 60 * 60 * 24) + 1;

                    return (
                      <motion.div
                        key={leave._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-semibold">
                            {leave.leaveType}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              leave.status === "approved"
                                ? "bg-green-500/20 text-green-400"
                                : leave.status === "rejected"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {leave.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div>
                            <p className="text-slate-500 text-xs">From</p>
                            <p className="text-slate-800 dark:text-white font-medium">{formatDate(leave.fromDate)}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">To</p>
                            <p className="text-slate-800 dark:text-white font-medium">{formatDate(leave.toDate)}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            <span className="font-semibold">{duration}</span> {duration === 1 ? "day" : "days"}
                          </p>
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setSelectedLeave(leave)}
                              className="px-3 py-1.5 bg-blue-600/20 rounded-lg text-blue-400 text-sm"
                            >
                              View
                            </motion.button>

                            {leave.status === "pending" && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleCancel(leave._id)}
                                className="px-3 py-1.5 bg-red-500/20 rounded-lg text-red-400 text-sm"
                              >
                                Cancel
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}

            <div className="hidden lg:block px-6 py-4 border-t border-slate-300 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
              Showing {filteredLeaves.length} records
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* APPLY LEAVE MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-slate-900 w-full max-w-lg p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-800"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">
                Apply for Leave
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5 sm:mb-2">
                    Leave Type
                  </label>
                  <select
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-slate-700 
                      bg-slate-800 text-white rounded-xl 
                      focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition text-sm sm:text-base"
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    required
                  >
                    <option value="">Select leave type</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Annual Leave">Annual Leave</option>
                    <option value="Personal Leave">Personal Leave</option>
                    <option value="Emergency Leave">Emergency Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5 sm:mb-2">
                      From Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-slate-700 
                        bg-slate-800 text-white rounded-xl 
                        focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition text-sm sm:text-base"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5 sm:mb-2">
                      To Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-slate-700 
                        bg-slate-800 text-white rounded-xl 
                        focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition text-sm sm:text-base"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5 sm:mb-2">
                    Reason
                  </label>
                  <textarea
                    placeholder="Enter reason for leave..."
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-slate-700 
                      bg-slate-800 text-white rounded-xl 
                      focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition resize-none text-sm sm:text-base"
                    rows="3"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-2.5 sm:py-3.5 bg-blue-600 hover:bg-blue-700
                    text-white rounded-xl font-semibold shadow-lg hover:shadow-xl 
                    transition-all text-sm sm:text-base"
                >
                  Submit Leave Request
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW LEAVE DETAILS MODAL */}
      <AnimatePresence>
        {selectedLeave && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setSelectedLeave(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-slate-900 w-full max-w-md p-6 rounded-2xl shadow-2xl border border-slate-800"
            >
              <button
                onClick={() => setSelectedLeave(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <h2 className="text-xl font-bold mb-4 sm:mb-6 text-white">
                Leave Details
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 bg-slate-800/50 rounded-xl">
                  <p className="text-sm text-slate-500">Leave Type</p>
                  <p className="font-semibold text-white">{selectedLeave.leaveType}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-slate-800/50 rounded-xl">
                    <p className="text-sm text-slate-500">From Date</p>
                    <p className="font-semibold text-white">{formatDate(selectedLeave.fromDate)}</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-slate-800/50 rounded-xl">
                    <p className="text-sm text-slate-500">To Date</p>
                    <p className="font-semibold text-white">{formatDate(selectedLeave.toDate)}</p>
                  </div>
                </div>

                <div className="p-3 sm:p-4 bg-slate-800/50 rounded-xl">
                  <p className="text-sm text-slate-500">Reason</p>
                  <p className="font-semibold text-white">{selectedLeave.reason}</p>
                </div>

                <div className="p-3 sm:p-4 bg-slate-800/50 rounded-xl">
                  <p className="text-sm text-slate-500">Status</p>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedLeave.status === "approved"
                        ? "bg-green-500/20 text-green-400"
                        : selectedLeave.status === "rejected"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {selectedLeave.status}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

export default MyLeaves;
