"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import AdminLayout from "@/app/components/home/AdminLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid,
  FiUploadCloud,
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
  FiSave,
  FiCheck,
  FiRefreshCw,
  FiAlertCircle,
  FiImage,
  FiBox,
  FiUser,
  FiCompass,
  FiClock,
  FiSliders,
  FiChevronDown,
  FiFilm,
  FiStar,
} from "react-icons/fi";

type BentoFolder =
  | "portfolio"
  | "portrait-library"
  | "landscape-library"
  | "package";

export type AnimationType = "fade" | "zoom" | "slide" | "slideUp" | "blur";

export interface BentoCategorySettings {
  intervalDuration: number;
  animationType: AnimationType;
}

export type BentoSettings = Record<BentoFolder, BentoCategorySettings>;

interface CategoryInfo {
  id: BentoFolder;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  bentoCard: string;
}

const CATEGORIES: CategoryInfo[] = [
  {
    id: "portfolio",
    title: "Portfolio",
    subtitle: "Top-Left Hero Bento Card (Aspect 3:4)",
    icon: FiImage,
    bentoCard: "Portfolio Card",
  },
  {
    id: "portrait-library",
    title: "Portrait Library",
    subtitle: "Bottom-Left Hero Bento Card (Vertical Text)",
    icon: FiUser,
    bentoCard: "Portrait Library Card",
  },
  {
    id: "package",
    title: "Packages",
    subtitle: "Top-Right Hero Bento Card (Aspect 1:1)",
    icon: FiBox,
    bentoCard: "Packages Card",
  },
  {
    id: "landscape-library",
    title: "Landscape Library",
    subtitle: "Bottom-Right Hero Bento Card (Aspect 16:10)",
    icon: FiCompass,
    bentoCard: "Landscape Library Card",
  },
];

const ANIMATION_OPTIONS: {
  id: AnimationType;
  name: string;
  description: string;
  badge: string;
}[] = [
  {
    id: "fade",
    name: "Fade Out / Fade In",
    description: "Classic smooth cross-fade transition",
    badge: "Recommended",
  },
  {
    id: "zoom",
    name: "Zoom & Depth",
    description: "Scale in/out with soft opacity cross-fade",
    badge: "Dynamic",
  },
  {
    id: "slide",
    name: "Horizontal Slide",
    description: "Smooth horizontal motion slide right/left",
    badge: "Modern",
  },
  {
    id: "slideUp",
    name: "Vertical Slide",
    description: "Upward sliding motion transition",
    badge: "Sleek",
  },
  {
    id: "blur",
    name: "Glass Blur Fade",
    description: "Soft blur-in and defocus transition",
    badge: "Premium",
  },
];

const INTERVAL_OPTIONS = [
  { value: 1000, label: "1.0 second (Fast)" },
  { value: 1500, label: "1.5 seconds" },
  { value: 2000, label: "2.0 seconds (Default)" },
  { value: 2500, label: "2.5 seconds" },
  { value: 3000, label: "3.0 seconds" },
  { value: 4000, label: "4.0 seconds (Slow)" },
  { value: 5000, label: "5.0 seconds" },
];

const DEFAULT_SETTINGS: BentoSettings = {
  portfolio: { intervalDuration: 2000, animationType: "fade" },
  "portrait-library": { intervalDuration: 2000, animationType: "fade" },
  package: { intervalDuration: 2000, animationType: "zoom" },
  "landscape-library": { intervalDuration: 2000, animationType: "slide" },
};

