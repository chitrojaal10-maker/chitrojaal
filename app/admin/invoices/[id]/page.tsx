"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "../../../components/home/AdminLayout";
import {
  FiArrowLeft,
  FiDownload,
  FiFileText,
  FiExternalLink,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiCalendar,
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiEye,
  FiLayers,
} from "react-icons/fi";
import Image from "next/image";
import logo from "../../../components/navbar/logo.png";

type Payment = {
  _id?: string;
  amount: number;
  date?: string;
  method?: string;
  notes?: string;
};

type ScheduleItem = {
  date: string;
  shift: "Day" | "Night";
};

type InvoiceOrder = {
  _id: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  eventDate?: string;
  eventSchedule?: ScheduleItem[];
  eventLocation?: string;
  eventName?: string;
  eventType?: string;
  eventProgramType?: string;
  otherEventName?: string;
  package?: string;
  packageDetails?: string;
  googleMapsLink?: string;
  notes?: string;
  totalAmount?: number;
  discountAmount?: number;
  advanceAmount?: number;
  paidAmount?: number;
  dueAmount?: number;
  finalAmount?: number;
  status?: string;
  photographer?: string;
  duration?: string;
  bookingSource?: string;
  payments?: Payment[];
  createdAt?: string;
};

const formatBDT = (amount?: number) =>
  `৳${Number(amount || 0).toLocaleString("en-BD")}`;

