"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiGrid,
  FiFileText,
  FiUsers,
  FiCamera,
  FiMenu,
  FiDollarSign,
  FiLink,
  FiLogOut,
  FiBriefcase,
  FiKey,
  FiBook,
} from "react-icons/fi";
import Image from "next/image";

const navItems = [
  { href: "/admin", icon: FiGrid, label: "Dashboard" },
  { href: "/admin/bento", icon: FiGrid, label: "Bento Grid" },
  { href: "/admin/event-managements", icon: FiBriefcase, label: "Booking Management" },
  { href: "/admin/invoices", icon: FiFileText, label: "Invoices" },
  { href: "/admin/finance", icon: FiDollarSign, label: "Finance" },
  { href: "/admin/photo-drive", icon: FiLink, label: "Photo Link" },
  { href: "/admin/pose-library", icon: FiCamera, label: "Photo Gallery" },
  { href: "/admin/staff", icon: FiUsers, label: "Staffs" },
  { href: "/admin/change-password", icon: FiKey, label: "Change Password" },
  { href: "/admin/user-manual", icon: FiBook, label: "User Manual" },
];

const MenuSkeleton = () => (
  <div className="space-y-2 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2.5">
        <div className="h-4 w-4 rounded bg-neutral-700"></div>
        <div className="h-4 flex-1 rounded bg-neutral-700"></div>
      </div>
    ))}
  </div>
);

const MobileMenuSkeleton = ({ count }: { count: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex flex-col items-center justify-center gap-1">
        <div className="h-5 w-5 rounded-md bg-neutral-700" />
        <div className="h-2.5 w-8 rounded bg-neutral-700" />
      </div>
    ))}
  </>
);

function SidebarContent({
  user,
  userLoading,
  pathname,
  onSignOut,
  onClose,
  visibleNavItems,
}: {
  user: { name: string; accessRole: string } | null;
  userLoading: boolean;
  pathname: string;
  onSignOut: () => void;
  onClose: () => void;
  visibleNavItems: Array<{ href: string; icon: React.ElementType; label: string }>;
}) {
  return (
    <div className="flex h-full flex-col bg-[#050505] border-r border-white/5">
      <div className="flex h-20 items-center px-5 border-b border-white/5 bg-gradient-to-b from-orange-500/[0.03] to-transparent">
        <Link
          href="/admin"
          className="flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02]"
          onClick={onClose}
        >
          <div className="relative flex items-center justify-center rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-500/20 via-neutral-900 to-black p-2 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
            <Image
              src="/logo.png"
              alt="ChitroJaal Logo"
              width={110}
              height={32}
              className="h-8 w-auto object-contain"
              priority
            />
          </div>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
        <nav className="grid gap-3 px-3">
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Main Menu
          </div>
          {userLoading ? (
            <MenuSkeleton />
          ) : (
            visibleNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? "bg-orange-500/10 text-orange-400"
                      : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-100"
                  }`}
                  onClick={onClose}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-orange-500 rounded-r-full shadow-[0_0_10px_rgba(234,88,12,0.5)]" />
                  )}
                  <item.icon
                    className={`h-4 w-4 shrink-0 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                  />
                  {item.label}
                </Link>
              );
            })
          )}
        </nav>
      </div>
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-gradient-to-r from-[#0A0A0A] to-[#121212] border border-orange-500/20 shadow-md">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md border border-white/10">
            {user ? user.name.charAt(0).toUpperCase() : ""}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">
              {user ? user.name : "Loading..."}
            </p>
            <p className="text-[11px] text-orange-400 font-medium truncate capitalize">
              {user ? `${user.accessRole} account` : ""}
            </p>
          </div>
          <button
            onClick={onSignOut}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title="Logout"
          >
            <FiLogOut />
          </button>
        </div>
      </div>
    </div>
  );
}

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; accessRole: string } | null>(
    null,
  );
  const [userLoading, setUserLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
        } else {
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
        router.push("/admin/login");
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isSidebarOpen]);

  const visibleNavItems = navItems;

  useEffect(() => {
    if (pathname === "/admin/poses") {
      router.replace("/admin/pose-library");
    }
  }, [pathname, router]);

  const mobileNavItems = visibleNavItems.slice(0, 4);
  const mobileNavCount = mobileNavItems.length || 4;

  return (
    <div className="flex min-h-screen w-full bg-[#0A0A0A] text-neutral-200 selection:bg-orange-500/30">
      <aside className="hidden md:flex flex-col w-[240px] fixed inset-y-0 z-20">
        <SidebarContent
          user={user}
          userLoading={userLoading}
          pathname={pathname}
          onSignOut={handleSignOut}
          onClose={() => setIsSidebarOpen(false)}
          visibleNavItems={visibleNavItems}
        />
      </aside>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div
            className="fixed left-0 top-0 h-full w-64 transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent
              user={user}
              userLoading={userLoading}
              pathname={pathname}
              onSignOut={handleSignOut}
              onClose={() => setIsSidebarOpen(false)}
              visibleNavItems={visibleNavItems}
            />
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col md:pl-[240px] min-w-0 pb-16 md:pb-0">
        <header className="flex h-16 items-center justify-between gap-4 border-b border-white/5 bg-[#050505] px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              className="md:hidden p-2 -ml-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <FiMenu size={24} />
            </button>
            <div className="flex items-center gap-3 min-w-0">
              <Link href="/admin" className="md:hidden flex items-center shrink-0">
                <Image
                  src="/logo.png"
                  alt="ChitroJaal Logo"
                  width={90}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </Link>
              {user ? (
                <div className="flex items-center gap-3 rounded-full border border-orange-500/30 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent py-1.5 px-3.5 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-600 font-extrabold text-white text-xs shadow-md border border-white/20">
                    {user.name ? user.name.charAt(0).toUpperCase() : "A"}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black tracking-wide text-white sm:text-sm truncate">
                        {user.name}
                      </span>
                      <span className="rounded-md border border-orange-500/40 bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-300">
                        {user.accessRole}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-8 w-32 animate-pulse rounded-full bg-neutral-800" />
              )}
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:border-orange-500/40 hover:bg-orange-500/10 transition-colors"
          >
            Logout
          </button>
        </header>
        <main className="flex-1 p-2 sm:p-4 lg:p-8 overflow-x-hidden">{children}</main>
        <footer className="border-t border-white/5 bg-[#050505] p-4 text-center text-xs text-neutral-500">
          &copy; {new Date().getFullYear()} ChitroJaal. All rights reserved.
        </footer>
      </div>
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#050505] border-t border-white/10 z-40 md:hidden">
        <div
          className="grid h-full"
          style={{
            gridTemplateColumns: `repeat(${mobileNavCount + 1}, minmax(0, 1fr))`,
          }}
        >
          {userLoading ? (
            <>
              <MobileMenuSkeleton count={mobileNavCount} />
              <div className="flex flex-col items-center justify-center gap-1 h-full border-l border-white/10">
                <div className="h-5 w-5 rounded-md bg-neutral-700" />
                <div className="h-2.5 w-8 rounded bg-neutral-700" />
              </div>
            </>
          ) : (
            mobileNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-200 ${isActive ? "text-orange-400" : "text-neutral-400 hover:text-white"}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-[9px] font-medium whitespace-nowrap truncate">
                    {item.label}
                  </span>
                </Link>
              );
            })
          )}
          <button
            onClick={handleSignOut}
            className="flex flex-col items-center justify-center gap-1 h-full text-neutral-400 hover:text-white border-l border-white/10"
          >
            <FiLogOut className="h-5 w-5" />
            <span className="text-[10px] font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
