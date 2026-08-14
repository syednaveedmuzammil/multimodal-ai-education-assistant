import React, { useState } from "react";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import Footer from "@/components/common/Footer";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-white">

      {/* ================= Sidebar ================= */}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ================= Mobile Overlay ================= */}

      {sidebarOpen && (
        <div
          className="
            fixed
            inset-0
            bg-black/50
            z-30
            lg:hidden
          "
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= Main Application ================= */}

      <div className="lg:ml-72 min-h-screen flex flex-col">

        {/* ================= Navbar ================= */}

        <Navbar
          onMenuClick={() =>
            setSidebarOpen((previous) => !previous)
          }
        />

        {/* ================= Page Content ================= */}

        <main
          className="
            flex-1
            min-w-0
            bg-background
            overflow-x-hidden
          "
        >
          {children}
        </main>

        {/* ================= Footer ================= */}

        <Footer />

      </div>

    </div>
  );
}