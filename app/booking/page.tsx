"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Navbar from "../components/navbar/page";
import Footer from "../components/footer/page";

import {
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiPlus,
  FiTrash2,
  FiMapPin,
  FiUser,
  FiClock,
  FiFileText,
} from "react-icons/fi";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from "date-fns";

const bengaliEventTypes = [
  "বিয়ে (Wedding)",
  "গায়ে হলুদ (Halud)",
  "বৌভাত (Reception)",
  "জন্মদিন (Birthday)",
  "অন্নপ্রাশন",
  "বিবাহবার্ষিকী (Anniversary)",
  "কর্পোরেট ইভেন্ট (Corporate Event)",
  "অন্যান্য (Other)",
];

export type ScheduleEntry = {
  date: string;
  shift: "Day" | "Night";
  packageName?: string;
};

// Custom Premium Calendar Component
interface CalendarProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
}

const Calendar = ({ selectedDate, onDateChange }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between py-4 mb-4 border-b border-white/10">
        <button
          type="button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-orange-500/20 text-neutral-400 hover:text-orange-400 transition-all border border-transparent hover:border-orange-500/30"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-lg font-bold text-white tracking-wide">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-orange-500/20 text-neutral-400 hover:text-orange-400 transition-all border border-transparent hover:border-orange-500/30"
        >
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(new Date());
    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          className="text-center text-xs font-bold uppercase tracking-widest text-neutral-500 py-2"
          key={i}
        >
          {format(addDays(startDate, i), "E")}
        </div>,
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const isSelected = isSameDay(day, selectedDate || new Date(0));
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toString()}
            onClick={() => onDateChange(cloneDay)}
            className={`relative p-1 h-12 w-full flex items-center justify-center text-sm cursor-pointer transition-all duration-300 group`}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                !isCurrentMonth
                  ? "text-neutral-700 hover:text-neutral-400"
                  : isSelected
                  ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold shadow-[0_0_20px_rgba(234,88,12,0.4)] scale-110"
                  : "text-neutral-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {formattedDate}
            </div>
          </div>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toString()}>
          {days}
        </div>,
      );
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

