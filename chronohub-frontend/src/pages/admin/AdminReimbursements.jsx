import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import API from "../../api/axios";
import Layout from "../../components/layout/Layout";

const CATEGORIES = [
    { value: "travel", label: "Travel" },
    { value: "meals", label: "Meals" },
    { value: "equipment", label: "Equipment" },
    { value: "software", label: "Software" },
    { value: "training", label: "Training" },
    { value: "other", label: "Other" },
];

function AdminReimbursements() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchClaims = async () => {
        try {
            const { data } = await API.get("/reimbursements");
            setClaims(data);
        } catch (error) {
            toast.error(error+"Failed to fetch reimbursement claims");
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const { data } = await API.get("/reimbursements/stats");
            setStats(data);
        } catch (err) {
            console.error(err+"Failed to fetch stats");
        }
    };

    useEffect(() => {
        fetchClaims();
        fetchStats();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus, searchTerm]);

    const reviewClaim = async (id, status, employeeName, rejectionReason = "") => {
        try {
            await API.put(`/reimbursements/${id}/review`, { status, rejectionReason });
            toast.success(`Claim ${status} for ${employeeName}`);
            fetchClaims();
            fetchStats();
        } catch {
            toast.error(`Failed to ${status} claim`);
        }
    };

    const markAsPaid = async (id, employeeName) => {
        try {
            await API.put(`/reimbursements/${id}/pay`);
            toast.success(`Claim marked as paid for ${employeeName}`);
            fetchClaims();
            fetchStats();
        } catch {
            toast.error("Failed to mark claim as paid");
        }
    };

    const deleteClaim = async (id, employeeName) => {
        if (!window.confirm(`Are you sure you want to delete the claim by ${employeeName}?`)) return;

        try {
            await API.delete(`/reimbursements/${id}`);
            toast.success("Claim deleted successfully");
            fetchClaims();
            fetchStats();
        } catch {
            toast.error("Failed to delete claim");
        }
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    const getCategoryLabel = (value) => {
        const cat = CATEGORIES.find((c) => c.value === value);
        return cat ? cat.label : value;
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: "bg-yellow-500/20 text-yellow-400",
            approved: "bg-blue-500/20 text-blue-400",
            rejected: "bg-red-500/20 text-red-400",
            paid: "bg-green-500/20 text-green-400",
        };
        return styles[status] || styles.pending;
    };

    // Filter claims
    const filteredClaims = claims.filter((claim) => {
        const matchesStatus = filterStatus === "all" || claim.status === filterStatus;
        const matchesSearch =
            claim.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            claim.employee?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            claim.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            claim.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Pagination
    const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedClaims = filteredClaims.slice(startIndex, startIndex + itemsPerPage);

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
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filterStatus === status
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
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                            Reimbursement Management
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Review and manage expense reimbursement claims
                        </p>
                    </motion.div>

                    {/* Stats Cards */}
                    {stats && (
                        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-md border border-slate-200 dark:border-slate-800"
                            >
                                <p className="text-xs text-slate-500 dark:text-slate-400">Total Claims</p>
                                <p className="text-2xl font-bold text-blue-400">{stats.totalClaims}</p>
                                <p className="text-xs text-slate-500">{formatCurrency(stats.totalAmount)}</p>
                            </motion.div>
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-md border border-slate-200 dark:border-slate-800"
                            >
                                <p className="text-xs text-slate-500 dark:text-slate-400">Pending</p>
                                <p className="text-2xl font-bold text-yellow-400">{stats.pendingCount}</p>
                                <p className="text-xs text-slate-500">{formatCurrency(stats.pendingAmount)}</p>
                            </motion.div>
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-md border border-slate-200 dark:border-slate-800"
                            >
                                <p className="text-xs text-slate-500 dark:text-slate-400">Approved</p>
                                <p className="text-2xl font-bold text-blue-400">{stats.approvedCount}</p>
                                <p className="text-xs text-slate-500">{formatCurrency(stats.approvedAmount)}</p>
                            </motion.div>
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-md border border-slate-200 dark:border-slate-800"
                            >
                                <p className="text-xs text-slate-500 dark:text-slate-400">Rejected</p>
                                <p className="text-2xl font-bold text-red-400">{stats.rejectedCount}</p>
                            </motion.div>
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-md border border-slate-200 dark:border-slate-800"
                            >
                                <p className="text-xs text-slate-500 dark:text-slate-400">Paid</p>
                                <p className="text-2xl font-bold text-green-400">{stats.paidCount}</p>
                                <p className="text-xs text-slate-500">{formatCurrency(stats.paidAmount)}</p>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Filters */}
                    <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
                        <FilterButton
                            status="all"
                            label="All"
                            count={claims.length}
                            color="bg-blue-600 text-white"
                        />
                        <FilterButton
                            status="pending"
                            label="Pending"
                            count={claims.filter((c) => c.status === "pending").length}
                            color="bg-yellow-500 text-white"
                        />
                        <FilterButton
                            status="approved"
                            label="Approved"
                            count={claims.filter((c) => c.status === "approved").length}
                            color="bg-blue-500 text-white"
                        />
                        <FilterButton
                            status="rejected"
                            label="Rejected"
                            count={claims.filter((c) => c.status === "rejected").length}
                            color="bg-red-500 text-white"
                        />
                        <FilterButton
                            status="paid"
                            label="Paid"
                            count={claims.filter((c) => c.status === "paid").length}
                            color="bg-green-500 text-white"
                        />
                    </motion.div>

                    {/* Search */}
                    <motion.div variants={itemVariants}>
                        <div className="bg-white dark:bg-slate-900 
              rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 p-4">
                            <div className="relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search by employee name, email, category..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 
                    bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white
                    focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Claims Table */}
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
                        ) : paginatedClaims.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-slate-400">No claims found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-800/50">
                                            <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                Employee
                                            </th>
                                            <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                Description
                                            </th>
                                            <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {paginatedClaims.map((claim) => (
                                            <tr
                                                key={claim._id}
                                                className="hover:bg-slate-800/50 transition"
                                            >
                                                <td className="p-4">
                                                    <div>
                                                        <p className="font-medium text-white">
                                                            {claim.employee?.name || "Unknown"}
                                                        </p>
                                                        <p className="text-xs text-slate-500">{claim.employee?.email}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-slate-300">
                                                    {getCategoryLabel(claim.category)}
                                                </td>
                                                <td className="p-4 text-slate-300 max-w-xs truncate">
                                                    {claim.description}
                                                </td>
                                                <td className="p-4 font-semibold text-white">
                                                    {formatCurrency(claim.amount)}
                                                </td>
                                                <td className="p-4 text-slate-300">
                                                    {formatDate(claim.createdAt)}
                                                </td>
                                                <td className="p-4">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(
                                                            claim.status
                                                        )}`}
                                                    >
                                                        {claim.status}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-2 flex-wrap">
                                                        {claim.status === "pending" && (
                                                            <>
                                                                <button
                                                                    onClick={() =>
                                                                        reviewClaim(claim._id, "approved", claim.employee?.name)
                                                                    }
                                                                    className="px-3 py-1 bg-green-500/20 text-green-400 
                                    rounded-lg text-xs font-semibold hover:bg-green-500/30 transition"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        const reason = prompt("Rejection reason (optional):");
                                                                        reviewClaim(claim._id, "rejected", claim.employee?.name, reason || "");
                                                                    }}
                                                                    className="px-3 py-1 bg-red-500/20 text-red-400 
                                    rounded-lg text-xs font-semibold hover:bg-red-500/30 transition"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}
                                                        {claim.status === "approved" && (
                                                            <button
                                                                onClick={() => markAsPaid(claim._id, claim.employee?.name)}
                                                                className="px-3 py-1 bg-blue-500/20 text-blue-400 
                                  rounded-lg text-xs font-semibold hover:bg-blue-500/30 transition"
                                                            >
                                                                Mark Paid
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => deleteClaim(claim._id, claim.employee?.name)}
                                                            className="px-3 py-1 bg-slate-700 text-slate-400 
                                rounded-lg text-xs font-semibold hover:bg-slate-600 transition"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="p-4 border-t border-slate-800 flex justify-between items-center">
                                <p className="text-sm text-slate-400">
                                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredClaims.length)} of{" "}
                                    {filteredClaims.length} claims
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 
                      disabled:opacity-50 hover:bg-slate-700 transition"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-3 py-1 text-slate-400">
                                        {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 
                      disabled:opacity-50 hover:bg-slate-700 transition"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </Layout>
    );
}

export default AdminReimbursements;
