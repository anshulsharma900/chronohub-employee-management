import { Link } from "react-router-dom";

function GlobalFooter() {
  return (
    <footer
      className="
      mt-16
      bg-gradient-to-br 
      from-indigo-50 via-white to-purple-50
      dark:from-gray-950 dark:via-gray-900 dark:to-gray-950
      border-t border-gray-200/60 dark:border-gray-800/60
      transition-colors duration-500
    "
    >
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Top Section */}
        <div className="grid md:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src="/logo.png" alt="ChronoHub" className="w-10 h-10 rounded-xl shadow-lg" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Chrono<span className="text-blue-500">HUB</span>
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Your modern leave management platform for seamless team coordination
              and smarter workforce planning.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-5">
              Quick Links
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Roles */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-5">
              For Teams
            </h4>

            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="hover:text-purple-600 transition-colors cursor-pointer">
                Employees
              </li>
              <li className="hover:text-purple-600 transition-colors cursor-pointer">
                Managers
              </li>
              <li className="hover:text-purple-600 transition-colors cursor-pointer">
                Admins
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-5">
              Contact
            </h4>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              support@chronohub.com
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              +91 80000 00000
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200/60 dark:border-gray-800/60 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            © {new Date().getFullYear()} ChronoHub. All rights reserved.
          </p>

          <p className="mt-3 md:mt-0">
            Built with ❤️ for better leave management
          </p>
        </div>

      </div>
    </footer>
  );
}

export default GlobalFooter;