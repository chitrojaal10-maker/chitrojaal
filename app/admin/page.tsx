"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminLayout from "../components/home/AdminLayout";
import UpcomingEventsPanel, {
  UpcomingEventItem,
} from "../components/admin/UpcomingEventsPanel";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClipboard,
  FiDollarSign,
  FiFileText,
  FiImage,
  FiLink,
  FiPlus,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

import { motion, AnimatePresence } from "framer-motion";

type DashboardMetric = {
  label: string;
  value: number;
  kind: "count" | "currency";
  detail: string;
  icon: "calendar" | "check" | "dollar" | "clock" | "users" | "image";
};

type StaffFeature = {
  _id: string;
  title: string;
  description: string;
  href: string;
  iconKey: string;
  badge?: string;
  audience: "all" | "admin" | "staff";
  active?: boolean;
};

type DashboardResponse = {
  metrics?: DashboardMetric[];
  upcomingEvents?: UpcomingEventItem[];
  galleryImages?: string[];
};

const iconMap = {
  calendar: FiCalendar,
  check: FiCheckCircle,
  dollar: FiDollarSign,
  clock: FiTrendingUp,
  users: FiUsers,
  image: FiImage,
};

const featureIconMap = {
  calendar: FiCalendar,
  users: FiUsers,
  link: FiLink,
  note: FiClipboard,
};

const metricCardLinks: Record<string, string> = {
  "Upcoming Events": "/admin/event-managements",
  "Events Done": "/admin/event-managements",
  "Payment Received": "/admin/finance",
  "Due Payment": "/admin/finance",
  "Total Staff": "/admin/staff",
  "Photo Gallery": "/admin/pose-library",
  "Photo Library": "/admin/pose-library",
  "Pose Library": "/admin/pose-library",
};

const formatCurrency = (value: number) => `৳${value.toLocaleString("en-BD")}`;

const FadeSlideshowImage = ({
  images,
  intervalDuration = 3500,
  alt = "Gallery Image",
}: {
  images: string[];
  intervalDuration?: number;
  alt?: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, intervalDuration);
    return () => clearInterval(timer);
  }, [images, intervalDuration]);

  if (!images || images.length === 0) return null;
  const currentImage = images[currentIndex] || images[0];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={currentImage}
            alt={alt}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const metricThemeMap: Record<
  string,
  {
    border: string;
    bg: string;
    iconBg: string;
    iconText: string;
    accentText: string;
    glow: string;
  }
> = {
  "Upcoming Events": {
    border: "border-sky-500/30 hover:border-sky-400/70",
    bg: "bg-gradient-to-br from-sky-950/50 via-blue-950/25 to-[#0A0A0A]",
    iconBg: "border-sky-500/30 bg-sky-500/20 group-hover:bg-sky-500/30",
    iconText: "text-sky-400",
    accentText: "text-sky-400",
    glow: "shadow-[0_0_20px_rgba(56,189,248,0.15)]",
  },
  "Events Done": {
    border: "border-emerald-500/30 hover:border-emerald-400/70",
    bg: "bg-gradient-to-br from-emerald-950/50 via-teal-950/25 to-[#0A0A0A]",
    iconBg: "border-emerald-500/30 bg-emerald-500/20 group-hover:bg-emerald-500/30",
    iconText: "text-emerald-400",
    accentText: "text-emerald-400",
    glow: "shadow-[0_0_20px_rgba(52,211,153,0.15)]",
  },
  "Payment Received": {
    border: "border-green-500/30 hover:border-green-400/70",
    bg: "bg-gradient-to-br from-green-950/50 via-emerald-950/25 to-[#0A0A0A]",
    iconBg: "border-green-500/30 bg-green-500/20 group-hover:bg-green-500/30",
    iconText: "text-green-400",
    accentText: "text-green-400",
    glow: "shadow-[0_0_20px_rgba(34,197,94,0.15)]",
  },
  "Due Payment": {
    border: "border-amber-500/30 hover:border-amber-400/70",
    bg: "bg-gradient-to-br from-amber-950/50 via-orange-950/25 to-[#0A0A0A]",
    iconBg: "border-amber-500/30 bg-amber-500/20 group-hover:bg-amber-500/30",
    iconText: "text-amber-400",
    accentText: "text-amber-400",
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.15)]",
  },
  "Total Staff": {
    border: "border-purple-500/30 hover:border-purple-400/70",
    bg: "bg-gradient-to-br from-purple-950/50 via-fuchsia-950/25 to-[#0A0A0A]",
    iconBg: "border-purple-500/30 bg-purple-500/20 group-hover:bg-purple-500/30",
    iconText: "text-purple-400",
    accentText: "text-purple-400",
    glow: "shadow-[0_0_20px_rgba(192,132,252,0.15)]",
  },
  "Photo Gallery": {
    border: "border-orange-500/40 hover:border-orange-400/70",
    bg: "bg-gradient-to-br from-orange-950/50 via-amber-950/25 to-[#0A0A0A]",
    iconBg: "border-orange-500/30 bg-orange-500/20 group-hover:bg-orange-500/30",
    iconText: "text-orange-400",
    accentText: "text-orange-400",
    glow: "shadow-[0_0_25px_rgba(234,88,12,0.2)]",
  },
};

