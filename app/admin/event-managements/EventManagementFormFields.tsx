"use client";

import React from "react";

export type EventScheduleEntry = {
  date: string;
  shift: "Day" | "Night";
  packageName?: string;
  amount?: string;
};

export type EventManagementFormValues = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  eventDate: string;
  eventSchedule: EventScheduleEntry[];
  eventLocation: string;
  eventName: string;
  eventType: string;
  eventProgramType: "Main Program" | "Other Event";
  otherEventName: string;
  package: string;
  packageDetails: string;
  googleMapsLink: string;
  notes: string;
  totalAmount: string;
  discountAmount: string;
  advanceAmount: string;
  paidAmount: string;
  dueAmount: string;
  status: string;
  photographer: string;
  duration: string;
};

export const createEmptyScheduleEntry = (): EventScheduleEntry => ({
  date: "",
  shift: "Day",
  packageName: "",
  amount: "",
});

export const createEmptyEventForm = (): EventManagementFormValues => ({
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  customerAddress: "",
  eventDate: "",
  eventSchedule: [createEmptyScheduleEntry()],
  eventLocation: "",
  eventName: "",
  eventType: "",
  eventProgramType: "Main Program",
  otherEventName: "",
  package: "",
  packageDetails: "",
  googleMapsLink: "",
  notes: "",
  totalAmount: "",
  discountAmount: "",
  advanceAmount: "",
  paidAmount: "",
  dueAmount: "",
  status: "Pending",
  photographer: "",
  duration: "",
});

