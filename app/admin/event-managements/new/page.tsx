"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../../components/home/AdminLayout";
import EventManagementFormFields, {
  createEmptyEventForm,
} from "../EventManagementFormFields";
import { FiSave } from "react-icons/fi";

export default function NewEventManagementPage() {
  const router = useRouter();
  const [form, setForm] = useState(createEmptyEventForm);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const totalAmount = Number(form.totalAmount || 0);
      const discountAmount = Number(form.discountAmount || 0);
      const paidAmount = Number(form.paidAmount || 0);
      const finalAmount = Math.max(totalAmount - discountAmount, 0);
      const dueAmount = Math.max(finalAmount - paidAmount, 0);

      const response = await fetch("/api/event-managements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          totalAmount,
          discountAmount,
          advanceAmount: paidAmount,
          paidAmount,
          dueAmount,
          finalAmount,
          eventDate: form.eventSchedule[0]?.date || form.eventDate,
        }),
      });

      if (response.ok) {
        router.push("/admin/event-managements");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="relative mx-auto max-w-6xl space-y-6 p-4 pb-12 text-neutral-200 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">New Booking Management</h1>
            <p className="mt-1 text-sm text-neutral-400">
              Create the event, schedule, discount, and payment details in one place.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:from-orange-500 hover:to-orange-400 disabled:opacity-50"
          >
            <FiSave /> {saving ? "Saving..." : "Save"}
          </button>
        </div>

        <div className="rounded-[1.5rem] border border-white/5 bg-[#0A0A0A]/80 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
          <EventManagementFormFields form={form} setForm={setForm} />
        </div>
      </div>
    </AdminLayout>
  );
}
