import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import API from "../api/axios";
import Layout from "../components/layout/Layout";

// Indian Holidays with specific dates
const INDIAN_HOLIDAYS = [
  // 2024
  { date: "2024-01-01", name: "New Year", day: "Monday" },
  { date: "2024-01-15", name: "Pongal", day: "Monday" },
  { date: "2024-01-26", name: "Republic Day", day: "Friday" },
  { date: "2024-03-08", name: "Mahashivratri", day: "Friday" },
  { date: "2024-03-25", name: "Holi", day: "Monday" },
  { date: "2024-03-29", name: "Good Friday", day: "Friday" },
  { date: "2024-04-09", name: "Ram Navami", day: "Tuesday" },
  { date: "2024-04-11", name: "Eid-ul-Fitr", day: "Thursday" },
  { date: "2024-05-01", name: "Maharashtra Day", day: "Wednesday" },
  { date: "2024-08-15", name: "Independence Day", day: "Thursday" },
  { date: "2024-10-02", name: "Gandhi Jayanti", day: "Wednesday" },
  { date: "2024-10-12", name: "Dussehra", day: "Saturday" },
  { date: "2024-11-01", name: "Diwali", day: "Friday" },
  { date: "2024-11-15", name: "Guru Nanak Jayanti", day: "Friday" },
  { date: "2024-12-25", name: "Christmas", day: "Wednesday" },
  
  // 2025
  { date: "2025-01-01", name: "New Year", day: "Wednesday" },
  { date: "2025-01-13", name: "Lohri", day: "Monday" },
  { date: "2025-01-14", name: "Pongal", day: "Tuesday" },
  { date: "2025-01-15", name: "Makar Sankranti", day: "Wednesday" },
  { date: "2025-01-26", name: "Republic Day", day: "Sunday" },
  { date: "2025-02-12", name: "Mahashivratri", day: "Wednesday" },
  { date: "2025-03-14", name: "Holi", day: "Friday" },
  { date: "2025-03-17", name: "Eid-ul-Fitr", day: "Monday" },
  { date: "2025-04-06", name: "Ram Navami", day: "Sunday" },
  { date: "2025-04-18", name: "Good Friday", day: "Friday" },
  { date: "2025-05-01", name: "Maharashtra Day", day: "Thursday" },
  { date: "2025-08-15", name: "Independence Day", day: "Friday" },
  { date: "2025-10-02", name: "Gandhi Jayanti", day: "Thursday" },
  { date: "2025-10-12", name: "Dussehra", day: "Sunday" },
  { date: "2025-10-29", name: "Diwali", day: "Wednesday" },
  { date: "2025-11-05", name: "Guru Nanak Jayanti", day: "Wednesday" },
  { date: "2025-12-25", name: "Christmas", day: "Thursday" },

  // 2026
  { date: "2026-01-01", name: "New Year", day: "Thursday" },
  { date: "2026-01-13", name: "Lohri", day: "Tuesday" },
  { date: "2026-01-14", name: "Pongal", day: "Wednesday" },
  { date: "2026-01-15", name: "Makar Sankranti", day: "Thursday" },
  { date: "2026-01-26", name: "Republic Day", day: "Monday" },
  { date: "2026-02-01", name: "Mahashivratri", day: "Sunday" },
  { date: "2026-03-04", name: "Holi", day: "Wednesday" },
  { date: "2026-03-06", name: "Eid-ul-Fitr", day: "Friday" },
  { date: "2026-03-27", name: "Good Friday", day: "Friday" },
  { date: "2026-04-06", name: "Ram Navami", day: "Monday" },
  { date: "2026-05-01", name: "Maharashtra Day", day: "Friday" },
  { date: "2026-08-15", name: "Independence Day", day: "Saturday" },
  { date: "2026-10-02", name: "Gandhi Jayanti", day: "Friday" },
  { date: "2026-10-20", name: "Dussehra", day: "Tuesday" },
  { date: "2026-10-18", name: "Diwali", day: "Sunday" },
  { date: "2026-11-04", name: "Guru Nanak Jayanti", day: "Wednesday" },
  { date: "2026-12-25", name: "Christmas", day: "Friday" },

  // 2027
  { date: "2027-01-01", name: "New Year", day: "Friday" },
  { date: "2027-01-13", name: "Lohri", day: "Wednesday" },
  { date: "2027-01-14", name: "Pongal", day: "Thursday" },
  { date: "2027-01-15", name: "Makar Sankranti", day: "Friday" },
  { date: "2027-01-26", name: "Republic Day", day: "Monday" },
  { date: "2027-02-21", name: "Mahashivratri", day: "Sunday" },
  { date: "2027-03-24", name: "Holi", day: "Wednesday" },
  { date: "2027-03-26", name: "Eid-ul-Fitr", day: "Friday" },
  { date: "2027-03-26", name: "Good Friday", day: "Friday" },
  { date: "2027-04-27", name: "Ram Navami", day: "Tuesday" },
  { date: "2027-05-01", name: "Maharashtra Day", day: "Saturday" },
  { date: "2027-08-15", name: "Independence Day", day: "Sunday" },
  { date: "2027-10-02", name: "Gandhi Jayanti", day: "Saturday" },
  { date: "2027-10-10", name: "Dussehra", day: "Sunday" },
  { date: "2027-11-08", name: "Diwali", day: "Monday" },
  { date: "2027-11-24", name: "Guru Nanak Jayanti", day: "Wednesday" },
  { date: "2027-12-25", name: "Christmas", day: "Saturday" },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [leaves, setLeaves] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState("year");
  const [showYearPicker, setShowYearPicker] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  useEffect(() => {
    setCurrentDate(new Date(selectedYear, currentDate.getMonth(), 1));
  }, [selectedYear]);

  const fetchLeaves = async () => {
    try {
      const { data } = await API.get("/leaves");
      setLeaves(data.filter(l => l.status === "approved"));
    } catch {
      toast.error("Failed to fetch leave data");
    }
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const isHoliday = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return INDIAN_HOLIDAYS.find(h => h.date === dateStr);
  };

  const isLeave = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return leaves.find(leave => {
      const fromDate = new Date(leave.fromDate).toISOString().split("T")[0];
      const toDate = new Date(leave.toDate).toISOString().split("T")[0];
      return dateStr >= fromDate && dateStr <= toDate;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const navigateYear = (direction) => {
    setSelectedYear(prev => prev + direction);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      setSelectedYear(newDate.getFullYear());
      return newDate;
    });
  };

  const selectYear = (year) => {
    setSelectedYear(year);
    setCurrentDate(new Date(year, 0, 1));
    setShowYearPicker(false);
  };

  const generateMonthDays = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const generateYearOptions = () => {
    const years = [];
    for (let year = 2024; year <= 2030; year++) {
      years.push(year);
    }
    return years;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03 },
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 relative z-10"
        >

          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                Calendar
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                View Indian holidays, weekends, and your leave schedule
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden">
                <button
                  onClick={() => setViewMode("year")}
                  className={`px-4 py-2 text-sm font-medium transition ${
                    viewMode === "year"
                      ? "bg-blue-600 text-white"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  Year
                </button>
                <button
                  onClick={() => setViewMode("month")}
                  className={`px-4 py-2 text-sm font-medium transition ${
                    viewMode === "month"
                      ? "bg-blue-600 text-white"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  Month
                </button>
              </div>

              {/* Year Navigation */}
              <div className="flex items-center gap-1 relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigateYear(-1)}
                  className="w-9 h-9 bg-white dark:bg-slate-900 rounded-lg shadow-md border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  ◀
                </motion.button>
                
                <button
                  onClick={() => setShowYearPicker(!showYearPicker)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-900 rounded-lg shadow-md border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-800 dark:text-white min-w-[60px] text-center hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {selectedYear}
                </button>

                {/* Year Picker Dropdown */}
                {showYearPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-1 z-50 max-h-48 overflow-y-auto"
                  >
                    {generateYearOptions().map((year) => (
                      <button
                        key={year}
                        onClick={() => selectYear(year)}
                        className={`w-full px-4 py-2 text-left rounded-lg text-sm ${
                          year === selectedYear
                            ? "bg-blue-600 text-white"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </motion.div>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigateYear(1)}
                  className="w-9 h-9 bg-white dark:bg-slate-900 rounded-lg shadow-md border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  ▶
                </motion.button>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-md border border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-600"></div>
                <span className="text-sm text-slate-500 dark:text-slate-400">Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-pink-600"></div>
                <span className="text-sm text-slate-500 dark:text-slate-400">Holiday</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-indigo-600"></div>
                <span className="text-sm text-slate-500 dark:text-slate-400">Weekend</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-600"></div>
                <span className="text-sm text-slate-500 dark:text-slate-400">Your Leave</span>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          {viewMode === "year" ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {MONTHS.map((monthName, monthIndex) => (
                <motion.div
                  key={monthIndex}
                  variants={itemVariants}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Month Header */}
                  <div className="bg-blue-600 px-4 py-2">
                    <h3 className="text-white font-semibold text-center text-sm">{monthName}</h3>
                  </div>

                  {/* Days Header */}
                  <div className="grid grid-cols-7 gap-0.5 p-2 bg-slate-100 dark:bg-slate-800/30">
                    {DAYS.map((day) => (
                      <div key={day} className="text-center text-[10px] font-medium text-slate-500 dark:text-slate-400 py-1">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-0.5 p-2 pt-0">
                    {generateMonthDays(selectedYear, monthIndex).map((day, dayIndex) => {
                      if (!day) {
                        return <div key={`empty-${dayIndex}`} className="aspect-square"></div>;
                      }

                      const holiday = isHoliday(day);
                      const weekend = isWeekend(day);
                      const leave = isLeave(day);
                      const today = isToday(day);

                      return (
                        <motion.div
                          key={dayIndex}
                          whileHover={{ scale: 1.2, zIndex: 10 }}
                          className={`
                            aspect-square flex flex-col items-center justify-center text-[10px] rounded-lg relative cursor-pointer
                            ${today ? "bg-blue-600 text-white font-bold shadow-lg" : ""}
                            ${holiday ? "bg-pink-600 text-white font-semibold" : ""}
                            ${weekend && !holiday ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : ""}
                            ${leave && !holiday && !weekend ? "bg-emerald-600 text-white font-semibold" : ""}
                            ${!today && !holiday && !weekend && !leave ? "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300" : ""}
                          `}
                        >
                          <span>{day.getDate()}</span>
                          {holiday && (
                            <span className="text-[7px] truncate w-full text-center font-medium px-0.5">
                              {holiday.name}
                            </span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // Month View
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              {/* Month Navigation */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigateMonth(-1)}
                  className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  ◀
                </motion.button>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigateMonth(1)}
                  className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  ▶
                </motion.button>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 gap-2 p-4 pb-0 bg-slate-100 dark:bg-slate-800/30">
                {DAYS.map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-2 p-4 pt-2">
                {generateMonthDays(currentDate.getFullYear(), currentDate.getMonth()).map((day, dayIndex) => {
                  if (!day) {
                    return <div key={`empty-${dayIndex}`} className="aspect-square"></div>;
                  }

                  const holiday = isHoliday(day);
                  const weekend = isWeekend(day);
                  const leave = isLeave(day);
                  const today = isToday(day);

                  return (
                    <motion.div
                      key={dayIndex}
                      whileHover={{ scale: 1.05 }}
                      className={`
                        aspect-square flex flex-col items-center justify-center rounded-xl p-1 relative
                        ${today ? "bg-blue-600 text-white shadow-lg" : ""}
                        ${holiday ? "bg-pink-600 text-white shadow-md" : ""}
                        ${weekend && !holiday ? "bg-indigo-100 dark:bg-indigo-900/30" : ""}
                        ${leave && !holiday && !weekend ? "bg-emerald-600 text-white shadow-md" : ""}
                        ${!today && !holiday && !weekend && !leave ? "hover:bg-slate-100 dark:hover:bg-slate-800" : ""}
                      `}
                    >
                      <span className={`text-sm font-semibold ${holiday || today || leave ? "text-white" : "text-slate-800 dark:text-white"}`}>
                        {day.getDate()}
                      </span>
                      {holiday && (
                        <span className="text-[8px] text-white truncate w-full text-center font-medium">
                          {holiday.name}
                        </span>
                      )}
                      {leave && !holiday && (
                        <span className="text-[8px] text-white truncate w-full text-center">
                          Leave
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Holidays List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
              Indian Holidays {selectedYear}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {INDIAN_HOLIDAYS.filter(h => h.date.startsWith(selectedYear.toString())).map((holiday, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                    {holiday.date.split("-")[2]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white text-sm">{holiday.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{MONTHS[parseInt(holiday.date.split("-")[1]) - 1]} • {holiday.day}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </Layout>
  );
}

export default Calendar;
