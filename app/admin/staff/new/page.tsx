"use client";

import React, { useState } from "react";
import AdminLayout from "../../../components/home/AdminLayout";
import { useRouter } from "next/navigation";

export default function NewStaffPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    loginId: "",
    password: "",
    phone: "",
    role: "Photographer",
    status: "Active",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push(`/admin/staff`);
      } else {
        const errorData = await response.json();
        alert(`Error creating staff member: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error creating staff member:", error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="relative max-w-2xl mx-auto space-y-8 pb-12 text-neutral-200">
        <h1 className="text-3xl font-bold mb-6">Add New Staff Member</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-[#0A0A0A]/80 p-8 rounded-[1.5rem] border border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">Login ID</label>
              <input type="text" name="loginId" value={formData.loginId} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">Role</label>
              <select name="role" value={formData.role} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10">
                  <option>Senior Photographer</option>
                  <option>Photographer</option>
                  <option>Photo Editor</option>
                  <option>Video Editor</option>
                  <option>Assistant Photographer</option>
              </select>
            </div>
             <div className="space-y-2">
              <label className="text-sm font-bold">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10">
                  <option>Active</option>
                  <option>On Leave</option>
                  <option>Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={loading} className="px-6 py-3 rounded-xl bg-orange-600 text-white font-bold disabled:bg-orange-800">
              {loading ? "Saving..." : "Save Staff Member"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