const formatDate = (value?: string) => {
  if (!value) return "N/A";
  try {
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return value;
  }
};

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<InvoiceOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [viewMode, setViewMode] = useState<"digital" | "pdf">("digital");
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    async function fetchOrder() {
      setLoading(true);
      try {
        const response = await fetch(`/api/event-managements/${id}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        }
      } catch (err) {
        console.error("Failed to fetch booking invoice:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  const getInvoicePdfUrl = (download: boolean = false) => {
    if (!order?._id) return "";
    return `/api/invoices/${order._id}${download ? "?download=1" : ""}`;
  };

  const handleDownloadPDF = async () => {
    if (!order?._id) return;
    setDownloading(true);

    const pdfUrl = getInvoicePdfUrl(true);

    try {
      const isMobile =
        typeof window !== "undefined" &&
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        window.open(pdfUrl, "_blank", "noopener,noreferrer");
        return;
      }

      const response = await fetch(pdfUrl, { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${order._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download error:", error);
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  };

  const handleOpenPdf = () => {
    const url = getInvoicePdfUrl(false);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handlePrint = () => {
    const url = getInvoicePdfUrl(false);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      window.print();
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          <p className="text-sm font-medium text-neutral-400">
            ইনভয়েস তথ্য লোড হচ্ছে...
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="mx-auto max-w-lg py-20 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
            <FiFileText size={32} />
          </div>
          <h2 className="text-xl font-bold text-white">ইনভয়েস পাওয়া যায়নি</h2>
          <p className="mt-2 text-sm text-neutral-400">
            কাঙ্ক্ষিত বুকিং আইডি সংক্রান্ত কোনো তথ্য সিস্টেমে খুঁজে পাওয়া যায়নি।
          </p>
          <button
            onClick={() => router.push("/admin/invoices")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-500"
          >
            <FiArrowLeft size={16} /> ইনভয়েস তালিকায় ফিরে যান
          </button>
        </div>
      </AdminLayout>
    );
  }

  const invoiceId = `INV-${String(order._id).slice(-8).toUpperCase()}`;
  const totalAmount = Number(order.totalAmount || 0);
  const discountAmount = Number(order.discountAmount || 0);
  const finalPayable = Math.max(totalAmount - discountAmount, 0);
  const paymentsSum = Array.isArray(order.payments)
    ? order.payments.reduce((sum, p: any) => sum + Number(p?.amount || 0), 0)
    : 0;
  const paidAmount = Math.max(
    Number(order.paidAmount || 0),
    Number(order.advanceAmount || 0),
    paymentsSum,
  );
  const dueAmount = Math.max(finalPayable - paidAmount, 0);
  const isPaidInFull = dueAmount <= 0;

  return (
    <AdminLayout>
      <div className="mx-auto max-w-5xl px-3 py-4 sm:px-6 lg:py-6">
        {/* Top Header & Quick Action Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() => router.push("/admin/invoices")}
              className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 transition hover:text-orange-400"
            >
              <FiArrowLeft size={14} /> সকল ইনভয়েস তালিকা
            </button>
            <div className="mt-1 flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
                Invoice Details
              </h1>
              <span className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 font-mono text-xs font-bold text-orange-400">
                {invoiceId}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle (Desktop only) */}
            <div className="hidden rounded-xl border border-white/10 bg-[#0c1017] p-1 sm:inline-flex">
              <button
                onClick={() => setViewMode("digital")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  viewMode === "digital"
                    ? "bg-orange-600 text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <FiFileText size={14} />
                <span>Digital View</span>
              </button>
              <button
                onClick={() => setViewMode("pdf")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  viewMode === "pdf"
                    ? "bg-orange-600 text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <FiEye size={14} />
                <span>PDF Preview</span>
              </button>
            </div>

            <button
              onClick={handleOpenPdf}
              className="inline-flex items-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3.5 py-2.5 text-xs font-bold text-orange-400 transition hover:bg-orange-500/20 active:scale-95"
            >
              <FiExternalLink size={14} />
              <span>Open PDF</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition hover:from-orange-500 hover:to-orange-400 active:scale-95 disabled:opacity-50"
            >
              <FiDownload
                className={downloading ? "animate-bounce" : ""}
                size={15}
              />
              <span>{downloading ? "Generating..." : "Download PDF"}</span>
            </button>
          </div>
        </div>

        {/* Conditional Desktop PDF View */}
        {viewMode === "pdf" ? (
          <div className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0c1017] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 bg-[#141a24] px-5 py-3">
              <div className="flex items-center gap-2">
                <FiFileText className="text-orange-400" size={16} />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Backend PDF Stream Preview
                </span>
              </div>
              <button
                onClick={handleDownloadPDF}
                className="text-xs font-semibold text-orange-400 hover:underline"
              >
                Download Official PDF
              </button>
            </div>
            <iframe
              src={getInvoicePdfUrl(false)}
              className="h-[80vh] w-full bg-white"
              title="Official PDF Invoice"
            />
          </div>
        ) : null}

        {/* NATIVE HIGH-VISIBILITY DIGITAL INVOICE CARD (Works 100% on All Mobile Devices & Browsers) */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c1017] p-5 shadow-2xl sm:p-8">
          {/* Subtle Ambient Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-600/10 blur-3xl" />

          {/* Invoice Header */}
          <div className="flex flex-col gap-6 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#141a24] p-2">
                <Image
                  src={logo}
                  alt="ChitroJaal Logo"
                  width={56}
                  height={56}
                  className="h-full w-full object-contain"
                  priority
                />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-orange-400">
                  ChitroJaal Studio & Events
                </p>
                <h2 className="text-xl font-extrabold text-white sm:text-2xl">
                  Official Client Invoice
                </h2>
                <p className="mt-0.5 text-xs text-neutral-400">
                  Creative Photography & Cinematography Production
                </p>
              </div>
            </div>

            {/* Status & ID Badge */}
            <div className="flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Invoice Number
                </span>
                <p className="font-mono text-base font-black text-white sm:text-lg">
                  {invoiceId}
                </p>
              </div>

              {isPaidInFull ? (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <FiCheckCircle size={14} />
                  <span>PAID IN FULL</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-amber-300">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                  <FiClock size={14} />
                  <span>DUE: {formatBDT(dueAmount)}</span>
                </div>
              )}
            </div>
          </div>

          {/* 2-Column Info Grid */}
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Bill To Card */}
            <div className="rounded-xl border border-white/10 bg-[#141a24] p-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                <FiUser size={14} />
                <span>Billed To (Client Details)</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {order.customerName || "N/A"}
              </h3>

              <div className="mt-3 space-y-2 text-xs text-neutral-300">
                <div className="flex items-center gap-2.5">
                  <FiPhone className="text-neutral-400 shrink-0" size={14} />
                  <span className="font-mono font-medium text-white">
                    {order.customerPhone || "N/A"}
                  </span>
                </div>
                {order.customerEmail && (
                  <div className="flex items-center gap-2.5">
                    <FiMail className="text-neutral-400 shrink-0" size={14} />
                    <span>{order.customerEmail}</span>
                  </div>
                )}
                {order.customerAddress && (
                  <div className="flex items-start gap-2.5">
                    <FiMapPin className="mt-0.5 text-neutral-400 shrink-0" size={14} />
                    <span className="leading-relaxed">
                      {order.customerAddress}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Event & Shoot Overview */}
            <div className="rounded-xl border border-white/10 bg-[#141a24] p-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                <FiCalendar size={14} />
                <span>Event & Schedule Info</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-neutral-400">Event Name:</span>
                  <span className="font-bold text-white">
                    {order.eventName || "Photo & Video Production"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-neutral-400">Event Type:</span>
                  <span className="font-semibold text-neutral-200">
                    {order.eventType || "Standard Event"}
                    {order.eventProgramType ? ` (${order.eventProgramType})` : ""}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-neutral-400">Selected Package:</span>
                  <span className="rounded bg-orange-500/20 px-2 py-0.5 font-bold text-orange-300">
                    {order.package || "Custom Package"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Main Event Date:</span>
                  <span className="font-bold text-white">
                    {formatDate(order.eventDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Shift Schedules (If multi-day or custom shifts) */}
          {order.eventSchedule && order.eventSchedule.length > 0 && (
            <div className="mt-6 rounded-xl border border-white/10 bg-[#141a24] p-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                <FiLayers size={14} />
                <span>Assigned Event Shift Timeline</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {order.eventSchedule.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-[#0c1017] px-3.5 py-2.5 text-xs"
                  >
                    <span className="font-medium text-white">
                      {formatDate(item.date)}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[11px] font-bold ${
                        item.shift === "Day"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-indigo-500/20 text-indigo-300"
                      }`}
                    >
                      {item.shift} Shift
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Package Details Description (if available) */}
          {order.packageDetails && (
            <div className="mt-6 rounded-xl border border-white/10 bg-[#141a24] p-5">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                Package Deliverables & Description
              </div>
              <p className="text-xs text-neutral-200 leading-relaxed whitespace-pre-line">
                {order.packageDetails}
              </p>
            </div>
          )}

          {/* Financial Breakdown Summary Table */}
          <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-[#141a24]">
            <div className="border-b border-white/10 bg-[#1a2230] px-5 py-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Financial Statement & Balance
              </h4>
            </div>

            <div className="divide-y divide-white/5 text-xs sm:text-sm">
              <div className="flex items-center justify-between px-5 py-3 text-neutral-300">
                <span>Total Contract / Package Fee:</span>
                <span className="font-mono font-bold text-white">
                  {formatBDT(totalAmount)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between px-5 py-3 text-emerald-400">
                  <span>Special Discount Applied:</span>
                  <span className="font-mono font-bold">
                    - {formatBDT(discountAmount)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between bg-white/[0.02] px-5 py-3.5 font-bold text-white">
                <span>Net Payable Amount:</span>
                <span className="font-mono text-base font-extrabold text-orange-400">
                  {formatBDT(finalPayable)}
                </span>
              </div>

              <div className="flex items-center justify-between px-5 py-3 text-neutral-300">
                <span>Total Amount Paid:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {formatBDT(paidAmount)}
                </span>
              </div>

              <div className="flex items-center justify-between bg-white/[0.04] px-5 py-4">
                <span className="font-bold text-white">Remaining Balance Due:</span>
                <span
                  className={`font-mono text-lg font-black ${
                    isPaidInFull ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {formatBDT(dueAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Transactions History */}
          {order.payments && order.payments.length > 0 && (
            <div className="mt-6 rounded-xl border border-white/10 bg-[#141a24] p-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                <FiDollarSign size={14} />
                <span>Recorded Payment Transactions</span>
              </div>

              <div className="divide-y divide-white/5">
                {order.payments.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-xs first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[11px] font-bold text-neutral-300">
                        {p.method || "Cash"}
                      </span>
                      <span className="text-neutral-400">
                        {formatDate(p.date)}
                      </span>
                      {p.notes && (
                        <span className="text-neutral-400 italic">
                          ({p.notes})
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-bold text-emerald-400">
                      + {formatBDT(p.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invoice Footer Actions */}
          <div className="mt-8 flex items-center justify-end border-t border-white/10 pt-6">
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-2 rounded-lg border border-orange-500/30 bg-orange-500/10 px-4 py-2 font-bold text-orange-400 transition hover:bg-orange-500/20"
            >
              <FiDownload size={14} />
              <span>Download Official PDF Copy</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
