"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/app/components/home/AdminLayout";
import {
  FiLock,
  FiKey,
  FiUser,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
  FiShield,
  FiSave,
} from "react-icons/fi";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user?.name) {
            setName(data.user.name);
          }
        }
      } catch (err) {
        console.error("Failed to load user info:", err);
      } finally {
        setFetching(false);
      }
    }
    loadUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const isUpdatingPassword = Boolean(currentPassword || newPassword || confirmPassword);

    if (isUpdatingPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        setError("Please fill in all password fields to update password.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("New password and confirm password do not match.");
        return;
      }

      if (newPassword.length < 6) {
        setError("New password must be at least 6 characters long.");
        return;
      }
    }

    if (!name.trim() && !isUpdatingPassword) {
      setError("Please enter a valid name or password fields to update.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          ...(isUpdatingPassword
            ? { currentPassword, newPassword, confirmPassword }
            : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile settings");
      }

      setSuccess(data.message || "Admin profile updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Refresh page so top header reflects updated admin name
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-2xl px-2 py-4 sm:px-4 lg:py-8">
        <div className="mb-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-[#050505] p-6 shadow-xl">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-500">
            <FiShield size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Account & Password Management</h1>
            <p className="mt-1 text-sm text-neutral-400">
              Update your Admin Display Name and security password.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0A0A0A] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              <FiAlertCircle className="mt-0.5 shrink-0 text-red-400" size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              <FiCheckCircle className="mt-0.5 shrink-0 text-emerald-400" size={18} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">
                Admin Display Name
              </label>
              <div className="relative flex items-center rounded-xl border border-white/10 bg-[#050505] px-4 py-3 focus-within:border-orange-500/50">
                <FiUser className="mr-3 text-orange-500" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={fetching ? "Loading name..." : "Enter admin name"}
                  disabled={fetching}
                  className="w-full bg-transparent text-white outline-none placeholder:text-neutral-600 disabled:opacity-50"
                  autoComplete="off"
                />
              </div>
              <p className="mt-1.5 text-xs text-neutral-500">
                This name is displayed prominently on the top bar of the admin panel.
              </p>
            </div>

            <hr className="border-white/10 my-4" />

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">
                Current Password <span className="text-xs text-neutral-500">(Optional if only updating name)</span>
              </label>
              <div className="relative flex items-center rounded-xl border border-white/10 bg-[#050505] px-4 py-3 focus-within:border-orange-500/50">
                <FiLock className="mr-3 text-neutral-500" size={18} />
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-transparent text-white outline-none placeholder:text-neutral-600"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="ml-2 text-neutral-500 hover:text-neutral-300"
                >
                  {showCurrent ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">
                New Password
              </label>
              <div className="relative flex items-center rounded-xl border border-white/10 bg-[#050505] px-4 py-3 focus-within:border-orange-500/50">
                <FiKey className="mr-3 text-neutral-500" size={18} />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 characters)"
                  className="w-full bg-transparent text-white outline-none placeholder:text-neutral-600"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="ml-2 text-neutral-500 hover:text-neutral-300"
                >
                  {showNew ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">
                Confirm New Password
              </label>
              <div className="relative flex items-center rounded-xl border border-white/10 bg-[#050505] px-4 py-3 focus-within:border-orange-500/50">
                <FiKey className="mr-3 text-neutral-500" size={18} />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-transparent text-white outline-none placeholder:text-neutral-600"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="ml-2 text-neutral-500 hover:text-neutral-300"
                >
                  {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || fetching}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-5 py-3.5 font-semibold text-white shadow-lg transition active:scale-[0.99] hover:from-orange-500 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <FiSave size={18} />
                  <span>Save Account Changes</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
