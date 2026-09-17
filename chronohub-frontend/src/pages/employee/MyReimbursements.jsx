import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";
import toast from "react-hot-toast"

const CATEGORIES = [
    { value: "travel", label: "Travel" },
    { value: "meals", label: "Meals" },
    { value: "equipment", label: "Equipment" },
    { value: "software", label: "Software" },
    { value: "training", label: "Training" },
    { value: "other", label: "Other" },
];

function MyReimbursements() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stats, setStats] = useState(null);

    // Form state
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [receiptUrl, setReceiptUrl] = useState("");

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

    const filteredClaims = claims.filter(
        (claim) =>
            claim.category.toLowerCase().includes(search.toLowerCase()) ||
            claim.description.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!amount || !category || !description) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (parseFloat(amount) <= 0) {
            toast.error("Amount must be greater than 0");
            return;
        }

        try {
            await API.post("/reimbursements", {
                amount: parseFloat(amount),
                category,
                description,
                receiptUrl: receiptUrl || null,
            });

            toast.success("Reimbursement claim submitted successfully!");

            setAmount("");
            setCategory("");
            setDescription("");
            setReceiptUrl("");
            setIsModalOpen(false);
            fetchClaims();
            fetchStats();
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to submit reimbursement claim"
            );
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this claim?")) return;

        try {
            await API.delete(`/reimbursements/${id}/cancel`);
            toast.success("Claim cancelled successfully");
            fetchClaims();
            fetchStats();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to cancel claim");
        }
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

    const getCategoryLabel = (value) => {
        const cat = CATEGORIES.find((c) => c.value === value);
        return cat ? cat.label : value;
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
                                    My Reimbursements
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                    Submit and track your expense claims
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
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> Submit Claim
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Stats Cards */}
                    {stats && (
                        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-md border border-slate-200 dark:border-slate-800">
                                <p className="text-xs text-slate-500 dark:text-slate-400">Pending</p>
                                <p className="text-2xl font-bold text-yellow-400">{stats.pendingCount}</p>
                                <p className="text-xs text-slate-500">{formatCurrency(stats.pendingAmount)}</p>
                            </div>
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-md border border-slate-200 dark:border-slate-800">
                                <p className="text-xs text-slate-500 dark:text-slate-400">Approved</p>
                                <p className="text-2xl font-bold text-blue-400">{stats.approvedCount}</p>
                                <p className="text-xs text-slate-500">{formatCurrency(stats.approvedAmount)}</p>
                            </div>
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-md border border-slate-200 dark:border-slate-800">
                                <p className="text-xs text-slate-500 dark:text-slate-400">Rejected</p>
                                <p className="text-2xl font-bold text-red-400">{stats.rejectedCount}</p>
                            </div>
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-md border border-slate-200 dark:border-slate-800">
                                <p className="text-xs text-slate-500 dark:text-slate-400">Paid</p>
                                <p className="text-2xl font-bold text-green-400">{stats.paidCount}</p>
                                <p className="text-xs text-slate-500">{formatCurrency(stats.paidAmount)}</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Search */}
                    <motion.div variants={itemVariants}>
                        <div className="bg-white dark:bg-slate-900 
              rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 p-4 sm:p-5">
                            <div className="relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                <input
                                    type="text"
                                    placeholder="Search by category or description..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 
                    bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white text-sm sm:text-base
                    focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Claims List */}
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
                        ) : filteredClaims.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <p className="text-slate-400">
                                    No reimbursement claims found
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
                                            {filteredClaims.map((claim) => (
                                                <tr
                                                    key={claim._id}
                                                    className="hover:bg-slate-800/50 transition"
                                                >
                                                    <td className="p-4">
                                                        <span className="font-medium text-slate-800 dark:text-white">
                                                            {getCategoryLabel(claim.category)}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                                                        {claim.description}
                                                    </td>
                                                    <td className="p-4 font-semibold text-slate-800 dark:text-white">
                                                        {formatCurrency(claim.amount)}
                                                    </td>
                                                    <td className="p-4 text-slate-600 dark:text-slate-300">
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
                                                        {claim.status === "pending" && (
                                                            <button
                                                                onClick={() => handleCancel(claim._id)}
                                                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                        {claim.status === "rejected" && claim.rejectionReason && (
                                                            <span className="text-xs text-slate-500" title={claim.rejectionReason}>
                                                                View Reason
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="lg:hidden divide-y divide-slate-200 dark:divide-slate-800">
                                    {filteredClaims.map((claim) => (
                                        <div key={claim._id} className="p-4 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold text-slate-800 dark:text-white">
                                                        {getCategoryLabel(claim.category)}
                                                    </p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                                        {claim.description}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(
                                                        claim.status
                                                    )}`}
                                                >
                                                    {claim.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="font-bold text-lg text-slate-800 dark:text-white">
                                                    {formatCurrency(claim.amount)}
                                                </span>
                                                <span className="text-slate-500">{formatDate(claim.createdAt)}</span>
                                            </div>
                                            {claim.status === "pending" && (
                                                <button
                                                    onClick={() => handleCancel(claim._id)}
                                                    className="w-full py-2 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium hover:bg-red-500/10 transition"
                                                >
                                                    Cancel Claim
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </motion.div>
                </motion.div>

                {/* Submit Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto border border-slate-800"
                            >
                                <h3 className="text-xl font-bold mb-4 text-white">
                                    Submit Reimbursement Claim
                                </h3>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">
                                            Amount *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            required
                                            placeholder="0.00"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 
                        bg-slate-800 text-white
                        focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">
                                            Category *
                                        </label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 
                        bg-slate-800 text-white
                        focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
                                        >
                                            <option value="">Select Category</option>
                                            {CATEGORIES.map((cat) => (
                                                <option key={cat.value} value={cat.value}>
                                                    {cat.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">
                                            Description *
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                            rows={3}
                                            placeholder="Describe the expense..."
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 
                        bg-slate-800 text-white
                        focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">
                                            Receipt URL (optional)
                                        </label>
                                        <input
                                            type="url"
                                            value={receiptUrl}
                                            onChange={(e) => setReceiptUrl(e.target.value)}
                                            placeholder="https://..."
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 
                        bg-slate-800 text-white
                        focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 px-4 py-3 border-2 border-slate-700 
                        text-slate-300 rounded-xl font-semibold
                        hover:bg-slate-800 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700
                        text-white rounded-xl font-semibold shadow-lg
                        hover:shadow-xl transition"
                                        >
                                            Submit Claim
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
}

export default MyReimbursements;
