import { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import API from "../api/axios";

export default function Landing() {
  return (
    <div className="bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen transition-colors duration-300">

      {/* NAVBAR */}
      <nav className="fixed w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl z-50 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="ChronoHub" className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl" />
            <h1 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
              Chrono<span className="text-blue-500">HUB</span>
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition text-sm">Features</a>
            <a href="#solutions" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition text-sm">Solutions</a>
            <a href="#cta" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition text-sm">Pricing</a>
            <a href="#contact" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition text-sm">Contact</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />

            <Link
              to="/login"
              className="px-3 sm:px-5 py-1.5 sm:py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition text-sm sm:text-base"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm sm:text-base"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100/30 via-slate-100 to-slate-100 dark:from-blue-950/30 dark:via-slate-950 dark:to-slate-950" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-blue-400 font-medium text-sm mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                HR LEAVE PORTFOLIO SUPPORT
              </p>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-slate-900 dark:text-white">Streamline Your</span>
                <br />
                <span className="text-slate-900 dark:text-white">Workforce </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Leave</span>
              </h2>

              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed mb-8">
                A modern, automated platform to manage employee time-off, 
                track balances in real-time, and gain actionable workforce 
                insights. Built for teams that value clarity.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                    transition-all font-semibold text-center flex items-center justify-center gap-2"
                >
                  Get Started <span>→</span>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-gray-950 flex items-center justify-center text-xs font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  A small step towards <span className="text-slate-900 dark:text-white font-semibold">Future</span>
                </p>
              </div>
            </motion.div>

            {/* Right Content - Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xl shadow-blue-500/10">
                {/* Browser dots */}
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                
                {/* Mock Dashboard */}
                <div className="bg-slate-100 dark:bg-slate-950 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-8 w-24 bg-blue-600 rounded-lg" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "12", label: "Pending", color: "from-yellow-500 to-orange-500" },
                      { value: "45", label: "Approved", color: "from-green-500 to-emerald-500" },
                      { value: "3", label: "Rejected", color: "from-red-500 to-pink-500" },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800"
                      >
                        <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                          {stat.value}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Mock chart area */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 h-32 flex items-end gap-2">
                    {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 0.8 + i * 0.05 }}
                        className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating decoration */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 bg-slate-100 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-blue-400 font-medium text-sm mb-4">FEATURES</p>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Powerful Features for Modern Teams
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to manage time-off requests without the manual overhead 
              of spreadsheets and emails.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                title: "Automated Approvals",
                desc: "Custom workflow to route requests to the right managers instantly based on department and hierarchy.",
              },
              {
                icon: "📊",
                title: "Real-time Tracking",
                desc: "Employees and HR see live updates of accrued and used leave days without manual reconciliation.",
              },
              {
                icon: "📈",
                title: "Insightful Analytics",
                desc: "Visualize trends and staffing levels with built-in reporting tools designed for executive decision making.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-8
                  hover:border-blue-500/50 hover:bg-white dark:hover:bg-slate-900 transition-all duration-300"
              >
                <div className="w-12 h-12 mb-6 rounded-xl bg-blue-500/10 border border-blue-500/20 
                  flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>

                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h4>

                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section id="solutions" className="py-20 sm:py-28 px-4 sm:px-6 bg-slate-200/30 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Experience the Modern Interface
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                The Employee Dashboard View is designed for maximum productivity and clarity. 
                See your schedule, balance, and status at a single glance.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "One-click request system",
                  "Interactive team calendar",
                  "Automated policy enforcement",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <span className="text-blue-400 text-sm">✓</span>
                    </div>
                    <span className="text-slate-600 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 border border-blue-500 text-blue-400 
                  rounded-lg hover:bg-blue-500/10 transition-all font-semibold"
              >
                View Interactive Demo <span>→</span>
              </Link>
            </motion.div>

            {/* Right Content - Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
                <div className="space-y-4">
                  {/* Mock header */}
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-3 w-24 bg-slate-200/50 dark:bg-slate-800/50 rounded" />
                    </div>
                    <div className="h-10 w-28 bg-blue-600 rounded-lg" />
                  </div>
                  
                  {/* Stat cards */}
                  <div className="grid grid-cols-3 gap-4">
                    {["Pending", "Approved", "Available"].map((label, i) => (
                      <div key={i} className="bg-slate-100 dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                        <div className="h-8 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent text-2xl font-bold">
                          {[3, 12, 8][i]}
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{label}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Mock table */}
                  <div className="bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="bg-white dark:bg-slate-900 px-4 py-2 border-b border-slate-200 dark:border-slate-800">
                      <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                    </div>
                    {[1, 2, 3].map((row) => (
                      <div key={row} className="px-4 py-3 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center">
                        <div className="flex gap-3 items-center">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
                          <div className="space-y-1">
                            <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                            <div className="h-2 w-16 bg-slate-200/50 dark:bg-slate-800/50 rounded" />
                          </div>
                        </div>
                        <div className="h-6 w-16 bg-green-500/20 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section id="cta" className="py-20 sm:py-28 px-4 sm:px-6 bg-slate-100 dark:bg-slate-950">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Ready to modernize your leave management?
          </h3>

          <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of companies scaling their workforce operations with ChronoHub.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                transition-all font-semibold shadow-lg shadow-blue-600/25"
            >
              Get Started for Free
            </Link>

            <a
              href="#contact"
              className="px-8 py-4 border border-slate-300 dark:border-gray-700 text-slate-600 dark:text-slate-300 rounded-lg 
                hover:border-slate-400 dark:hover:border-gray-600 transition-all font-semibold"
            >
              Contact Us
            </a>
          </div>

          <p className="text-slate-400 dark:text-slate-500 text-sm mt-6">
            No credit card required • Free for now
          </p>
        </motion.div>
      </section>

      {/* CONTACT SECTION */}
      <ContactSection />

      {/* FOOTER - Minimal */}
      <footer className="py-6 px-4 border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto flex justify-center items-center gap-6">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer"
            className="w-9 h-9 bg-slate-200 dark:bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors group">
            <svg className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
            className="w-9 h-9 bg-slate-200 dark:bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors group">
            <svg className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
            className="w-9 h-9 bg-slate-200 dark:bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors group">
            <svg className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}

// Contact Section Component
function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/contact", formData);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-20 sm:py-28 px-4 sm:px-6 bg-slate-200/30 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-blue-400 font-medium text-sm mb-4">CONTACT US</p>
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Get in Touch
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Have questions about ChronoHub? Want to learn more about how we can help 
              streamline your leave management? We'd love to hear from you.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-slate-900 dark:text-white font-semibold mb-1">Email Us</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">support@chronohub.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-slate-900 dark:text-white font-semibold mb-1">Location</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Remote-first, Worldwide</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-slate-900 dark:text-white font-semibold mb-1">Response Time</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Within 24 hours</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-gray-700 rounded-xl 
                        text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 
                        focus:ring-2 focus:ring-blue-500/20 transition"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-gray-700 rounded-xl 
                        text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 
                        focus:ring-2 focus:ring-blue-500/20 transition"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-gray-700 rounded-xl 
                      text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 
                      focus:ring-2 focus:ring-blue-500/20 transition"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-gray-700 rounded-xl 
                      text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 
                      focus:ring-2 focus:ring-blue-500/20 transition resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold
                    hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
