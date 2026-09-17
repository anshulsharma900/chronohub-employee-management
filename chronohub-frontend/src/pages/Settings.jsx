import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axios";
import Layout from "../components/layout/Layout";

function Settings() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Define notification options based on user role
  const getNotificationOptions = () => {
    const commonOptions = [
      { key: "email", label: "Email Notifications", desc: "Receive notifications via email" },
    ];

    const employeeOptions = [
      { key: "leaveApproved", label: "Leave Approved", desc: "Get notified when your leave is approved" },
      { key: "leaveRejected", label: "Leave Rejected", desc: "Get notified when your leave is rejected" },
      { key: "leaveReminders", label: "Leave Reminders", desc: "Get reminders for upcoming leaves" },
      { key: "weeklyReports", label: "Weekly Reports", desc: "Receive weekly leave summary reports" },
    ];

    const managerOptions = [
      { key: "newLeaveRequest", label: "New Leave Requests", desc: "Get notified when employees submit leave requests" },
      { key: "leaveCancelled", label: "Leave Cancelled", desc: "Get notified when employees cancel leave requests" },
      { key: "weeklyTeamReports", label: "Weekly Team Reports", desc: "Receive weekly summary of team leave requests" },
      { key: "approvalReminders", label: "Approval Reminders", desc: "Get reminders for pending leave approvals" },
    ];

    const adminOptions = [
      { key: "newUserRegistration", label: "New User Registrations", desc: "Get notified when new users register" },
      { key: "systemAlerts", label: "System Alerts", desc: "Get important system notifications" },
      { key: "weeklySummary", label: "Weekly Summary", desc: "Receive weekly platform usage summary" },
      { key: "approvalReminders", label: "Approval Reminders", desc: "Get reminders for pending approvals" },
    ];

    switch (user?.role) {
      case "manager":
        return [...commonOptions, ...managerOptions];
      case "admin":
        return [...commonOptions, ...adminOptions];
      case "employee":
      default:
        return [...commonOptions, ...employeeOptions];
    }
  };

  const notificationOptions = getNotificationOptions();
  
  // Initialize state with default values
  const initialNotifications = {
    email: true,
    leaveApproved: false,
    leaveRejected: false,
    leaveReminders: false,
    weeklyReports: false,
    newLeaveRequest: false,
    leaveCancelled: false,
    weeklyTeamReports: false,
    approvalReminders: false,
    newUserRegistration: false,
    systemAlerts: false,
    weeklySummary: false,
  };
  
  const [notifications, setNotifications] = useState(initialNotifications);
  
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showEmail: false,
    showPhone: false,
  });

  const [loading, setLoading] = useState(false);

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success("Notification settings updated!");
  };

  const handlePrivacyChange = (key) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success("Privacy settings updated!");
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    
    if (!confirmDelete) return;
    
    const doubleConfirm = window.confirm(
      "This is your final warning. All your data will be permanently deleted. Continue?"
    );
    
    if (!doubleConfirm) return;
    
    try {
      setLoading(true);
      await API.delete(`/users/${user._id}`);
      toast.success("Account deleted successfully");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch {
      toast.error("Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

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

  // Get role-specific title
  const getRoleTitle = () => {
    switch (user?.role) {
      case "manager":
        return "Manager";
      case "admin":
        return "Admin";
      case "employee":
      default:
        return "Employee";
    }
  };

  return (
    <Layout>
      <div className="relative min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 relative z-10 max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
              Settings
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Manage your account settings and preferences
            </p>
          </motion.div>

          {/* Notification Settings - Role Based */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-slate-900 
              rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Notification Preferences
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Choose what notifications you want to receive based on your role
              </p>
            </div>

            <div className="p-6 space-y-4">
              {notificationOptions.map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white">{item.label}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange(item.key)}
                    className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                      notifications[item.key] 
                        ? "bg-blue-600" 
                        : "bg-slate-600"
                    }`}
                  >
                    <span 
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                        notifications[item.key] ? "left-8" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Privacy Settings */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-slate-900 
              rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Privacy Settings
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Control who can see your information
              </p>
            </div>

            <div className="p-6 space-y-4">
              {[
                { key: "showProfile", label: "Show Profile", desc: "Allow others to view your profile" },
                { key: "showEmail", label: "Show Email", desc: "Display your email address to others" },
                { key: "showPhone", label: "Show Phone", desc: "Display your phone number to others" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white">{item.label}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handlePrivacyChange(item.key)}
                    className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                      privacy[item.key] 
                        ? "bg-blue-600" 
                        : "bg-slate-600"
                    }`}
                  >
                    <span 
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                        privacy[item.key] ? "left-8" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Account Settings */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-slate-900 
              rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Account
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Manage your account settings
              </p>
            </div>

            <div className="p-6 space-y-4">
              <button
                onClick={() => navigate("/profile")}
                className="w-full flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <div className="text-left">
                    <p className="font-semibold text-slate-800 dark:text-white">Edit Profile</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Update your personal information</p>
                  </div>
                </div>
                <span className="text-slate-400">→</span>
              </button>

              <button
                onClick={() => navigate("/calendar")}
                className="w-full flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="text-left">
                    <p className="font-semibold text-slate-800 dark:text-white">View Calendar</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Check holidays and leave schedule</p>
                  </div>
                </div>
                <span className="text-slate-400">→</span>
              </button>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-4 bg-red-900/20 rounded-xl hover:bg-red-900/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <div className="text-left">
                      <p className="font-semibold text-red-400">Delete Account</p>
                      <p className="text-sm text-red-500">Permanently delete your account and data</p>
                    </div>
                  </div>
                  <span className="text-red-400">→</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* App Info */}
          <motion.div variants={itemVariants} className="text-center pb-8">
            <p className="text-slate-400 text-sm">
              ChronoHub v1.0.0
            </p>
          </motion.div>

        </motion.div>
      </div>
    </Layout>
  );
}

export default Settings;