const panelThemeMap: Record<
  string,
  {
    border: string;
    bg: string;
    titleColor: string;
    arrowColor: string;
    glow: string;
  }
> = {
  "Booking Management": {
    border: "border-cyan-500/30 hover:border-cyan-400/70",
    bg: "bg-gradient-to-br from-cyan-950/50 via-blue-950/30 to-[#0A0A0A]",
    titleColor: "text-cyan-200 group-hover:text-cyan-100",
    arrowColor: "text-cyan-400",
    glow: "shadow-[0_0_25px_rgba(6,182,212,0.18)]",
  },
  Invoices: {
    border: "border-indigo-500/30 hover:border-indigo-400/70",
    bg: "bg-gradient-to-br from-indigo-950/50 via-purple-950/30 to-[#0A0A0A]",
    titleColor: "text-indigo-200 group-hover:text-indigo-100",
    arrowColor: "text-indigo-400",
    glow: "shadow-[0_0_25px_rgba(99,102,241,0.18)]",
  },
  "Photo Gallery": {
    border: "border-orange-500/40 hover:border-orange-400/70",
    bg: "bg-gradient-to-br from-orange-950/50 via-amber-950/30 to-[#0A0A0A]",
    titleColor: "text-orange-200 group-hover:text-orange-100",
    arrowColor: "text-orange-400",
    glow: "shadow-[0_0_25px_rgba(234,88,12,0.2)]",
  },
  Finance: {
    border: "border-emerald-500/30 hover:border-emerald-400/70",
    bg: "bg-gradient-to-br from-emerald-950/50 via-teal-950/30 to-[#0A0A0A]",
    titleColor: "text-emerald-200 group-hover:text-emerald-100",
    arrowColor: "text-emerald-400",
    glow: "shadow-[0_0_25px_rgba(16,185,129,0.18)]",
  },
  Staff: {
    border: "border-rose-500/30 hover:border-rose-400/70",
    bg: "bg-gradient-to-br from-rose-950/50 via-pink-950/30 to-[#0A0A0A]",
    titleColor: "text-rose-200 group-hover:text-rose-100",
    arrowColor: "text-rose-400",
    glow: "shadow-[0_0_25px_rgba(244,63,94,0.18)]",
  },
};

