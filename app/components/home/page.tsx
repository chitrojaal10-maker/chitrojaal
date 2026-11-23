"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  parseISO,
} from "date-fns";

const bengaliEventTypes = [
  "বিয়ে",
  "গায়ে হলুদ",
  "বৌভাত",
  "জন্মদিন",
  "অন্নপ্রাশন",
  "বিবাহবার্ষিকী",
  "কর্পোরেট ইভেন্ট",
  "অন্যান্য",
];

const Calendar = ({
  selectedDate,
  onDateChange,
}: {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between py-2">
        <button
          type="button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-full hover:bg-neutral-700"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-full hover:bg-neutral-700"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(new Date());
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center text-xs font-medium text-slate-400" key={i}>
          {format(addDays(startDate, i), "E")}
        </div>,
      );
    }
    return <div className="grid grid-cols-7 mt-2">{days}</div>;
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
        days.push(
          <div
            className={`p-2 h-12 flex items-center justify-center text-sm cursor-pointer rounded-full
              ${
                !isSameMonth(day, monthStart)
                  ? "text-neutral-600"
                  : isSameDay(day, selectedDate || new Date(0))
                    ? "bg-orange-500 text-white font-bold"
                    : "hover:bg-neutral-800"
              }`}
            key={day.toString()}
            onClick={() => onDateChange(cloneDay)}
          >
            <span>{formattedDate}</span>
          </div>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>,
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-4">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default function BookingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    eventType: bengaliEventTypes[0],
    bookingDays: 1,
    eventDate: new Date(),
    message: "",
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date) => {
    setFormData((prev) => ({ ...prev, eventDate: date }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/booking-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message:
            "আপনার বুকিং অনুরোধ সফলভাবে জমা হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
        });
        // Reset form if needed
      } else {
        throw new Error(result.message || "Something went wrong");
      }
    } catch (error: any) {
      setSubmitStatus({
        success: false,
        message:
          error.message || "একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-neutral-900 text-white min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-orange-500">
            চিত্রজাল এক্সক্লুসিভ
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mt-4 max-w-3xl mx-auto">
            আপনার বিশেষ মুহূর্তগুলোকে ফ্রেমে বন্দী করতে আমাদের প্রিমিয়াম
            প্যাকেজসমূহ নির্বাচন করুন এবং আজই আপনার ইভেন্ট বুক করুন।
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8 lg:gap-12 md:items-start">
          {/* Form Section */}
          <div className="md:col-span-3 md:sticky top-24">
            <form onSubmit={handleSubmit} className="space-y-6 h-fit">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    আপনার নাম
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-4 pr-4 py-2 rounded-lg border border-neutral-700 bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    ইমেইল
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-4 pr-4 py-2 rounded-lg border border-neutral-700 bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  ফোন নম্বর
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-4 pr-4 py-2 rounded-lg border border-neutral-700 bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  ইভেন্টের ঠিকানা
                </label>
                <textarea
                  name="location"
                  id="location"
                  rows={3}
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full pl-4 pr-4 py-2 rounded-lg border border-neutral-700 bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                ></textarea>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="eventType"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    ইভেন্টের ধরন
                  </label>
                  <select
                    name="eventType"
                    id="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-700 bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {bengaliEventTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="bookingDays"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    বুকিং এর দিন সংখ্যা
                  </label>
                  <input
                    type="number"
                    name="bookingDays"
                    id="bookingDays"
                    min="1"
                    value={formData.bookingDays}
                    onChange={handleInputChange}
                    className="w-full pl-4 pr-4 py-2 rounded-lg border border-neutral-700 bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  আপনার বার্তা (ঐচ্ছিক)
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full pl-4 pr-4 py-2 rounded-lg border border-neutral-700 bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-orange-800 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "সাবমিট হচ্ছে..." : "বুকিং অনুরোধ পাঠান"}
                </button>
              </div>

              {submitStatus && (
                <div
                  className={`p-4 rounded-lg text-center ${submitStatus.success ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"}`}
                >
                  {submitStatus.message}
                </div>
              )}
            </form>
          </div>

          {/* Calendar Section */}
          <div className="md:col-span-2">
            <div className="sticky top-24">
              <h3 className="text-xl font-semibold mb-4">
                ইভেন্টের তারিখ নির্বাচন করুন
              </h3>
              <Calendar
                selectedDate={formData.eventDate}
                onDateChange={handleDateChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
