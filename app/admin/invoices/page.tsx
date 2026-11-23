"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminLayout from "../../components/home/AdminLayout";
import {
  FiSearch,
  FiFilter,
  FiFileText,
  FiDollarSign,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

type InvoiceRecord = {
  _id: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  eventDate?: string;
  package?: string;
  eventProgramType?: string;
  discountAmount?: number;
  totalAmount: number;
  paidAmount?: number;
  dueAmount?: number;
};

const formatCurrency = (value: number) => `৳${value.toLocaleString("en-BD")}`;

export default function InvoicesPage() {
  const [records, setRecords] = useState<InvoiceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const router = useRouter();
  useEffect(() => {
    const loadInvoices = async () => {
      console.log("Fetching invoices from /api/event-managements");
      try {
        const response = await fetch("/api/event-managements");
        const data = await response.json();
        if (Array.isArray(data)) {
          setRecords(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadInvoices();
    const handleFocus = () => loadInvoices();
    window.addEventListener("focus", handleFocus);

    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const getInvoiceDue = (invoice: InvoiceRecord) => {
    const total = Number(invoice.totalAmount || 0);
    const discount = Number(invoice.discountAmount || 0);
    const finalAmt = Math.max(total - discount, 0);
    const paid = Number(invoice.paidAmount || 0);
    return Math.max(finalAmt - paid, 0);
  };

  const filteredInvoices = useMemo(() => {
    return records.filter((invoice) => {
      const query = `${invoice.customerName} ${invoice.package || ""} ${
        invoice.customerPhone || ""
      }`.toLowerCase();
      const matchesSearch = query.includes(searchTerm.toLowerCase());
      const due = getInvoiceDue(invoice);
      const status = due > 0 ? "Pending" : "Paid";
      const matchesStatus =
        statusFilter === "All Status" || status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const totalRevenue = records.reduce(
      (sum, invoice) => sum + (invoice.totalAmount || 0),
      0,
    );
    const paid = records.reduce(
      (sum, invoice) => sum + (invoice.paidAmount || 0),
      0,
    );
    const overdue = records.filter(
      (invoice) => getInvoiceDue(invoice) > 0,
    ).length;
    return { totalRevenue, paid, overdue, count: records.length };
  }, [records]);

  return (
    <AdminLayout>
      <div className="relative max-w-7xl mx-auto space-y-6 pb-12 text-neutral-200 p-4">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none translate-y-[-50%]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400 tracking-tight flex items-center gap-3">
              <FiFileText className="text-orange-500" /> Invoices
            </h1>
            <p className="text-sm text-neutral-400 mt-2 max-w-md leading-relaxed">
              Generate clean invoice records from live orders and download
              professional PDF copies.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Invoices",
              value: stats.count,
              icon: FiFileText,
              color: "text-orange-500",
            },
            {
              label: "Total Revenue",
              value: formatCurrency(stats.totalRevenue),
              icon: FiDollarSign,
              color: "text-white",
            },
            {
              label: "Paid",
              value: formatCurrency(stats.paid),
              icon: FiCheckCircle,
              color: "text-emerald-400",
            },
            {
              label: "Overdue",
              value: stats.overdue,
              icon: FiAlertCircle,
              color: "text-red-400",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-3 sm:p-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-2 sm:p-2.5">
                  <stat.icon className={stat.color} />
                </div>
                <div>
                  <h3 className="text-neutral-400 text-[10px] uppercase tracking-widest font-bold">
                    {stat.label}
                  </h3>
                  <p
                    className={`text-xl font-black ${
                      stat.color === "text-white"
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-300"
                        : stat.color
                    }`}
                  >
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-4 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search by client, package, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-white/10 bg-[#050505] text-white placeholder-neutral-600"
              />
            </div>
            <div className="relative w-full md:w-64">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-white/10 bg-[#050505] text-white"
              >
                <option>All Status</option>
                <option>Paid</option>
                <option>Pending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="relative z-10 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-[#050505]/80 border-b border-white/5 text-neutral-400 uppercase tracking-wider text-[11px] font-bold">
                  <th className="p-3 pl-4">Invoice</th>
                  <th className="p-3">Client</th>
                  <th className="p-3 hidden sm:table-cell">Date</th>
                  <th className="p-3 hidden md:table-cell">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredInvoices.map((invoice) => {
                  const due = getInvoiceDue(invoice);
                  const status = due > 0 ? "Pending" : "Paid";
                  return (
                    <tr
                      key={invoice._id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-3 pl-4">
                        <div className="font-bold text-white">
                          INV-{invoice._id.slice(-6).toUpperCase()}
                        </div>
                        <div className="text-xs text-neutral-500 mt-1">
                          {invoice.package || "Package"}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {invoice.discountAmount
                            ? ` - Discount ${formatCurrency(
                                invoice.discountAmount,
                              )}`
                            : ""}
                        </div>
                      </td>
                      <td className="p-3 text-neutral-300 font-medium">
                        {invoice.customerName}
                      </td>
                      <td className="p-3 text-neutral-300 hidden sm:table-cell">
                        {invoice.eventDate
                          ? new Date(invoice.eventDate).toLocaleDateString(
                              "en-BD",
                            )
                          : "—"}
                      </td>
                      <td className="p-3 font-bold text-white hidden md:table-cell">
                        {formatCurrency(invoice.totalAmount)}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-lg font-bold border inline-block ${
                            status === "Paid"
                              ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                              : "text-amber-400 bg-amber-400/10 border-amber-400/20"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="p-3 pr-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/invoices/${invoice._id}`}
                            className="p-1.5 rounded-lg border border-white/10 bg-[#050505] text-neutral-400 hover:text-orange-400"
                            title="View Invoice"
                          >
                            <FiFileText className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
