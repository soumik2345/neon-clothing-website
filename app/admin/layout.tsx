"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    // Verify admin authentication
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated || data.user?.role !== "admin") {
          router.replace("/admin/login");
        } else {
          setCheckingAuth(false);
        }
      })
      .catch(() => {
        router.replace("/admin/login");
      });

    // Close mobile drawer on route change
    setMobileSidebarOpen(false);
  }, [pathname, isLoginPage, router]);

  useEffect(() => {
    const handleToggle = () => setMobileSidebarOpen((prev) => !prev);
    window.addEventListener("toggle-admin-mobile-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-admin-mobile-sidebar", handleToggle);
  }, []);

  // If on admin login page, render clean full screen
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading skeleton while verifying admin session
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-neutral-700 border-t-white rounded-full animate-spin" />
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">
          VERIFYING ADMIN PRIVILEGES...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Desktop Sticky Sidebar */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen z-40">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 shadow-2xl h-full">
            <AdminSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}