const quickLinkThemes = [
  {
    border: "border-cyan-500/30 hover:border-cyan-400/70",
    bg: "bg-gradient-to-br from-cyan-950/40 via-blue-950/20 to-[#0A0A0A]",
    iconBg: "border-cyan-500/30 bg-cyan-500/20 text-cyan-400",
    titleColor: "text-cyan-200",
  },
  {
    border: "border-purple-500/30 hover:border-purple-400/70",
    bg: "bg-gradient-to-br from-purple-950/40 via-fuchsia-950/20 to-[#0A0A0A]",
    iconBg: "border-purple-500/30 bg-purple-500/20 text-purple-400",
    titleColor: "text-purple-200",
  },
  {
    border: "border-emerald-500/30 hover:border-emerald-400/70",
    bg: "bg-gradient-to-br from-emerald-950/40 via-teal-950/20 to-[#0A0A0A]",
    iconBg: "border-emerald-500/30 bg-emerald-500/20 text-emerald-400",
    titleColor: "text-emerald-200",
  },
  {
    border: "border-amber-500/30 hover:border-amber-400/70",
    bg: "bg-gradient-to-br from-amber-950/40 via-orange-950/20 to-[#0A0A0A]",
    iconBg: "border-amber-500/30 bg-amber-500/20 text-amber-400",
    titleColor: "text-amber-200",
  },
];

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEventItem[]>([]);
  const [staffFeatures, setStaffFeatures] = useState<StaffFeature[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();
        setUserRole(userData.user?.accessRole);
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        if (!response.ok) throw new Error("Failed to load dashboard data");
        const result = await response.json();
        if (result.success) {
          const data = result.data as DashboardResponse;
          setMetrics(data.metrics || []);
          setUpcomingEvents(data.upcomingEvents || []);
          setGalleryImages(data.galleryImages || []);
        }
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  useEffect(() => {
    const loadStaffFeatures = async () => {
      const response = await fetch("/api/admin/staff-features");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStaffFeatures(result.data || []);
        }
      }
    };
    loadStaffFeatures();
  }, []);

  const visibleStaffFeatures = useMemo(() => {
    if (!userRole) return [];
    const filteredFeatures = staffFeatures.filter(
      (feature) =>
        feature.title !== "Upcoming Events" &&
        feature.title !== "Pose Library" &&
        feature.title !== "Photo Gallery" &&
        feature.title !== "Photo Library" &&
        feature.title !== "Team Roster",
    );
    if (userRole === "admin") return filteredFeatures;
    return filteredFeatures.filter(
      (feature) => feature.audience === "staff" || feature.audience === "all",
    );
  }, [staffFeatures, userRole]);

  const adminPanels = [
    {
      title: "Bento Grid",
      description: "Manage local photos & sequence.",
      href: "/admin/bento",
    },
    {
      title: "Booking Management",
      description: "Open bookings, shifts, and payments.",
      href: "/admin/event-managements",
    },
    {
      title: "Invoices",
      description: "View and download invoices.",
      href: "/admin/invoices",
    },
    {
      title: "Photo Gallery",
      description: "Browse poses and reference boards.",
      href: "/admin/pose-library",
    },
    {
      title: "Finance",
      description: "Check revenue and due totals.",
      href: "/admin/finance",
    },
    {
      title: "Staff",
      description: "Manage the team and access.",
      href: "/admin/staff",
    },
  ];

  return (
    <AdminLayout>
      <div className="relative mx-auto max-w-7xl space-y-4 p-4 pb-12 text-neutral-200 sm:space-y-6">
        <div className="pointer-events-none absolute top-0 left-1/4 h-[400px] w-[400px] translate-y-[-50%] rounded-full bg-orange-600/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 bottom-1/4 h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[150px]" />

        <div className="relative z-10 flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-end">
          <div className="flex items-center gap-3.5">
            <div className="hidden sm:flex h-12 items-center justify-center rounded-xl border border-orange-500/25 bg-gradient-to-br from-orange-500/15 to-neutral-900 px-3 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
              <Image
                src="/logo.png"
                alt="ChitroJaal Logo"
                width={80}
                height={28}
                className="h-6 w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="bg-clip-text text-2xl font-bold tracking-tight text-transparent bg-gradient-to-br from-white to-neutral-400 sm:text-3xl">
                Admin Dashboard
              </h1>
              <p className="mt-1 max-w-md text-xs sm:text-sm leading-relaxed text-neutral-400">
                Jump straight to the correct admin panel cards and manage event
                workflows from one place.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {userRole === "admin" && (
              <>
                <Link
                  href="/admin/event-managements/new"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all hover:from-orange-500 hover:to-orange-400"
                >
                  <FiPlus size={14} /> New Event
                </Link>
                <Link
                  href="/admin/invoices"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#0A0A0A] px-4 py-2 text-xs font-semibold text-white transition-all hover:border-orange-500/50 hover:bg-white/5"
                >
                  <FiFileText size={14} /> Create Invoice
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 sm:gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-2xl border border-white/5 bg-[#0A0A0A]/80 p-2.5 sm:p-4"
                >
                  <div className="mb-2 h-2 w-14 rounded bg-white/10" />
                  <div className="mb-1.5 h-6 w-14 rounded bg-white/10" />
                  <div className="h-2 w-20 rounded bg-white/10" />
                </div>
              ))
            : metrics.map((stat) => {
                const Icon = iconMap[stat.icon];
                const href = metricCardLinks[stat.label] || "/admin";
                const isGallery = stat.label === "Photo Gallery" || stat.label === "Photo Library";
                const hasImages = isGallery && galleryImages.length > 0;
                const theme = metricThemeMap[stat.label] || {
                  border: "border-white/10 hover:border-orange-500/50",
                  bg: "bg-[#0A0A0A]/80",
                  iconBg: "border-white/10 bg-white/5 text-orange-500",
                  iconText: "text-orange-500",
                  accentText: "text-orange-400",
                  glow: "shadow-lg",
                };

                return (
                  <Link
                    key={stat.label}
                    href={href}
                    className={`group relative overflow-hidden rounded-2xl border ${theme.border} ${
                      hasImages ? "shadow-[0_0_25px_rgba(234,88,12,0.2)]" : `${theme.bg} ${theme.glow}`
                    } p-2.5 shadow-lg transition-all duration-300 sm:p-4`}
                  >
                    {hasImages ? (
                      <>
                        <FadeSlideshowImage images={galleryImages} alt="Photo Gallery" intervalDuration={3500} />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
                      </>
                    ) : (
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />
                    )}

                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <div className={`rounded-lg border p-1.5 transition-colors ${hasImages ? "border-white/10 bg-black/40 backdrop-blur-md text-orange-400" : `${theme.iconBg}`}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <FiArrowRight className={`mt-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 ${hasImages ? "text-white/80" : theme.iconText}`} />
                    </div>
                    <div className={`relative z-10 mt-2.5 ${hasImages ? "rounded-xl bg-black/40 backdrop-blur-md border border-white/10 p-2 sm:p-2.5 text-white/90" : ""}`}>
                      <h3 className="mb-1 text-[8px] font-bold uppercase tracking-widest text-neutral-300 sm:text-[10px]">
                        {stat.label}
                      </h3>
                      <p className="mb-1.5 break-words text-lg font-black leading-none text-white sm:text-2xl drop-shadow-sm">
                        {stat.kind === "currency"
                          ? formatCurrency(stat.value)
                          : stat.value}
                      </p>
                      <div className="flex items-center text-[9px] font-semibold leading-tight text-neutral-300 sm:text-[11px]">
                        <FiTrendingUp className={`mr-1.5 ${hasImages ? "text-orange-400" : theme.accentText}`} />
                        {stat.detail}
                      </div>
                    </div>
                  </Link>
                );
              })}
        </div>

        {visibleStaffFeatures.length > 0 && (
          <div className="relative z-10 pt-2">
            <h2 className="mb-3 text-base font-bold text-white sm:mb-4 sm:text-lg">
              Quick Links
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
              {visibleStaffFeatures.map((feature, idx) => {
                const Icon =
                  featureIconMap[feature.iconKey as keyof typeof featureIconMap] ||
                  FiClipboard;
                const theme = quickLinkThemes[idx % quickLinkThemes.length];

                return (
                  <Link
                    href={feature.href}
                    key={feature._id}
                    className={`group relative min-w-0 overflow-hidden rounded-2xl border ${theme.border} ${theme.bg} p-2.5 transition-all duration-300 shadow-lg sm:p-4`}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />
                    <div className="relative z-10 flex items-start gap-2.5">
                      <div className={`shrink-0 rounded-lg border p-1.5 transition-colors ${theme.iconBg}`}>
                        <Icon className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className={`break-words text-[10px] font-bold leading-tight ${theme.titleColor} sm:text-sm md:text-base`}>
                          {feature.title}
                        </h3>
                        <p className="mt-1 break-words text-[9px] leading-snug text-neutral-400 sm:text-[11px] md:text-xs">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    {feature.badge && (
                      <span className="absolute top-2.5 right-2.5 rounded-full bg-orange-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-orange-400 sm:text-[11px]">
                        {feature.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="relative z-10 pt-2">
          <UpcomingEventsPanel events={upcomingEvents} compact={false} />
        </div>

        <div className="relative z-10 pt-2">
          <h2 className="mb-3 text-base font-bold text-white sm:mb-4 sm:text-lg">
            Admin Panels
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-5">
            {adminPanels.map((panel) => {
              const isGalleryPanel = panel.title === "Photo Gallery";
              const hasPanelImages = isGalleryPanel && galleryImages.length > 0;
              const theme = panelThemeMap[panel.title] || {
                border: "border-white/10 hover:border-orange-500/50",
                bg: "bg-[#0A0A0A]/80",
                titleColor: "text-white",
                arrowColor: "text-orange-400",
                glow: "shadow-lg",
              };

              return (
                <Link
                  key={panel.href}
                  href={panel.href}
                  className={`group relative overflow-hidden rounded-2xl border ${theme.border} ${
                    hasPanelImages
                      ? "shadow-[0_0_25px_rgba(234,88,12,0.2)]"
                      : `${theme.bg} ${theme.glow}`
                  } p-2.5 transition-all duration-300 hover:bg-white/[0.07] sm:p-4 flex flex-col justify-between`}
                >
                  {hasPanelImages && (
                    <>
                      <FadeSlideshowImage images={galleryImages} alt="Photo Gallery" intervalDuration={4000} />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
                    </>
                  )}

                  <div className={`relative z-10 ${hasPanelImages ? "rounded-xl bg-black/40 backdrop-blur-md border border-white/10 p-2 sm:p-2.5 text-white/90" : ""}`}>
                    <div className={`text-[10px] font-semibold leading-tight sm:text-sm transition-colors drop-shadow-sm ${hasPanelImages ? "text-white group-hover:text-orange-300" : theme.titleColor}`}>
                      {panel.title}
                    </div>
                    <div className={`mt-1 text-[9px] leading-snug sm:text-xs ${hasPanelImages ? "text-white/80" : "text-neutral-400"}`}>
                      {panel.description}
                    </div>
                  </div>
                  <div className={`relative z-10 mt-2 inline-flex items-center gap-1 text-[9px] font-semibold sm:text-xs ${hasPanelImages ? "text-orange-400" : theme.arrowColor}`}>
                    Open{" "}
                    <FiArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
