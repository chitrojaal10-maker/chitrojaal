"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import AdminLayout from "../../components/home/AdminLayout";
import {
  FiArrowRight,
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiEdit,
  FiFolder,
  FiLink,
  FiMail,
  FiMapPin,
  FiPhone,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { useNotification } from "@/hooks/useNotification";
import { useMobileBackHandler } from "@/hooks/useMobileBackHandler";

interface StaffMember {
  id: string;
  name: string;
  loginId?: string;
  email?: string;
  accessRole?: "admin" | "staff";
  contact: string;
  address: string;
  joiningDate: string;
  salary: string;
  eventsCovered: number;
}

export default function StaffPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // Mobile Hardware Back Button Interceptor for Staff Modals
  useMobileBackHandler({
    active: isModalOpen || Boolean(editingStaff),
    onBack: () => {
      setIsModalOpen(false);
      setEditingStaff(null);
    },
  });
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [newStaff, setNewStaff] = useState({
    name: "",
    loginId: "",
    email: "",
    password: "",
    contact: "",
    address: "",
    joiningDate: "",
    salary: "",
    eventsCovered: "",
  });
  const { showSuccess, showError } = useNotification();

  const isAdmin = userRole === "admin";

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

  const fetchStaff = async () => {
    setLoadingStaff(true);
    try {
      const response = await fetch("/api/admin/staff");
      const result = await response.json();
      if (response.ok) {
        setStaffList(
          (result.data || []).map((item: any) => ({
            id: item._id,
            name: item.name || "",
            loginId: item.loginId || "",
            email: item.email || "",
            accessRole: item.accessRole || "staff",
            contact: item.contact || item.phone || "",
            address: item.address || "",
            joiningDate: item.joiningDate || "",
            salary: item.salary || "",
            eventsCovered: item.eventsCovered || item.assignments || 0,
          })),
        );
      }
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    } finally {
      setLoadingStaff(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStaff((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setNewStaff({
      name: "",
      loginId: "",
      email: "",
      password: "",
      contact: "",
      address: "",
      joiningDate: "",
      salary: "",
      eventsCovered: "",
    });
    setEditingStaff(null);
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!newStaff.name || !newStaff.loginId || !newStaff.joiningDate) {
      showError("Please fill all required fields (Name, Login ID, Joining Date).");
      return;
    }

    if (!editingStaff && !newStaff.password) {
      showError("Password is required for new staff accounts.");
      return;
    }

    try {
      const response = await fetch(
        editingStaff ? `/api/admin/staff/${editingStaff.id}` : "/api/admin/staff",
        {
          method: editingStaff ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newStaff,
            eventsCovered: Number(newStaff.eventsCovered) || 0,
            salary: newStaff.salary || "",
            password: newStaff.password || undefined,
          }),
        },
      );
      if (response.ok) {
        showSuccess(
          editingStaff
            ? "Staff updated successfully!"
            : "Staff member added successfully!",
        );
        setIsModalOpen(false);
        resetForm();
        fetchStaff();
      } else {
        showError("Could not save staff member.");
      }
    } catch (error) {
      console.error(error);
      showError("Unexpected error occurred.");
    }
  };

  const handleEdit = (staff: StaffMember) => {
    if (!isAdmin) return;
    setEditingStaff(staff);
    setNewStaff({
      name: staff.name || "",
      loginId: staff.loginId || "",
      email: staff.email || "",
      password: "",
      contact: staff.contact || "",
      address: staff.address || "",
      joiningDate: staff.joiningDate
        ? new Date(staff.joiningDate).toISOString().split("T")[0]
        : "",
      salary: staff.salary || "",
      eventsCovered: String(staff.eventsCovered || 0),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (staffId: string) => {
    if (!isAdmin) return;
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    try {
      const response = await fetch(`/api/admin/staff/${staffId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        showSuccess("Staff member deleted.");
        fetchStaff();
      } else {
        showError("Failed to delete staff member.");
      }
    } catch (error) {
      console.error(error);
      showError("Unexpected error occurred.");
    }
  };

  const filteredStaff = useMemo(() => {
    return staffList.filter((staff) => {
      const matchesSearch =
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (staff.loginId && staff.loginId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (staff.contact && staff.contact.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (staff.address && staff.address.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesRole =
        roleFilter === "all" || staff.accessRole === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [staffList, searchTerm, roleFilter]);

  const totalEventsSum = useMemo(() => {
    return staffList.reduce((acc, s) => acc + (Number(s.eventsCovered) || 0), 0);
  }, [staffList]);

  return (
    <AdminLayout>
      <div className="relative mx-auto max-w-7xl space-y-6 p-4 pb-12 text-neutral-200">
        {/* Header */}
        <div className="relative z-10 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
          <div>
            <h1 className="flex items-center gap-3 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent bg-gradient-to-br from-white to-neutral-400 sm:text-3xl">
              <FiUsers className="text-orange-500" /> Staff Management
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-400">
              {isAdmin
                ? "Complete overview and management of studio staff members and photo drive access."
                : "View studio staff directory, events covered, and photo drive access links."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/photo-drive"
              className="inline-flex items-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-bold text-orange-400 transition-all hover:bg-orange-500/20"
            >
              <FiFolder size={15} /> Photo Drive Links
            </Link>
            <Link
              href="/admin/event-managements"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#0A0A0A]/90 px-4 py-2 text-sm font-bold text-white transition-all hover:border-orange-500/40 hover:bg-white/5"
            >
              <FiArrowRight size={14} /> View Events
            </Link>
            {isAdmin && (
              <button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-none bg-gradient-to-r from-orange-600 to-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all hover:from-orange-500 hover:to-orange-400 hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] active:scale-95 md:w-auto"
              >
                <FiPlus size={16} /> Add New Staff
              </button>
            )}
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/5 bg-[#0A0A0A]/80 p-3.5 sm:p-5 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Total Staff
              </span>
              <div className="rounded-xl bg-orange-500/10 p-2 sm:p-2.5 text-orange-400">
                <FiUsers className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-extrabold text-white">
              {staffList.length}
            </p>
            <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-neutral-500 truncate">
              Registered members
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0A0A0A]/80 p-3.5 sm:p-5 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Events Covered
              </span>
              <div className="rounded-xl bg-blue-500/10 p-2 sm:p-2.5 text-blue-400">
                <FiBriefcase className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-extrabold text-white">
              {totalEventsSum}
            </p>
            <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-neutral-500 truncate">
              Events completed
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0A0A0A]/80 p-3.5 sm:p-5 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Staff Members
              </span>
              <div className="rounded-xl bg-emerald-500/10 p-2 sm:p-2.5 text-emerald-400">
                <FiUser className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-extrabold text-white">
              {staffList.filter((s) => s.accessRole === "staff" || !s.accessRole).length}
            </p>
            <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-neutral-500 truncate">
              Active operational
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0A0A0A]/80 p-3.5 sm:p-5 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Photo Drive Access
              </span>
              <div className="rounded-xl bg-purple-500/10 p-2 sm:p-2.5 text-purple-400">
                <FiFolder className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <Link
              href="/admin/photo-drive"
              className="mt-2 sm:mt-3 flex items-center justify-between text-xs sm:text-sm font-bold text-orange-400 hover:text-orange-300 transition-colors"
            >
              <span>Shared Links</span>
              <FiLink className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </Link>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/5 bg-[#0A0A0A]/80 p-3 sm:p-4">
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs sm:text-sm" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#050505] pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <label className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-neutral-400">
              Role:
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#050505] px-3 py-1.5 text-xs sm:text-sm text-white focus:border-orange-500 focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="staff">Staff Only</option>
              <option value="admin">Admin Only</option>
            </select>
          </div>
        </div>

        {/* Staff Members List / Cards */}
        <div className="rounded-2xl border border-white/5 bg-[#0A0A0A]/80 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-white/5 bg-[#050505] p-3 sm:p-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Staff Directory</h2>
              <p className="text-xs text-neutral-400 hidden sm:block">
                Detailed view of staff profiles, contact info, salary, and events covered.
              </p>
            </div>
            <div className="rounded-full border border-white/10 px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-300 shrink-0">
              {filteredStaff.length} showing
            </div>
          </div>

          {loadingStaff ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3 p-3 sm:p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-xl border border-white/5 bg-[#050505] p-3"
                >
                  <div className="mb-2 h-4 w-24 rounded bg-neutral-700" />
                  <div className="mb-2 h-3 w-32 rounded bg-neutral-800" />
                  <div className="h-3 w-20 rounded bg-neutral-800" />
                </div>
              ))}
            </div>
          ) : filteredStaff.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 p-2.5 sm:p-4 lg:grid-cols-3">
              {filteredStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="flex flex-col justify-between rounded-xl border border-white/5 bg-[#050505] p-3 sm:p-4 transition-all hover:border-white/20 hover:shadow-lg"
                >
                  <div>
                    {/* Top row: Name and Role Badge */}
                    <div className="flex items-start justify-between gap-2 border-b border-white/5 pb-2 sm:pb-3">
                      <div className="min-w-0 flex items-center gap-2 sm:gap-3">
                        <div className="flex h-7 w-7 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/20 to-orange-700/20 text-orange-400 font-bold text-xs sm:text-sm border border-orange-500/30">
                          {staff.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-xs sm:text-base font-bold text-white">
                            {staff.name}
                          </div>
                          <div className="text-[10px] sm:text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                            <FiUser size={10} className="text-neutral-500 shrink-0" />
                            <span className="text-neutral-300 font-medium truncate">
                              ID: {staff.loginId || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[8px] sm:px-2.5 sm:py-1 sm:text-[10px] font-semibold uppercase tracking-wider text-neutral-300 shrink-0">
                        {staff.accessRole || "staff"}
                      </span>
                    </div>

                    {/* Data Details List */}
                    <div className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-neutral-300">
                        <span className="flex items-center gap-1 text-neutral-400">
                          <FiPhone className="text-orange-400 shrink-0 h-3 w-3" /> Contact:
                        </span>
                        {staff.contact ? (
                          <a
                            href={`tel:${staff.contact}`}
                            className="font-medium text-white hover:text-orange-400 transition-colors truncate"
                          >
                            {staff.contact}
                          </a>
                        ) : (
                          <span className="text-neutral-500">N/A</span>
                        )}
                      </div>

                      {staff.email && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-neutral-300">
                          <span className="flex items-center gap-1 text-neutral-400">
                            <FiMail className="text-orange-400 shrink-0 h-3 w-3" /> Email:
                          </span>
                          <span className="truncate max-w-[120px] sm:max-w-[160px] font-medium text-neutral-200">
                            {staff.email}
                          </span>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-neutral-300">
                        <span className="flex items-center gap-1 text-neutral-400">
                          <FiCalendar className="text-orange-400 shrink-0 h-3 w-3" /> Joining:
                        </span>
                        <span className="font-medium text-neutral-200 truncate">
                          {staff.joiningDate || "N/A"}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-neutral-300">
                        <span className="flex items-center gap-1 text-neutral-400">
                          <FiDollarSign className="text-emerald-400 shrink-0 h-3 w-3" /> Salary:
                        </span>
                        <span className="font-bold text-emerald-400">
                          {staff.salary ? `৳${staff.salary}` : "N/A"}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-neutral-300">
                        <span className="flex items-center gap-1 text-neutral-400">
                          <FiBriefcase className="text-blue-400 shrink-0 h-3 w-3" /> Events:
                        </span>
                        <span className="font-bold text-white rounded-full bg-blue-500/10 px-1.5 py-0.5 border border-blue-500/20 text-[9px] sm:text-[11px] shrink-0 w-fit">
                          {staff.eventsCovered} events
                        </span>
                      </div>

                      {staff.address && (
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between text-neutral-300 pt-1 border-t border-white/5">
                          <span className="flex items-center gap-1 text-neutral-400 shrink-0">
                            <FiMapPin className="text-orange-400 shrink-0 h-3 w-3" /> Address:
                          </span>
                          <span className="truncate max-w-[140px] sm:max-w-[170px] text-neutral-400 sm:text-right">
                            {staff.address}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  {isAdmin && (
                    <div className="mt-4 flex items-center justify-end border-t border-white/5 pt-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(staff)}
                          className="rounded-lg bg-black/60 border border-white/10 p-2 text-white transition-colors hover:bg-white/20"
                          title="Edit Staff"
                        >
                          <FiEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(staff.id)}
                          className="rounded-lg bg-red-500/80 p-2 text-white transition-colors hover:bg-red-500"
                          title="Delete Staff"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-neutral-500">
              No staff members found matching your search.
              {isAdmin && " Add one to get started."}
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {isAdmin && isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <div className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/5 bg-[#050505] p-4">
                <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                  <FiUser className="text-orange-500" />
                  {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <FiX size={20} />
                </button>
              </div>
              <form onSubmit={handleAddStaff}>
                <div className="max-h-[70vh] space-y-4 overflow-y-auto p-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Full Name*
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newStaff.name || ""}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Login ID*
                      </label>
                      <input
                        type="text"
                        name="loginId"
                        value={newStaff.loginId || ""}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                        placeholder="staff01"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={newStaff.email || ""}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Password{editingStaff ? " (optional)" : "*"}
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={newStaff.password || ""}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                        placeholder={
                          editingStaff
                            ? "Leave blank to keep current"
                            : "Set password"
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Contact Number*
                      </label>
                      <input
                        type="text"
                        name="contact"
                        value={newStaff.contact || ""}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Joining Date*
                      </label>
                      <input
                        type="date"
                        name="joiningDate"
                        value={newStaff.joiningDate || ""}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={newStaff.address || ""}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                      placeholder="123 Main St, Dhaka"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Monthly Salary (BDT)
                      </label>
                      <input
                        type="number"
                        name="salary"
                        value={newStaff.salary || ""}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                        placeholder="25000"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Events Covered
                      </label>
                      <input
                        type="number"
                        name="eventsCovered"
                        value={newStaff.eventsCovered || ""}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 border-t border-white/5 bg-[#050505] p-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl px-5 py-2 font-bold text-neutral-400 transition-all hover:bg-white/5 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-5 py-2 font-bold text-white shadow-lg transition-all hover:from-orange-500 hover:to-orange-400 disabled:opacity-50"
                  >
                    <FiPlus /> {editingStaff ? "Update Staff" : "Add Staff"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
