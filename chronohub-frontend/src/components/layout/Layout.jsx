import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-slate-100 dark:bg-slate-950 transition-colors duration-300">

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Always dark for aesthetics */}
      <div className={`
        fixed lg:relative z-50 lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        transition-transform duration-300 ease-in-out
      `}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex flex-col flex-grow h-screen overflow-hidden w-full">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-grow px-4 sm:px-6 lg:px-8 py-4 lg:py-6 overflow-y-auto bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