export default function BentoGridAdminPage() {
  const [activeTab, setActiveTab] = useState<BentoFolder>("portfolio");
  const [folderImages, setFolderImages] = useState<Record<BentoFolder, string[]>>({
    portfolio: [],
    "portrait-library": [],
    "landscape-library": [],
    package: [],
  });

  const [settings, setSettings] = useState<BentoSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingPath, setDeletingPath] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const isAdmin = userRole === "admin";

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const userData = await response.json();
          setUserRole(userData.user?.accessRole);
        }
      } catch (error) {
        console.error("Failed to fetch user role", error);
      }
    };
    fetchUserRole();
  }, []);
  
  // Custom dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch bento folder images and settings
  const fetchBentoData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/hero-grid");
      const result = await res.json();
      if (result.success) {
        if (result.folders) setFolderImages(result.folders);
        if (result.settings) setSettings(result.settings);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to load photos" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Error connecting to server" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBentoData();
  }, []);

  const showToast = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage(null);
    }, 4000);
  };

  // Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("folder", activeTab);
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await fetch("/api/admin/hero-grid", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success && result.images) {
        setFolderImages((prev) => ({
          ...prev,
          [activeTab]: result.images,
        }));
        showToast("success", `Uploaded ${files.length} photo(s) to ${activeTab}!`);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        showToast("error", result.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Error uploading files");
    } finally {
      setUploading(false);
    }
  };

  // Reorder handlers
  const moveImage = (index: number, direction: "up" | "down") => {
    const currentList = [...folderImages[activeTab]];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= currentList.length) return;

    const temp = currentList[index];
    currentList[index] = currentList[targetIndex];
    currentList[targetIndex] = temp;

    setFolderImages((prev) => ({
      ...prev,
      [activeTab]: currentList,
    }));
  };

  // Save Settings & Serialization Order
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/hero-grid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          folder: activeTab,
          images: folderImages[activeTab],
          settings,
        }),
      });
      const result = await res.json();
      if (result.success) {
        showToast("success", "Saved photo sequence and animation settings!");
      } else {
        showToast("error", result.error || "Failed to save changes");
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  // Update Settings locally
  const updateCategorySetting = <K extends keyof BentoCategorySettings>(
    key: K,
    value: BentoCategorySettings[K],
  ) => {
    setSettings((prev) => ({
      ...prev,
      [activeTab]: {
        ...(prev[activeTab] || DEFAULT_SETTINGS[activeTab]),
        [key]: value,
      },
    }));
  };

  // Delete Image Handler
  const handleDeleteImage = async (imagePath: string) => {
    if (!confirm("Are you sure you want to delete this photo from disk?")) return;

    setDeletingPath(imagePath);
    try {
      const res = await fetch("/api/admin/hero-grid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          folder: activeTab,
          imagePath,
        }),
      });
      const result = await res.json();
      if (result.success && result.images) {
        setFolderImages((prev) => ({
          ...prev,
          [activeTab]: result.images,
        }));
        showToast("success", "Photo deleted locally!");
      } else {
        showToast("error", result.error || "Failed to delete photo");
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Error deleting photo");
    } finally {
      setDeletingPath(null);
    }
  };

  const activeCategory = CATEGORIES.find((cat) => cat.id === activeTab)!;
  const activeImages = folderImages[activeTab] || [];
  const currentCategorySettings =
    settings[activeTab] || DEFAULT_SETTINGS[activeTab];
  const selectedAnimOption =
    ANIMATION_OPTIONS.find((a) => a.id === currentCategorySettings.animationType) ||
    ANIMATION_OPTIONS[0];

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-6 p-4 pb-16 text-neutral-200">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-400">
                <FiGrid size={18} />
              </span>
              <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
                Bento Grid Photos & Animations
              </h1>
            </div>
            <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
              Control local photo folders, sequence order, slideshow durations, and animation transition styles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchBentoData}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-neutral-300 transition hover:bg-white/10 hover:text-white"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} size={14} />
              Refresh
            </button>
            {isAdmin && (
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl border border-orange-500/40 bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(234,88,12,0.25)] transition hover:from-orange-500 hover:to-amber-500 disabled:opacity-50"
              >
                {saving ? <FiRefreshCw className="animate-spin" size={14} /> : <FiSave size={14} />}
                Save All Settings
              </button>
            )}
          </div>
        </div>

        {/* Status Notification Toast */}
        {message && (
          <div
            className={`flex items-center gap-3 rounded-xl border p-4 text-xs font-semibold sm:text-sm transition-all shadow-lg ${
              message.type === "success"
                ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-300 shadow-emerald-950/50"
                : "border-red-500/30 bg-red-950/40 text-red-300 shadow-red-950/50"
            }`}
          >
            {message.type === "success" ? (
              <FiCheck className="h-5 w-5 text-emerald-400 shrink-0" />
            ) : (
              <FiAlertCircle className="h-5 w-5 text-red-400 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Category Tabs */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = (folderImages[cat.id] || []).length;
            const isActive = activeTab === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`group relative flex flex-col items-start rounded-2xl border p-3 sm:p-4 text-left transition-all duration-200 ${
                  isActive
                    ? "border-orange-500/50 bg-gradient-to-br from-orange-950/40 via-amber-950/20 to-[#0A0A0A] shadow-[0_0_20px_rgba(234,88,12,0.15)]"
                    : "border-white/10 bg-[#0A0A0A]/80 hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <div
                    className={`rounded-lg border p-2 ${
                      isActive
                        ? "border-orange-500/30 bg-orange-500/20 text-orange-400"
                        : "border-white/10 bg-white/5 text-neutral-400 group-hover:text-neutral-200"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-extrabold ${
                      isActive
                        ? "border-orange-500/40 bg-orange-500/20 text-orange-300"
                        : "border-white/10 bg-white/5 text-neutral-400"
                    }`}
                  >
                    {count} photos
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-bold text-white sm:text-base">
                  {cat.title}
                </h3>
                <p className="mt-0.5 text-[11px] text-neutral-400 line-clamp-1">
                  {cat.bentoCard}
                </p>
              </button>
            );
          })}
        </div>

        {/* Animation & Slideshow Settings Controls */}
        <div className="rounded-2xl border border-white/10 bg-[#0A0A0A]/90 p-4 sm:p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-400">
                <FiSliders size={16} />
              </span>
              <h2 className="text-base font-bold text-white sm:text-lg">
                Animation & Transition Controls ({activeCategory.title})
              </h2>
            </div>
            <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[11px] font-bold text-orange-400">
              Live Configured
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Animation Duration Selector */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-300">
                <FiClock className="text-orange-400" size={14} />
                Slideshow Change Speed (Duration)
              </label>
              <p className="text-xs text-neutral-400">
                Set how long each photo stays before changing to the next.
              </p>
              <div className="relative">
                <select
                  value={currentCategorySettings.intervalDuration}
                  onChange={(e) => updateCategorySetting("intervalDuration", Number(e.target.value))}
                  className="w-full appearance-none rounded-xl border border-white/15 bg-white/5 py-3 px-4 text-xs font-semibold text-white transition hover:border-orange-500/40 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  {INTERVAL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#121212] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
              </div>
            </div>

            {/* 2. Custom Animated Dropdown for Animation Types */}
            <div className="space-y-2" ref={dropdownRef}>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-300">
                <FiFilm className="text-orange-400" size={14} />
                Transition Animation Style
              </label>
              <p className="text-xs text-neutral-400">
                Choose the visual animation effect when switching photos.
              </p>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex w-full items-center justify-between rounded-xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent p-3.5 text-left text-xs font-semibold text-white shadow-md transition hover:border-orange-500/60"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-orange-500/30 bg-orange-500/20 text-orange-400">
                      <FiStar size={14} />
                    </span>
                    <div>
                      <div className="font-bold text-white text-sm">
                        {selectedAnimOption.name}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {selectedAnimOption.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-orange-500/40 bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-300">
                      {selectedAnimOption.badge}
                    </span>
                    <motion.div
                      animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiChevronDown size={18} className="text-orange-400" />
                    </motion.div>
                  </div>
                </button>

                {/* Animated Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 4, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-2xl border border-white/15 bg-[#121212]/95 p-2 shadow-2xl backdrop-blur-xl"
                    >
                      <div className="space-y-1">
                        {ANIMATION_OPTIONS.map((opt) => {
                          const isSelected =
                            currentCategorySettings.animationType === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                updateCategorySetting("animationType", opt.id);
                                setIsDropdownOpen(false);
                              }}
                              className={`group flex w-full items-center justify-between rounded-xl p-3 text-left transition-all duration-150 ${
                                isSelected
                                  ? "border border-orange-500/40 bg-orange-500/20 text-white shadow-md"
                                  : "hover:bg-white/10 text-neutral-300 hover:text-white"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                                    isSelected
                                      ? "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)] scale-125"
                                      : "bg-neutral-600 group-hover:bg-neutral-400"
                                  }`}
                                />
                                <div>
                                  <div className="text-xs font-bold">
                                    {opt.name}
                                  </div>
                                  <div className="text-[10px] text-neutral-400">
                                    {opt.description}
                                  </div>
                                </div>
                              </div>
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${
                                  isSelected
                                    ? "border-orange-500/50 bg-orange-500/30 text-orange-200"
                                    : "border-white/10 bg-white/5 text-neutral-400"
                                }`}
                              >
                                {opt.badge}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content Header & Uploader */}
        <div className="rounded-2xl border border-white/10 bg-[#0A0A0A]/90 p-4 sm:p-6 shadow-xl space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white sm:text-xl flex items-center gap-2">
                <span>{activeCategory.title} Photos</span>
                <span className="text-xs font-normal text-orange-400">
                  (`/public/${activeCategory.id}`)
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                {activeCategory.subtitle}. Drag or use arrows to set the exact sequence order.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isAdmin && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="bento-file-input"
                  />
                  <label
                    htmlFor="bento-file-input"
                    className={`inline-flex items-center gap-2 cursor-pointer rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2.5 text-xs font-bold text-orange-300 transition hover:bg-orange-500/20 hover:border-orange-500/50 shadow-md ${
                      uploading ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    {uploading ? (
                      <FiRefreshCw className="animate-spin" size={16} />
                    ) : (
                      <FiUploadCloud size={16} />
                    )}
                    <span>{uploading ? "Uploading..." : "Upload Photos"}</span>
                  </label>

                  <button
                    onClick={handleSaveAll}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 disabled:opacity-50"
                  >
                    <FiSave size={14} />
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Serialized Photo List */}
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 py-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-2xl border border-white/5 bg-white/5"
                />
              ))}
            </div>
          ) : activeImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 p-12 text-center">
              <div className="mb-3 rounded-full bg-white/5 p-4 text-neutral-500">
                <FiImage size={32} />
              </div>
              <h3 className="text-base font-bold text-white">No photos in {activeCategory.title}</h3>
              <p className="mt-1 max-w-sm text-xs text-neutral-400">
                Upload photos to save them locally into <code className="text-orange-400">public/{activeCategory.id}</code> and feature them on the Bento grid.
              </p>
              {isAdmin && (
                <label
                  htmlFor="bento-file-input"
                  className="mt-4 inline-flex items-center gap-2 cursor-pointer rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-orange-500"
                >
                  <FiUploadCloud size={14} /> Upload First Photo
                </label>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {activeImages.map((src, index) => {
                const filename = src.split("/").pop() || "";
                const isDeleting = deletingPath === src;

                return (
                  <div
                    key={src}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-2 shadow-lg transition duration-200 hover:border-orange-500/40 hover:shadow-orange-900/20"
                  >
                    {/* Sequence Badge */}
                    <div className="absolute top-3 left-3 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-orange-500/40 bg-black/80 font-mono text-[11px] font-extrabold text-orange-400 backdrop-blur-md shadow-md">
                      #{index + 1}
                    </div>

                    {/* Controls Overlay */}
                    {isAdmin && (
                      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => moveImage(index, "up")}
                          disabled={index === 0}
                          title="Move Left / Up in Sequence"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/20 bg-black/70 text-white hover:bg-orange-600 disabled:opacity-30 backdrop-blur-md"
                        >
                          <FiArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => moveImage(index, "down")}
                          disabled={index === activeImages.length - 1}
                          title="Move Right / Down in Sequence"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/20 bg-black/70 text-white hover:bg-orange-600 disabled:opacity-30 backdrop-blur-md"
                        >
                          <FiArrowDown size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteImage(src)}
                          disabled={isDeleting}
                          title="Delete photo locally"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-500/30 bg-red-950/80 text-red-300 hover:bg-red-600 hover:text-white backdrop-blur-md"
                        >
                          {isDeleting ? (
                            <FiRefreshCw className="animate-spin" size={12} />
                          ) : (
                            <FiTrash2 size={13} />
                          )}
                        </button>
                      </div>
                    )}

                    {/* Image Preview Container */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-900">
                      <Image
                        src={src}
                        alt={`Bento ${activeCategory.title} photo #${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                      />
                    </div>

                    {/* Footer filename */}
                    <div className="mt-2 px-1 min-w-0">
                      <p className="truncate text-[10px] font-medium text-neutral-300" title={filename}>
                        {filename}
                      </p>
                      <div className="flex items-center justify-between text-[9px] text-neutral-500 mt-0.5">
                        <span>Sequence #{index + 1}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
