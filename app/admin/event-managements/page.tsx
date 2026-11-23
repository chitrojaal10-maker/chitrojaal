"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "../../components/home/AdminLayout";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiPrinter,
  FiDollarSign,
  FiEye,
  FiX,
} from "react-icons/fi";
import EventManagementFormFields, {
  createEmptyEventForm,
  EventManagementFormValues,
} from "./EventManagementFormFields";

type OrderRecord = EventManagementFormValues & {
  _id: string;
  dueAmount: number;
  paidAmount: number;
  totalAmount: number;
  discountAmount?: number;
  finalAmount?: number;
  status?: string;
  payments?: Array<{
    _id: string;
    amount: number;
    date: string;
    method: string;
    notes?: string;
  }>;
};

const formatMoney = (value: unknown) =>
  `৳${Number(value || 0).toLocaleString("en-BD")}`;

const mapOrderToForm = (
  order: Partial<OrderRecord>,
): EventManagementFormValues => {
  const schedule =
    order.eventSchedule && order.eventSchedule.length > 0
      ? order.eventSchedule.map((entry) => ({
          date: entry.date
            ? new Date(entry.date).toISOString().slice(0, 10)
            : "",
          shift: (entry.shift === "Night" ? "Night" : "Day") as "Day" | "Night",
          packageName: entry.packageName || "",
          amount: entry.amount ? String(entry.amount) : "",
        }))
      : [
          {
            date: order.eventDate
              ? new Date(order.eventDate).toISOString().slice(0, 10)
              : "",
            shift: "Day" as const,
            packageName: "",
            amount: "",
          },
        ];

  const totalAmount = Number(order.totalAmount || 0);
  const discountAmount = Number(order.discountAmount || 0);
  const paidAmount = Math.max(Number(order.paidAmount || 0), Number(order.advanceAmount || 0));
  const finalAmount = Math.max(totalAmount - discountAmount, 0);
  const dueAmount = Math.max(finalAmount - paidAmount, 0);

  return {
    ...createEmptyEventForm(),
    customerName: order.customerName || "",
    customerPhone: order.customerPhone || "",
    customerEmail: order.customerEmail || "",
    customerAddress: order.customerAddress || "",
    eventDate: order.eventDate
      ? new Date(order.eventDate).toISOString().slice(0, 10)
      : "",
    eventSchedule: schedule,
    eventLocation: order.eventLocation || "",
    eventName: order.eventName || "",
    eventType: order.eventType || "",
    eventProgramType:
      (order.eventProgramType as EventManagementFormValues["eventProgramType"]) ||
      "Main Program",
    otherEventName: order.otherEventName || "",
    package: order.package || "",
    packageDetails: order.packageDetails || "",
    googleMapsLink: order.googleMapsLink || "",
    notes: order.notes || "",
    totalAmount: totalAmount.toString(),
    discountAmount: discountAmount.toString(),
    advanceAmount: paidAmount.toString(),
    paidAmount: paidAmount.toString(),
    dueAmount: dueAmount.toString(),
    status: order.status || "Pending",
    photographer: order.photographer || "",
    duration: order.duration || "",
  };
};

const getStatusClass = (status: string, dueAmount: number) => {
  if (status === "Approved") return "bg-green-500/10 text-green-400";
  if (status === "Cancelled" || status === "Completed") {
    return "bg-red-500/10 text-red-400";
  }
  if (dueAmount === 0) return "bg-green-500/10 text-green-400";
  return "bg-yellow-500/10 text-yellow-400";
};

import { useMobileBackHandler } from "@/hooks/useMobileBackHandler";

