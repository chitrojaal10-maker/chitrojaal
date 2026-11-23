"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminLayout from "../../../components/home/AdminLayout";
import { FiArrowLeft, FiDownload, FiDollarSign, FiX } from "react-icons/fi";

type Payment = {
  _id: string;
  amount: number;
  date: string;
  method: string;
  notes?: string;
};

type ScheduleItem = {
  date: string;
  shift: "Day" | "Night";
};

type Order = {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  eventDate: string;
  eventSchedule?: ScheduleItem[];
  eventLocation: string;
  eventName: string;
  eventType: string;
  eventProgramType?: string;
  otherEventName?: string;
  package: string;
  packageDetails: string;
  googleMapsLink: string;
  notes: string;
  totalAmount: number;
  discountAmount?: number;
  advanceAmount: number;
  paidAmount: number;
  dueAmount: number;
  finalAmount?: number;
  status: string;
  photographer: string;
  duration: string;
  bookingSource: string;
  payments: Payment[];
};

const formatMoney = (value: unknown) =>
  `৳${Number(value || 0).toLocaleString("en-BD")}`;

const formatDate = (value: string | undefined) =>
  value ? new Date(value).toLocaleDateString("en-BD") : "N/A";

export default function EventManagementDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const isAdmin = userRole === "admin";

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUserRole(data.user?.accessRole || null);
        }
      } catch (err) {
        console.error("Failed to fetch user role:", err);
      }
    }
    fetchUserRole();
  }, []);

  async function fetchOrder() {
    if (!id) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/event-managements/${id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        setError("Booking not found.");
      }
    } catch (err) {
      setError("Failed to fetch booking details.");
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleDownloadInvoice = async () => {
    if (!order) return;
    const response = await fetch(`/api/invoices/${order._id}`);
    if (!response.ok) {
      console.error("Failed to download invoice");
      return;
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${order._id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const DetailItem = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <dt className="text-xs uppercase tracking-[0.18em] text-neutral-400">
        {label}
      </dt>
      <dd className="mt-2 text-sm text-neutral-100">{value ?? "N/A"}</dd>
    </div>
  );

  return (
    <AdminLayout>
      <div className="mx-auto max-w-6xl space-y-6 p-4 pb-12 text-neutral-200 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Booking Details</h1>
            <Link
              href="/admin/event-managements"
              className="mt-2 inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-orange-400"
            >
              <FiArrowLeft /> Back to List
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadInvoice}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <FiDownload /> Invoice
            </button>
            {isAdmin && (
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-orange-500 hover:to-orange-400"
              >
                <FiDollarSign /> Add Payment
              </button>
            )}
          </div>
        </div>

        {loading && (
          <p className="text-neutral-400">Loading booking details...</p>
        )}
        {error && <p className="text-sm text-red-400">{error}</p>}

        {order ? (
          <>
            <section className="rounded-[1.5rem] border border-white/5 bg-[#0A0A0A]/80 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
              <div className="mb-5">
                <h2 className="mt-2 text-2xl font-bold text-white">
                  {order.eventName}
                </h2>
                <p className="mt-1 text-sm text-neutral-400">
                  Details for booking #{order._id.substring(0, 7)}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DetailItem label="Customer Name" value={order.customerName} />
                <DetailItem
                  label="Customer Phone"
                  value={order.customerPhone}
                />
                <DetailItem
                  label="Customer Email"
                  value={order.customerEmail}
                />
                <DetailItem
                  label="Customer Address"
                  value={order.customerAddress}
                />
                <DetailItem
                  label="Main Event Date"
                  value={formatDate(order.eventDate)}
                />
                <DetailItem
                  label="Schedule"
                  value={
                    order.eventSchedule && order.eventSchedule.length > 0
                      ? order.eventSchedule
                          .map(
                            (item) =>
                              `${formatDate(item.date)} - ${item.shift} shift`,
                          )
                          .join(", ")
                      : "N/A"
                  }
                />
                <DetailItem
                  label="Event Location"
                  value={order.eventLocation}
                />
                <DetailItem label="Event Type" value={order.eventType} />
                <DetailItem label="Status" value={order.status} />
                <DetailItem label="Package" value={order.package} />
                <DetailItem
                  label="Package Details"
                  value={order.packageDetails}
                />
                <DetailItem label="Photographer" value={order.photographer} />
                <DetailItem label="Duration" value={order.duration} />
                <DetailItem
                  label="Google Maps"
                  value={
                    order.googleMapsLink ? (
                      <a
                        href={order.googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:underline"
                      >
                        Open map
                      </a>
                    ) : (
                      "N/A"
                    )
                  }
                />
              </div>

              {order.notes ? (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                    Notes
                  </p>
                  <p className="mt-2 text-sm text-neutral-100">{order.notes}</p>
                </div>
              ) : null}

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <DetailItem
                  label="Total Amount"
                  value={formatMoney(order.totalAmount)}
                />
                <DetailItem
                  label="Discount"
                  value={formatMoney(order.discountAmount)}
                />
                <DetailItem
                  label="Final Amount"
                  value={formatMoney(
                    order.finalAmount ??
                      order.totalAmount - Number(order.discountAmount || 0),
                  )}
                />
                <DetailItem
                  label="Paid Amount"
                  value={formatMoney(
                    Math.max(
                      Number(order.paidAmount || 0),
                      Number(order.advanceAmount || 0),
                    ),
                  )}
                />
                <DetailItem
                  label="Due Amount"
                  value={formatMoney(order.dueAmount)}
                />
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-white/5 bg-[#0A0A0A]/80 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">
                Payment History
              </h3>
              {order.payments && order.payments.length > 0 ? (
                <div className="space-y-3">
                  {order.payments.map((payment) => (
                    <div
                      key={payment._id}
                      className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div>
                        <p className="text-sm text-white">
                          {formatDate(payment.date)} - {payment.method}
                        </p>
                        {payment.notes ? (
                          <p className="mt-1 text-xs text-neutral-400">
                            {payment.notes}
                          </p>
                        ) : null}
                      </div>
                      <p className="text-sm font-semibold text-emerald-400">
                        {formatMoney(payment.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-neutral-400">
                  No payment transactions recorded yet.
                </p>
              )}
            </section>
          </>
        ) : null}
      </div>

      {isAdmin && isPaymentModalOpen && order ? (
        <AddPaymentModal
          orderId={order._id}
          onClose={() => setPaymentModalOpen(false)}
          onSuccess={() => {
            setPaymentModalOpen(false);
            fetchOrder();
          }}
        />
      ) : null}
    </AdminLayout>
  );
}

function AddPaymentModal({
  orderId,
  onClose,
  onSuccess,
}: {
  orderId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      const response = await fetch(
        `/api/event-managements/${orderId}/payments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Number(amount),
            method,
            notes,
          }),
        },
      );

      if (response.ok) {
        onSuccess();
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save payment.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-md rounded-t-[1.5rem] border border-white/10 bg-[#0A0A0A] p-4 sm:rounded-[1.5rem] sm:p-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-xl font-semibold text-white">Add Payment</h2>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 p-2 text-neutral-300"
          >
            <FiX />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3 text-white"
            disabled={isSaving}
          />
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3 text-white"
            disabled={isSaving}
          >
            <option>Cash</option>
            <option>bKash</option>
            <option>Nagad</option>
            <option>Bank Transfer</option>
            <option>Card</option>
            <option>Other</option>
          </select>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes"
            className="min-h-[90px] w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3 text-white"
            disabled={isSaving}
          />
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-neutral-300"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-xl bg-orange-600 px-4 py-2 font-semibold text-white disabled:bg-neutral-600"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