type Props = {
  form: EventManagementFormValues;
  setForm: React.Dispatch<React.SetStateAction<EventManagementFormValues>>;
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3 text-white placeholder-neutral-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40";

const labelClass =
  "text-[11px] uppercase tracking-[0.18em] font-semibold text-neutral-400 mb-1.5 block";

export default function EventManagementFormFields({ form, setForm }: Props) {
  const calculateTotalAndDue = (
    schedule: EventScheduleEntry[],
    prevTotal: string,
    discountStr: string,
    paidStr: string,
  ) => {
    const hasAnyScheduleAmount = schedule.some(
      (s) => s.amount !== undefined && s.amount !== "" && !isNaN(Number(s.amount)),
    );
    let totalAmount = prevTotal;
    if (hasAnyScheduleAmount) {
      const sum = schedule.reduce(
        (acc, s) => acc + (Number(s.amount) || 0),
        0,
      );
      totalAmount = sum > 0 ? sum.toString() : prevTotal;
    }
    const totalNum = Number(totalAmount || 0);
    const discountNum = Number(discountStr || 0);
    const paidNum = Number(paidStr || 0);
    const finalAmount = Math.max(totalNum - discountNum, 0);
    const dueAmount = Math.max(finalAmount - paidNum, 0).toString();

    return { totalAmount, dueAmount };
  };

  const updateField = (
    name: keyof EventManagementFormValues,
    value: string,
  ) => {
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      const totalAmount = Number(next.totalAmount || 0);
      const discountAmount = Number(next.discountAmount || 0);
      const paidAmount = Number(next.paidAmount || 0);
      const finalAmount = Math.max(totalAmount - discountAmount, 0);
      const dueAmount = Math.max(finalAmount - paidAmount, 0);
      next.dueAmount = dueAmount.toString();

      if (name === "totalAmount" && next.eventSchedule.length === 1) {
        next.eventSchedule = [
          {
            ...next.eventSchedule[0],
            amount: value,
          },
        ];
      }

      if (name === "eventDate") {
        next.eventSchedule = [
          {
            ...(next.eventSchedule[0] || createEmptyScheduleEntry()),
            date: value,
          },
          ...next.eventSchedule.slice(1),
        ];
      }

      return next;
    });
  };

  const updateSchedule = (
    index: number,
    field: keyof EventScheduleEntry,
    value: string,
  ) => {
    setForm((prev) => {
      const eventSchedule = [...prev.eventSchedule];
      eventSchedule[index] = {
        ...eventSchedule[index],
        [field]: value,
      } as EventScheduleEntry;

      const eventDate = eventSchedule[0]?.date || prev.eventDate;
      const { totalAmount, dueAmount } = calculateTotalAndDue(
        eventSchedule,
        prev.totalAmount,
        prev.discountAmount,
        prev.paidAmount,
      );

      return {
        ...prev,
        eventDate,
        eventSchedule,
        totalAmount,
        dueAmount,
      };
    });
  };

  const updateMainShift = (value: string) => {
    setForm((prev) => {
      const eventSchedule = [...prev.eventSchedule];
      const mainEntry = eventSchedule[0] || createEmptyScheduleEntry();
      eventSchedule[0] = {
        ...mainEntry,
        shift: value === "Night" ? "Night" : "Day",
        date: prev.eventDate || mainEntry.date,
      };

      return {
        ...prev,
        eventSchedule,
      };
    });
  };

  const addSchedule = () => {
    setForm((prev) => ({
      ...prev,
      eventSchedule: [...prev.eventSchedule, createEmptyScheduleEntry()],
    }));
  };

  const removeSchedule = (index: number) => {
    setForm((prev) => {
      const eventSchedule = prev.eventSchedule.filter(
        (_, itemIndex) => itemIndex !== index,
      );
      const nextSchedule =
        eventSchedule.length > 0 ? eventSchedule : [createEmptyScheduleEntry()];
      const { totalAmount, dueAmount } = calculateTotalAndDue(
        nextSchedule,
        prev.totalAmount,
        prev.discountAmount,
        prev.paidAmount,
      );

      return {
        ...prev,
        eventSchedule: nextSchedule,
        eventDate: nextSchedule[0]?.date || prev.eventDate,
        totalAmount,
        dueAmount,
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Customer Information */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>Customer Name</label>
          <input
            value={form.customerName}
            onChange={(e) => updateField("customerName", e.target.value)}
            className={inputClass}
            placeholder="Customer name"
          />
        </div>
        <div>
          <label className={labelClass}>Customer Phone</label>
          <input
            value={form.customerPhone}
            onChange={(e) => updateField("customerPhone", e.target.value)}
            className={inputClass}
            placeholder="Phone number"
          />
        </div>
        <div>
          <label className={labelClass}>Customer Email</label>
          <input
            value={form.customerEmail}
            onChange={(e) => updateField("customerEmail", e.target.value)}
            className={inputClass}
            placeholder="Email address"
          />
        </div>
        <div>
          <label className={labelClass}>Customer Address</label>
          <input
            value={form.customerAddress}
            onChange={(e) => updateField("customerAddress", e.target.value)}
            className={inputClass}
            placeholder="Address"
          />
        </div>
      </section>

      {/* Main Event Date & Type Details */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>Event Date</label>
          <input
            type="date"
            value={form.eventDate}
            onChange={(e) => updateField("eventDate", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Event Type</label>
          <input
            value={form.eventType}
            onChange={(e) => updateField("eventType", e.target.value)}
            className={inputClass}
            placeholder="Wedding, Birthday, Corporate"
          />
        </div>
      </section>

      {/* Multiple Event Dates & Schedule */}
      <section className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Event Schedule Dates
            </h3>
            <p className="text-xs text-neutral-400">
              Add one or more event dates with shift, package name, and amount.
            </p>
          </div>
          <button
            type="button"
            onClick={addSchedule}
            className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-xs font-semibold text-orange-300 transition hover:bg-orange-500/20"
          >
            + Add Event
          </button>
        </div>
        <div className="space-y-3">
          {form.eventSchedule.map((entry, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1.2fr)_130px_minmax(0,1.4fr)_130px_auto]"
            >
              <div>
                <label className={labelClass}>Date #{index + 1}</label>
                <input
                  type="date"
                  value={entry.date}
                  onChange={(e) =>
                    updateSchedule(index, "date", e.target.value)
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Shift #{index + 1}</label>
                <select
                  value={entry.shift}
                  onChange={(e) =>
                    updateSchedule(index, "shift", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="Day">Day shift</option>
                  <option value="Night">Night shift</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Package Name #{index + 1}</label>
                <input
                  value={entry.packageName || ""}
                  onChange={(e) =>
                    updateSchedule(index, "packageName", e.target.value)
                  }
                  className={inputClass}
                  placeholder="Package name for event"
                />
              </div>
              <div>
                <label className={labelClass}>Amount #{index + 1} (BDT)</label>
                <input
                  type="number"
                  min="0"
                  value={entry.amount || ""}
                  onChange={(e) =>
                    updateSchedule(index, "amount", e.target.value)
                  }
                  className={inputClass}
                  placeholder="Amount (BDT)"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeSchedule(index)}
                  className="w-full rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/20 md:w-fit"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Package & Event Information */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className={labelClass}>Event Name</label>
          <input
            value={form.eventName}
            onChange={(e) => updateField("eventName", e.target.value)}
            className={inputClass}
            placeholder="Event name"
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Package Details</label>
          <textarea
            value={form.packageDetails}
            onChange={(e) => updateField("packageDetails", e.target.value)}
            className={`${inputClass} min-h-[110px]`}
            placeholder="Package details and inclusions"
          />
        </div>
      </section>

      {/* Location & Notes */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>Event Location</label>
          <input
            value={form.eventLocation}
            onChange={(e) => updateField("eventLocation", e.target.value)}
            className={inputClass}
            placeholder="Event location"
          />
        </div>
        <div>
          <label className={labelClass}>Google Maps Link</label>
          <input
            type="url"
            value={form.googleMapsLink}
            onChange={(e) => updateField("googleMapsLink", e.target.value)}
            className={inputClass}
            placeholder="https://maps.google.com/..."
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Order Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            className={`${inputClass} min-h-[100px]`}
            placeholder="Special instructions or notes"
          />
        </div>
      </section>

      {/* Financials, Status & Staffing */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className={labelClass}>Total Amount (BDT)</label>
          <input
            type="number"
            min="0"
            value={form.totalAmount}
            onChange={(e) => updateField("totalAmount", e.target.value)}
            className={inputClass}
            placeholder="Total amount"
          />
        </div>
        <div>
          <label className={labelClass}>Discount Amount (BDT)</label>
          <input
            type="number"
            min="0"
            value={form.discountAmount}
            onChange={(e) => updateField("discountAmount", e.target.value)}
            className={inputClass}
            placeholder="Discount"
          />
        </div>
        <div>
          <label className={labelClass}>Paid Amount (BDT)</label>
          <input
            type="number"
            min="0"
            value={form.paidAmount}
            onChange={(e) => updateField("paidAmount", e.target.value)}
            className={inputClass}
            placeholder="Paid amount"
          />
        </div>
        <div>
          <label className={labelClass}>Due Amount (Calculated)</label>
          <input
            type="number"
            min="0"
            value={form.dueAmount}
            readOnly
            className={`${inputClass} bg-white/[0.03] text-neutral-400 font-semibold`}
            placeholder="Due amount"
          />
        </div>
        <div>
          <label className={labelClass}>Order Status</label>
          <select
            value={form.status}
            onChange={(e) => updateField("status", e.target.value)}
            className={inputClass}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Assigned Photographer</label>
          <input
            value={form.photographer}
            onChange={(e) => updateField("photographer", e.target.value)}
            className={inputClass}
            placeholder="Photographer name"
          />
        </div>
        <div>
          <label className={labelClass}>Event Duration</label>
          <input
            value={form.duration}
            onChange={(e) => updateField("duration", e.target.value)}
            className={inputClass}
            placeholder="Duration (e.g. 5 hours)"
          />
        </div>
      </section>
    </div>
  );
}
