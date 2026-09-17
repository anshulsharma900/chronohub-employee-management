import Layout from "../components/layout/Layout";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import API from "../api/axios";

function Profile() {
  const { user, login } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    department: user?.department || "",
    designation: user?.designation || "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [submittingLeave, setSubmittingLeave] = useState(false);

  useEffect(() => {
    // Sync form data when user changes
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      department: user?.department || "",
      designation: user?.designation || "",
    });
    if (user?.profilePicture) {
      setProfileImagePreview(user.profilePicture);
    }
  }, [user]);

  const getInitial = (name) =>
    name ? name.charAt(0).toUpperCase() : "U";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      data.append("department", formData.department);
      data.append("designation", formData.designation);
      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      const { data: updatedUser } = await API.put(`/users/profile/update`, data);

      login(updatedUser, localStorage.getItem("token"));
      toast.success("Profile updated successfully!");
      setProfileImage(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();

    if (new Date(fromDate) > new Date(toDate)) {
      toast.error("End date must be after start date");
      return;
    }

    setSubmittingLeave(true);

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
      setIsLeaveModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit leave request");
    } finally {
      setSubmittingLeave(false);
    }
  };

  return (
    <Layout>
      <div className="relative min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto relative z-10"
        >

          {/* Page Header */}
          <div className="mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
                My Profile
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2">
                Manage your account settings and information
              </p>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white dark:bg-slate-900 
          rounded-3xl 
          border border-slate-200 dark:border-slate-800 
          shadow-xl overflow-hidden">

            {/* Avatar Section - Full Width */}
            <div className="relative h-32 bg-blue-600">
              <div className="absolute -bottom-16 left-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full 
                    bg-slate-300 dark:bg-slate-700 
                    flex items-center justify-center 
                    text-slate-800 dark:text-white text-4xl font-bold shadow-2xl overflow-hidden border-4 border-white dark:border-slate-900">
                    {profileImagePreview ? (
                      <img 
                        src={profileImagePreview} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitial(user?.name)
                    )}
                  </div>
                  
                  <label className="absolute bottom-0 right-0 
                    w-10 h-10 bg-blue-600 
                    rounded-full flex items-center justify-center 
                    text-white cursor-pointer 
                    hover:scale-110 transition-transform shadow-lg border-2 border-white dark:border-slate-900">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="pt-20 p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Personal Information Section */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 
                          bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl 
                          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-900 transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 
                          bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl 
                          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-900 transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 
                          bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl 
                          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-900 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter address"
                        className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 
                          bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl 
                          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-900 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Work Information Section */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Work Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
                        Department
                      </label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        placeholder="Enter department"
                        className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 
                          bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl 
                          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-900 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
                        Designation
                      </label>
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        placeholder="Enter designation"
                        className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 
                          bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl 
                          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-900 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        value={user?.role || "Employee"}
                        disabled
                        className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 
                          bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl cursor-not-allowed capitalize"
                      />
                      <p className="text-xs text-slate-500 mt-1">Contact admin to change role</p>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-blue-600 
                      text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 
                      transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </motion.button>
                </div>
              </form>
            </div>

          </div>
        </motion.div>
      </div>

      {/* APPLY LEAVE MODAL */}
      <AnimatePresence>
        {isLeaveModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsLeaveModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-slate-900 w-full max-w-lg p-8 rounded-2xl shadow-2xl border border-slate-800"
            >
              <button
                onClick={() => setIsLeaveModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-6 text-white">
                Apply for Leave
              </h2>

              <form onSubmit={handleLeaveSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Leave Type
                  </label>
                  <select
                    className="w-full px-4 py-3 border-2 border-slate-700 
                      bg-slate-800 text-white rounded-xl 
                      focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-900 transition"
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      From Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border-2 border-slate-700 
                        bg-slate-800 text-white rounded-xl 
                        focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-900 transition"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      To Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border-2 border-slate-700 
                        bg-slate-800 text-white rounded-xl 
                        focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-900 transition"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Reason
                  </label>
                  <textarea
                    placeholder="Enter reason for leave..."
                    className="w-full px-4 py-3 border-2 border-slate-700 
                      bg-slate-800 text-white rounded-xl 
                      focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-900 transition resize-none"
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
                  disabled={submittingLeave}
                  className="w-full py-3.5 bg-blue-600 
                    text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 
                    transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submittingLeave ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Leave Request"
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

export default Profile;