export default function EventManagementsPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<OrderRecord | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<OrderRecord | null>(null);

  // Mobile Back Button Interceptor for Modals
  useMobileBackHandler({
    active: Boolean(editingOrder),
    onBack: () => setEditingOrder(null),
  });

  useMobileBackHandler({
    active: Boolean(paymentOrder),
    onBack: () => setPaymentOrder(null),
  });
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({
    amount: "",
    method: "Cash",
    notes: "",
  });
  const [form, setForm] =
    useState<EventManagementFormValues>(createEmptyEventForm);

  const [userRole, setUserRole] = useState<string | null>(null);
  const isAdmin = userRole === "admin";

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/event-managements");
      if (response.ok) {
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
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

  const openEdit = (order: OrderRecord) => {
    setEditingOrder(order);
    setForm(mapOrderToForm(order));
  };

  const handleSave = async () => {
    if (!editingOrder) return;

    const totalAmount = Number(form.totalAmount || 0);
    const discountAmount = Number(form.discountAmount || 0);
    const paidAmount = Number(form.paidAmount || 0);
    const finalAmount = Math.max(totalAmount - discountAmount, 0);
    const dueAmount = Math.max(finalAmount - paidAmount, 0);

    const response = await fetch(`/api/event-managements/${editingOrder._id}`, {
      method: "PUT",
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
      setEditingOrder(null);
      fetchOrders();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this booking?")) return;
    const response = await fetch(`/api/event-managements/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      fetchOrders();
    }
  };

  const openPayment = async (orderId: string) => {
    setPaymentLoading(true);
    setPaymentOrder(null);
    try {
      const response = await fetch(`/api/event-managements/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setPaymentOrder(data);
      }
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleSavePayment = async () => {
    if (!paymentOrder) return;
    setSavingPayment(true);
    try {
      const response = await fetch(
        `/api/event-managements/${paymentOrder._id}/payments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: paymentOrder ? Number(newPayment.amount || 0) : 0,
            method: newPayment.method,
            notes: newPayment.notes,
          }),
        },
      );

      if (response.ok) {
        setNewPayment({ amount: "", method: "Cash", notes: "" });
        await openPayment(paymentOrder._id);
        fetchOrders();
      }
    } finally {
      setSavingPayment(false);
    }
  };

  return (
    <AdminLayout>
      <div className="relative mx-auto max-w-7xl space-y-6 p-4 pb-12 text-neutral-200 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Booking Management
            </h1>
            <p className="mt-1 text-sm text-neutral-400">
              Manage bookings, discounts, schedules, and payments.
            </p>
          </div>
          {isAdmin && (
            <Link
              href="/admin/event-managements/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:from-orange-500 hover:to-orange-400"
            >
              <FiPlus /> New Booking
            </Link>
          )}
        </div>

        {/* Mobile View: Cards Layout */}
        <div className="space-y-4 sm:hidden">
          {loading ? (
            <div className="rounded-2xl border border-white/5 bg-[#0A0A0A]/80 p-6 text-center text-neutral-400">
              Loading bookings...
            </div>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl border border-white/10 bg-[#0A0A0A]/90 p-4 shadow-xl space-y-3"
              >
                <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <h3 className="font-bold text-white text-base">
                      {order.customerName}
                    </h3>
                    <p className="text-xs text-neutral-400">{order.customerPhone}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                      order.status || "Pending",
                      Number(order.dueAmount || 0),
                    )}`}
                  >
                    {order.status || "Pending"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block">
                      Event
                    </span>
                    <span className="font-medium text-neutral-200">
                      {order.eventName || order.eventType || "Event"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block">
                      Program
                    </span>
                    <span className="text-neutral-300">
                      {order.eventProgramType || "Main Program"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block">
                      Total
                    </span>
                    <span className="font-bold text-white">
                      {formatMoney(order.totalAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block">
                      Due
                    </span>
                    <span className="font-bold text-orange-400">
                      {formatMoney(order.dueAmount)}
                    </span>
                  </div>
                </div>

                {order.eventSchedule?.length ? (
                  <div className="text-xs text-neutral-400 pt-1">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block">
                      Dates
                    </span>
                    {order.eventSchedule
                      .map(
                        (entry) =>
                          `${entry.date ? new Date(entry.date).toLocaleDateString() : "N/A"} (${entry.shift})`,
                      )
                      .join(", ")}
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
                  <Link
                    href={`/admin/event-managements/${order._id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-400 transition hover:bg-orange-500/20"
                  >
                    <FiEye size={14} /> View Details
                  </Link>
                  {isAdmin && (
                    <button
                      onClick={() => openPayment(order._id)}
                      className="rounded-xl border border-white/10 bg-white/5 p-2 text-neutral-300 hover:text-white"
                      title="Manage Payments"
                    >
                      <FiDollarSign size={14} />
                    </button>
                  )}
                  <Link
                    href={`/admin/invoices/${order._id}`}
                    target="_blank"
                    className="rounded-xl border border-white/10 bg-white/5 p-2 text-neutral-300 hover:text-white"
                    title="Print Invoice"
                  >
                    <FiPrinter size={14} />
                  </Link>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => openEdit(order)}
                        className="rounded-xl border border-white/10 bg-white/5 p-2 text-neutral-300 hover:text-white"
                        title="Edit"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-300 hover:text-red-200"
                        title="Delete"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-neutral-500">
              No bookings found.
            </div>
          )}
        </div>

        {/* Desktop View: Table Layout */}
        <div className="hidden sm:block overflow-hidden rounded-[1.5rem] border border-white/5 bg-[#0A0A0A]/80 shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-white/10">
                <tr className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 sm:text-xs">
                  <th className="p-3 sm:p-4">Customer</th>
                  <th className="p-3 sm:p-4">Event</th>
                  <th className="p-3 sm:p-4 hidden sm:table-cell">Dates</th>
                  <th className="p-3 sm:p-4 hidden md:table-cell">Package</th>
                  {/* Program column removed */}
                  <th className="p-3 sm:p-4 hidden lg:table-cell">Discount</th>
                  <th className="p-3 sm:p-4 hidden xl:table-cell">Location</th>
                  <th className="p-3 sm:p-4 hidden md:table-cell">Total</th>
                  <th className="p-3 sm:p-4 hidden md:table-cell">Due</th>
                  <th className="p-3 sm:p-4">Status</th>
                  <th className="p-3 sm:p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="p-5 text-center text-neutral-500"
                    >
                      Loading bookings...
                    </td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="p-3 sm:p-4">
                        <div className="font-medium text-white">
                          {order.customerName}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {order.customerPhone}
                        </div>
                      </td>
                      <td className="p-3 sm:p-4">
                        <div className="font-medium text-neutral-200">
                          {order.eventName || order.eventType}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {order.eventProgramType || "Main Program"}
                          {order.otherEventName
                            ? ` - ${order.otherEventName}`
                            : ""}
                        </div>
                      </td>
                      <td className="hidden p-3 text-neutral-300 sm:table-cell">
                        {order.eventSchedule?.length
                          ? order.eventSchedule
                              .map(
                                (entry) =>
                                  `${
                                    entry.date
                                      ? new Date(
                                          entry.date,
                                        ).toLocaleDateString()
                                      : "N/A"
                                  } - ${entry.shift}`,
                              )
                              .join(", ")
                          : order.eventDate
                          ? new Date(order.eventDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="hidden p-3 text-neutral-300 md:table-cell">
                        {order.package}
                      </td>
                      {/* Program cell removed */}
                      <td className="hidden p-3 text-neutral-300 lg:table-cell">
                        {formatMoney(order.discountAmount)}
                      </td>
                      <td className="hidden p-3 text-neutral-300 xl:table-cell">
                        {order.googleMapsLink ? (
                          <a
                            href={order.googleMapsLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-orange-400 hover:underline"
                          >
                            Open map
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="hidden p-3 text-neutral-300 md:table-cell">
                        {formatMoney(order.totalAmount)}
                      </td>
                      <td className="hidden p-3 text-neutral-300 md:table-cell">
                        {formatMoney(order.dueAmount)}
                      </td>
                      <td className="p-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${getStatusClass(
                            order.status || "Pending",
                            Number(order.dueAmount || 0),
                          )}`}
                        >
                          {order.status || "Pending"}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/event-managements/${order._id}`}
                            className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-2 text-orange-400 hover:bg-orange-500/20 hover:text-orange-300"
                            title="View Details"
                          >
                            <FiEye size={14} />
                          </Link>
                          <Link
                            href={`/admin/invoices/${order._id}`}
                            className="rounded-lg border border-white/10 bg-white/5 p-2 text-neutral-300 hover:text-white"
                            title="Print Invoice"
                            target="_blank"
                          >
                            <FiPrinter size={14} />
                          </Link>
                          {isAdmin && (
                            <button
                              onClick={() => openPayment(order._id)}
                              className="rounded-lg border border-white/10 bg-white/5 p-2 text-neutral-300 hover:text-white"
                              title="Manage Payments"
                            >
                              <FiDollarSign size={14} />
                            </button>
                          )}
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => openEdit(order)}
                                className="rounded-lg border border-white/10 bg-white/5 p-2 text-neutral-300 hover:text-white"
                                title="Edit"
                              >
                                <FiEdit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(order._id)}
                                className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-300 hover:text-red-200"
                                title="Delete"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={11}
                      className="p-5 text-center text-neutral-500"
                    >
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editingOrder ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4">
          <div className="h-[92vh] w-full overflow-hidden rounded-t-[1.5rem] border border-white/10 bg-[#0A0A0A] sm:h-auto sm:max-w-5xl sm:rounded-[1.5rem]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Edit booking
                </h2>
                <p className="text-sm text-neutral-400">
                  Mobile-friendly form for quick updates.
                </p>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="rounded-lg border border-white/10 p-2 text-neutral-300"
              >
                <FiX />
              </button>
            </div>
            <div className="max-h-[calc(92vh-140px)] overflow-y-auto px-4 py-4 sm:px-6">
              <EventManagementFormFields form={form} setForm={setForm} />
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-white/10 px-4 py-4 sm:px-6">
              <button
                onClick={() => setEditingOrder(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-neutral-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-xl bg-orange-600 px-4 py-2 font-semibold text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {paymentOrder || paymentLoading ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4">
          <div className="w-full max-w-2xl rounded-t-[1.5rem] border border-white/10 bg-[#0A0A0A] p-4 sm:rounded-[1.5rem] sm:p-6">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {paymentLoading
                    ? "Loading payments..."
                    : `Manage payments${
                        paymentOrder
                          ? ` for ${
                              paymentOrder.eventName ||
                              paymentOrder.customerName
                            }`
                          : ""
                      }`}
                </h2>
                {!paymentLoading && paymentOrder ? (
                  <p className="text-sm text-neutral-400">
                    Due: {formatMoney(paymentOrder.dueAmount)} | Paid:{" "}
                    {formatMoney(
                      Math.max(
                        Number(paymentOrder.paidAmount || 0),
                        Number((paymentOrder as any).advanceAmount || 0),
                      ),
                    )}
                  </p>
                ) : null}
              </div>
              <button
                onClick={() => setPaymentOrder(null)}
                className="rounded-lg border border-white/10 p-2 text-neutral-300"
              >
                <FiX />
              </button>
            </div>

            {!paymentLoading && paymentOrder ? (
              <>
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={newPayment.amount}
                    onChange={(e) =>
                      setNewPayment({ ...newPayment, amount: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3 text-white"
                  />
                  <select
                    value={newPayment.method}
                    onChange={(e) =>
                      setNewPayment({ ...newPayment, method: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3 text-white"
                  >
                    <option>Cash</option>
                    <option>bKash</option>
                    <option>Nagad</option>
                    <option>Bank Transfer</option>
                    <option>Card</option>
                    <option>Other</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Notes"
                    value={newPayment.notes}
                    onChange={(e) =>
                      setNewPayment({ ...newPayment, notes: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3 text-white"
                  />
                </div>
                <button
                  onClick={handleSavePayment}
                  disabled={savingPayment}
                  className="mt-4 w-full rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
                >
                  {savingPayment ? "Saving..." : "Add Payment"}
                </button>

                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-semibold text-white">
                    Payment History
                  </h3>
                  {paymentOrder.payments && paymentOrder.payments.length > 0 ? (
                    <div className="space-y-2">
                      {paymentOrder.payments.map((payment) => (
                        <div
                          key={payment._id}
                          className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-[#050505] p-3"
                        >
                          <div>
                            <p className="text-sm text-white">
                              {new Date(payment.date).toLocaleDateString()} -{" "}
                              {payment.method}
                            </p>
                            {payment.notes ? (
                              <p className="text-xs text-neutral-400">
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
                    <p className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-neutral-400">
                      No payment transaction history recorded.
                    </p>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}