function BookingPageContents() {
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    eventDate: new Date(),
    otherEventName: "",
    eventType: bengaliEventTypes[0],
    eventName: "",
    packageDetails: "",
    eventLocation: "",
    googleMapsLink: "",
    notes: "",
    eventSchedule: [
      { date: todayStr, shift: "Day" as "Day" | "Night", packageName: "" },
    ] as ScheduleEntry[],
    agreedToTerms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleDateChange = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    setFormData((prev) => {
      const nextSchedule = [...prev.eventSchedule];
      if (nextSchedule.length > 0) {
        nextSchedule[0] = { ...nextSchedule[0], date: formattedDate };
      } else {
        nextSchedule.push({ date: formattedDate, shift: "Day" });
      }
      return {
        ...prev,
        eventDate: date,
        eventSchedule: nextSchedule,
      };
    });
  };

  const updateScheduleEntry = (
    index: number,
    field: keyof ScheduleEntry,
    val: string,
  ) => {
    setFormData((prev) => {
      const next = [...prev.eventSchedule];
      next[index] = { ...next[index], [field]: val };
      return { ...prev, eventSchedule: next };
    });
  };

  const addScheduleEntry = () => {
    setFormData((prev) => ({
      ...prev,
      eventSchedule: [
        ...prev.eventSchedule,
        { date: format(prev.eventDate, "yyyy-MM-dd"), shift: "Day", packageName: "" },
      ],
    }));
  };

  const removeScheduleEntry = (index: number) => {
    setFormData((prev) => {
      const filtered = prev.eventSchedule.filter((_, i) => i !== index);
      return {
        ...prev,
        eventSchedule:
          filtered.length > 0
            ? filtered
            : [{ date: format(prev.eventDate, "yyyy-MM-dd"), shift: "Day", packageName: "" }],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.agreedToTerms) {
      setSubmitStatus({
        success: false,
        message:
          "অনুগ্রহ করে বুকিং শর্তাবলী এবং প্রাইভেসি পলিসিতে সম্মতি প্রদান করুন।",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const payload = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        customerAddress: formData.customerAddress,
        eventDate: formData.eventDate,
        otherEventName: formData.otherEventName,
        eventType: formData.eventType,
        eventName:
          formData.eventName ||
          `${formData.customerName} - ${formData.eventType}`,
        package: formData.eventSchedule[0]?.packageName || formData.eventType || "Standard Booking",
        packageDetails: formData.packageDetails,
        eventLocation: formData.eventLocation,
        googleMapsLink: formData.googleMapsLink,
        notes: formData.notes,
        eventSchedule: formData.eventSchedule.map((s) => ({
          date: s.date || format(formData.eventDate, "yyyy-MM-dd"),
          shift: s.shift,
          packageName: s.packageName || "",
        })),
        bookingSource: "Website Booking Form",
        createdFromBooking: true,
      };

      const response = await fetch("/api/booking-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message:
            "আপনার বুকিং অনুরোধ সফলভাবে জমা হয়েছে! আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।",
        });
      } else {
        throw new Error(result.message || "Something went wrong");
      }
    } catch (error) {
      let message = "একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
      if (error instanceof Error) {
        message = error.message;
      }
      setSubmitStatus({
        success: false,
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelStyle =
    "text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2 block";
  const inputStyle =
    "w-full px-5 py-4 rounded-xl border border-white/10 bg-[#050505] text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner";

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-7xl relative z-10">
      {/* Header Section */}
      <div className="text-center mb-14">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-orange-200 to-orange-600 mb-4 drop-shadow-lg tracking-tight">
          ইভেন্ট বুকিং ফরম
        </h1>
        <p className="text-neutral-400 text-base md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
          আপনার বিশেষ দিনের ছবি ও ভিডিওগ্রাফি বুকিং করতে নিচের তথ্যগুলো দিয়ে
          ফরমটি পূরণ করুন।
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Calendar Section */}
        <div className="lg:col-span-5 order-first lg:order-last">
          <div className="sticky top-28 space-y-6">
            <div className="flex items-center gap-3 text-white">
              <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                <FiCalendar className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold">তারিখ নির্বাচন করুন</h3>
                <p className="text-sm text-neutral-400">
                  ক্যালেন্ডার থেকে আপনার ইভেন্টের প্রধান তারিখ নির্বাচন করুন
                </p>
              </div>
            </div>
            <Calendar
              selectedDate={formData.eventDate}
              onDateChange={handleDateChange}
            />
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-7 bg-[#0A0A0A]/70 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative">
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none"></div>

          <form onSubmit={handleSubmit} className="relative space-y-8">
            {/* Section 1: Personal Details */}
            <div className="space-y-4 border-b border-white/10 pb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FiUser className="text-orange-500" /> ক্লায়েন্ট তথ্য (Customer
                Info)
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>
                    আপনার নাম (Customer Name) *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className={inputStyle}
                    placeholder="আপনার পূর্ণ নাম"
                  />
                </div>
                <div>
                  <label className={labelStyle}>
                    ফোন নম্বর (Phone Number) *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    required
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className={inputStyle}
                    placeholder="+880 1XXX XXXXXX"
                  />
                </div>
                <div>
                  <label className={labelStyle}>ইমেইল (Email Address)</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className={inputStyle}
                    placeholder="example@mail.com"
                  />
                </div>
                <div>
                  <label className={labelStyle}>ঠিকানা (Address)</label>
                  <input
                    type="text"
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                    className={inputStyle}
                    placeholder="আপনার বর্তমান বা স্থায়ী ঠিকানা"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Event Details */}
            <div className="space-y-4 border-b border-white/10 pb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FiClock className="text-orange-500" /> ইভেন্ট সংক্রান্ত বিবরণ
                (Event Details)
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>
                    প্রধান তারিখ (Main Event Date)
                  </label>
                  <input
                    type="date"
                    value={format(formData.eventDate, "yyyy-MM-dd")}
                    onChange={(e) => {
                      if (e.target.value) {
                        handleDateChange(new Date(e.target.value));
                      }
                    }}
                    className={inputStyle}
                  />
                </div>
                {/* Removed Main Event Shift and Program Type inputs per request */}
                <div>
                  <label className={labelStyle}>
                    ইভেন্টের ধরন (Event Type)
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className={inputStyle}
                  >
                    <option value="" disabled className="bg-[#0A0A0A] text-neutral-500">
                      Wedding, Birthday, Corporate
                    </option>
                    {bengaliEventTypes.map((type) => (
                      <option key={type} value={type} className="bg-[#0A0A0A]">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>
                    ইভেন্ট শিরোনাম (Event Title)
                  </label>
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleInputChange}
                    className={inputStyle}
                    placeholder="যেমন: সুপ্ত ও তানিয়ার শুভ বিবাহ"
                  />
                </div>
              </div>
            </div>

            {/* Multi-day Event Schedule */}
            <div className="space-y-4 border-b border-white/10 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FiCalendar className="text-orange-500" /> ইভেন্ট শিডিউল ও
                    সময়সূচী
                  </h3>
                  <p className="text-xs text-neutral-400">
                    একাধিক দিনের ইভেন্ট হলে নিচের বোতাম চেপে অতিরিক্ত তারিখ যোগ
                    করুন।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addScheduleEntry}
                  className="inline-flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 transition-all"
                >
                  <FiPlus /> তারিখ যোগ করুন
                </button>
              </div>

              <div className="space-y-3">
                {formData.eventSchedule.map((entry, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-[minmax(0,1.2fr)_130px_minmax(0,1.5fr)_auto] gap-3 items-end bg-white/[0.02] border border-white/5 rounded-2xl p-3"
                  >
                    <div>
                      <label className="text-[10px] uppercase text-neutral-500 font-semibold mb-1 block">
                        তারিখ #{index + 1}
                      </label>
                      <input
                        type="date"
                        value={entry.date}
                        onChange={(e) =>
                          updateScheduleEntry(index, "date", e.target.value)
                        }
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-neutral-500 font-semibold mb-1 block">
                        শিফট #{index + 1}
                      </label>
                      <select
                        value={entry.shift}
                        onChange={(e) =>
                          updateScheduleEntry(index, "shift", e.target.value)
                        }
                        className={inputStyle}
                      >
                        <option value="Day">Day Shift</option>
                        <option value="Night">Night Shift</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-neutral-500 font-semibold mb-1 block">
                        প্যাকেজের নাম (Package Name) #{index + 1}
                      </label>
                      <input
                        type="text"
                        value={entry.packageName || ""}
                        onChange={(e) =>
                          updateScheduleEntry(index, "packageName", e.target.value)
                        }
                        className={inputStyle}
                        placeholder="যেমন: গোল্ড প্যাকেজ, সিলভার প্যাকেজ"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeScheduleEntry(index)}
                      className="px-4 py-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-semibold transition-all"
                      title="Remove"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Location Details */}
            <div className="space-y-4 border-b border-white/10 pb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FiMapPin className="text-orange-500" /> অবস্থান সংক্রান্ত তথ্য
                (Location Details)
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>
                    ভেন্যু / স্থান (Event Location) *
                  </label>
                  <input
                    type="text"
                    name="eventLocation"
                    required
                    value={formData.eventLocation}
                    onChange={handleInputChange}
                    className={inputStyle}
                    placeholder="যেমন: গ্র্যান্ড কমিউনিটি সেন্টার, ফেনী"
                  />
                </div>
                <div>
                  <label className={labelStyle}>
                    গুগল ম্যাপস লিংক (Google Maps Link)
                  </label>
                  <input
                    type="url"
                    name="googleMapsLink"
                    value={formData.googleMapsLink}
                    onChange={handleInputChange}
                    className={inputStyle}
                    placeholder="https://maps.google.com/..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelStyle}>
                    বিশেষ চাহিদা বা সার্ভিস বিবরণ (Service Details)
                  </label>
                  <textarea
                    name="packageDetails"
                    rows={3}
                    value={formData.packageDetails}
                    onChange={handleInputChange}
                    className={inputStyle}
                    placeholder="ছবি/ভিডিওগ্রাফি সংক্রান্ত কোনো বিশেষ সুবিধা বা প্রয়োজনীয় সার্ভিস লিখে জানান..."
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Special Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FiFileText className="text-orange-500" /> অতিরিক্ত নির্দেশনা
                (Special Notes)
              </h3>
              <div>
                <label className={labelStyle}>
                  অন্যান্য মন্তব্য বা বিশেষ বার্তা
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  className={inputStyle}
                  placeholder="কোনো বিশেষ অনুরোধ বা মন্তব্য থাকলে এখানে লিখুন..."
                />
              </div>
            </div>

            {/* Terms Agreement Checkbox */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  id="agreedToTerms"
                  name="agreedToTerms"
                  type="checkbox"
                  required
                  checked={formData.agreedToTerms}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border border-white/20 bg-[#050505] text-orange-500 focus:ring-orange-500 focus:ring-offset-0 cursor-pointer accent-orange-500"
                />
              </div>
              <div className="text-sm text-neutral-400 leading-tight">
                <label htmlFor="agreedToTerms" className="cursor-pointer">
                  আমি চিত্রজাল-এর{" "}
                  <Link
                    href="/condition"
                    target="_blank"
                    className="text-orange-400 hover:text-orange-300 transition-colors underline underline-offset-2"
                  >
                    বুকিং শর্তাবলী
                  </Link>{" "}
                  এবং{" "}
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="text-orange-400 hover:text-orange-300 transition-colors underline underline-offset-2"
                  >
                    প্রাইভেসি পলিসি
                  </Link>{" "}
                  পড়েছি এবং সম্মতি প্রদান করছি।
                </label>
              </div>
            </div>

            {/* Status Message Display */}
            {submitStatus && (
              <div
                className={`flex items-center gap-3 p-4 rounded-xl border ${
                  submitStatus.success
                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
              >
                {submitStatus.success ? (
                  <FiCheckCircle className="w-6 h-6 shrink-0" />
                ) : (
                  <FiAlertCircle className="w-6 h-6 shrink-0" />
                )}
                <p className="text-sm font-medium">{submitStatus.message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.agreedToTerms}
              className="w-full relative overflow-hidden font-bold text-lg py-5 rounded-xl transition-all duration-300 transform active:scale-[0.98] group bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] border-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    বুকিং প্রসেস হচ্ছে...
                  </>
                ) : (
                  "বুকিং অনুরোধ জমা দিন"
                )}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-neutral-200 font-sans selection:bg-orange-500/30">
      <Navbar />

      <main className="flex-1 relative overflow-hidden py-16 md:py-24">
        {/* Ambient Studio Lighting Background */}
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none"></div>

        <Suspense
          fallback={
            <div className="text-center text-neutral-400 py-12">
              লোড হচ্ছে...
            </div>
          }
        >
          <BookingPageContents />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
