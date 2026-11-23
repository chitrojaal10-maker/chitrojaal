"use client";

import React, { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AdminLayout from "../../components/home/AdminLayout";
import {
  FiDollarSign,
  FiEdit2,
  FiDownload,
  FiPlus,
  FiTrash2,
  FiRefreshCw,
  FiTrendingDown,
  FiTrendingUp,
  FiCheck,
  FiX,
  FiFileText,
  FiCalendar,
} from "react-icons/fi";

type ExpenseItem = {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  vendor?: string;
  notes?: string;
};

type FinanceSummary = {
  income: number;
  expenditure: number;
  outstanding: number;
  expenses: ExpenseItem[];
  orders: Array<{
    _id: string;
    customerName: string;
    package: string;
    dueAmount: number;
    totalAmount: number;
  }>;
};

const formatCurrency = (value: number) =>
  `BDT ${value ? value.toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}`;

export default function FinancePage() {
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState("");
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(
    null,
  );
  const [form, setForm] = useState({
    title: "",
    category: "Operations",
    amount: "",
    vendor: "",
    notes: "",
  });
  const [userRole, setUserRole] = useState<string | null>(null);
  const isAdmin = userRole === "admin";

  useEffect(() => {
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

  const loadSummary = async (selectedMonth = month) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/finance?month=${selectedMonth}`);
      const result = await response.json();
      if (response.ok) {
        setSummary(result.data);
      }
    } catch (error) {
      console.error("Error loading financial data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/finance", {
        method: editingExpense ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editingExpense ? { _id: editingExpense._id } : {}),
          ...form,
          amount: Number(form.amount),
        }),
      });
      if (response.ok) {
        setForm({
          title: "",
          category: "Operations",
          amount: "",
          vendor: "",
          notes: "",
        });
        setEditingExpense(null);
        loadSummary();
      }
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  const handleEdit = (expense: ExpenseItem) => {
    setEditingExpense(expense);
    setForm({
      title: expense.title,
      category: expense.category || "Operations",
      amount: expense.amount?.toString() || "",
      vendor: expense.vendor || "",
      notes: expense.notes || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
    setForm({
      title: "",
      category: "Operations",
      amount: "",
      vendor: "",
      notes: "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this expense record?"))
      return;
    try {
      const response = await fetch(`/api/admin/finance/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        loadSummary();
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const balance = useMemo(
    () => (summary ? summary.income - summary.expenditure : 0),
    [summary],
  );

  // -------------------------------------------------------------
  // PDF REPORT GENERATOR WITH CEO SIGNATURE & DEVELOPER FOOTER
  // -------------------------------------------------------------
  const handleDownloadPDF = () => {
    if (!summary) return;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 36;

    const brandColor = "#EA580C";
    const darkText = "#0F172A";
    const bodyText = "#334155";
    const mutedText = "#64748B";
    const borderFill = "#E2E8F0";

    const monthName = month
      ? new Date(month + "-02").toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        })
      : new Date().toLocaleString("en-US", { month: "long", year: "numeric" });

    // Helper: Add Text
    const addText = (
      text: string,
      x: number,
      y: number,
      opts: {
        fontSize?: number;
        color?: string;
        weight?: "normal" | "bold";
        align?: "left" | "center" | "right";
      } = {},
    ) => {
      doc.setFont("helvetica", opts.weight || "normal");
      doc.setFontSize(opts.fontSize || 9);
      doc.setTextColor(opts.color || darkText);
      doc.text(text, x, y, { align: opts.align || "left" });
    };

    // 1. Header
    addText("CHITROJAAL", margin, margin + 22, {
      fontSize: 24,
      color: brandColor,
      weight: "bold",
    });
    addText(
      "Juma Market, Mizan Road, Feni 3900, Bangladesh",
      margin,
      margin + 40,
      {
        fontSize: 8.5,
        color: mutedText,
      },
    );
    addText(
      "Phone: +880 1834-258375 | Web: www.chitrojaal.com",
      margin,
      margin + 52,
      {
        fontSize: 8.5,
        color: mutedText,
      },
    );

    addText("FINANCIAL STATEMENT", pageWidth - margin, margin + 20, {
      fontSize: 18,
      color: darkText,
      weight: "bold",
      align: "right",
    });
    addText(`Period: ${monthName}`, pageWidth - margin, margin + 36, {
      fontSize: 9,
      color: bodyText,
      weight: "bold",
      align: "right",
    });
    addText(
      `Generated: ${new Date().toLocaleDateString("en-BD")}`,
      pageWidth - margin,
      margin + 50,
      { fontSize: 8, color: mutedText, align: "right" },
    );

    // Divider Line
    doc.setDrawColor(brandColor);
    doc.setLineWidth(1.5);
    doc.line(margin, margin + 65, pageWidth - margin, margin + 65);

    // 2. Metric Summary Table
    autoTable(doc, {
      startY: margin + 80,
      margin: { left: margin, right: margin },
      head: [["Financial Metric", "Amount (BDT)"]],
      body: [
        ["Total Revenue / Income", formatCurrency(summary.income)],
        ["Total Operational Expenditure", formatCurrency(summary.expenditure)],
        ["Net Cash Flow / Balance", formatCurrency(balance)],
        ["Outstanding Revenue Due", formatCurrency(summary.outstanding || 0)],
      ],
      styles: { font: "helvetica", fontSize: 9, cellPadding: 6 },
      headStyles: { fillColor: [234, 88, 12], textColor: [255, 255, 255] },
      theme: "grid",
    });

    // @ts-expect-error finalY set by autoTable
    let lastY = doc.lastAutoTable.finalY || margin + 180;

    // 3. Itemized Expenditures Table
    if (summary.expenses.length > 0) {
      addText("ITEMIZED EXPENDITURE BREAKDOWN", margin, lastY + 24, {
        fontSize: 11,
        color: brandColor,
        weight: "bold",
      });

      autoTable(doc, {
        startY: lastY + 32,
        margin: { left: margin, right: margin },
        head: [["Date", "Expense Title", "Category", "Vendor", "Amount"]],
        body: summary.expenses.map((exp) => [
          new Date(exp.date).toLocaleDateString("en-BD"),
          exp.title,
          exp.category,
          exp.vendor || "-",
          formatCurrency(exp.amount),
        ]),
        styles: { font: "helvetica", fontSize: 8.5, cellPadding: 6 },
        headStyles: { fillColor: [31, 41, 55], textColor: [255, 255, 255] },
        theme: "striped",
      });

      // @ts-expect-error finalY set by autoTable
      lastY = doc.lastAutoTable.finalY;
    }

    // 4. CEO Signature Line Block
    const sigLineY = pageHeight - 75;
    const sigWidth = 160;
    const ceoSigX = pageWidth - margin - sigWidth;

    doc.setDrawColor("#94A3B8");
    doc.setLineWidth(0.8);
    doc.line(ceoSigX, sigLineY, ceoSigX + sigWidth, sigLineY);

    addText("Imran H Choudhury", ceoSigX + sigWidth / 2, sigLineY + 14, {
      fontSize: 9,
      color: darkText,
      weight: "bold",
      align: "center",
    });
    addText(
      "Chief Executive Officer (CEO)",
      ceoSigX + sigWidth / 2,
      sigLineY + 25,
      {
        fontSize: 7.5,
        color: mutedText,
        align: "center",
      },
    );
    addText(
      "Chitrojaal Digital Engineering",
      ceoSigX + sigWidth / 2,
      sigLineY + 35,
      {
        fontSize: 7,
        color: mutedText,
        align: "center",
      },
    );

    // 5. Footer Line & System Credit Text (Bottom)
    const footerY = pageHeight - 18;
    doc.setDrawColor(borderFill);
    doc.setLineWidth(0.8);
    doc.line(margin, footerY - 10, pageWidth - margin, footerY - 10);

    addText("Confidential - Internal Financial Records", margin, footerY, {
      fontSize: 7,
      color: mutedText,
    });
    addText("chitrojaal@gmail.com", pageWidth / 2, footerY, {
      fontSize: 7,
      color: mutedText,
      align: "center",
    });

    // Short & Transparent Developer Credit
    addText(
      "System developed by Sahariar Hosen Supto",
      pageWidth - margin,
      footerY,
      {
        fontSize: 6.5,
        color: "#94A3B8",
        align: "right",
      },
    );

    doc.save(`chitrojaal-finance-${month || "current"}.pdf`);
  };

  const handleResetFinance = async () => {
    if (
      window.confirm(
        "Are you sure you want to reset finance records for a new month? This operation will archive current active items.",
      )
    ) {
      try {
        const response = await fetch("/api/admin/finance/reset", {
          method: "POST",
        });
        if (response.ok) {
          alert("Finance data has been successfully reset for the new month.");
          loadSummary();
        } else {
          alert("Failed to reset finance data.");
        }
      } catch (error) {
        console.error("Error resetting finance data:", error);
        alert("An error occurred while resetting finance data.");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12 text-slate-100 p-4">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <FiFileText className="text-orange-500" /> Finance Overview
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Track revenue, log operation expenses, and print verified monthly
              balance sheets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex items-center">
              <FiCalendar className="absolute left-3 text-slate-400 text-sm" />
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="rounded-xl border border-white/10 bg-slate-900/90 pl-9 pr-3 py-2 text-sm text-white focus:border-orange-500 outline-none transition-all"
              />
            </div>

            <button
              onClick={() => loadSummary(month)}
              className="rounded-xl bg-orange-600 hover:bg-orange-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all active:scale-95"
            >
              Load
            </button>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all active:scale-95"
            >
              <FiDownload /> Export PDF
            </button>

            {isAdmin && (
              <button
                onClick={handleResetFinance}
                className="flex items-center gap-2 rounded-xl bg-red-600/80 hover:bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all active:scale-95"
              >
                <FiRefreshCw /> Reset Month
              </button>
            )}
          </div>
        </div>

        {/* Top Financial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="mb-3 flex items-center gap-2 text-orange-400 font-semibold text-sm">
              <FiTrendingUp className="text-lg" /> Revenue / Income
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {summary ? formatCurrency(summary.income) : "—"}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Cleared order payments for period
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="mb-3 flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <FiTrendingDown className="text-lg" /> Expenditure
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {summary ? formatCurrency(summary.expenditure) : "—"}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Total operational costs logged
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="mb-3 flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <FiDollarSign className="text-lg" /> Net Balance
            </div>
            <div
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                balance >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {summary ? formatCurrency(balance) : "—"}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Calculated Net Margin (Income - Expense)
            </p>
          </div>
        </div>

        {/* Main Operational Grid */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
          {/* Record / Edit Expense Box */}
          {isAdmin ? (
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-md">
              <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {editingExpense ? (
                  <>
                    <FiEdit2 className="text-orange-500" /> Update Expense
                    Record
                  </>
                ) : (
                  <>
                    <FiPlus className="text-orange-500" /> Record New Expense
                  </>
                )}
              </h2>
              {editingExpense && (
                <button
                  onClick={handleCancelEdit}
                  className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                >
                  <FiX /> Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">
                  Expense Title
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Memory Card Storage / Studio Lighting Repair"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-orange-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-orange-500 outline-none transition-all"
                  >
                    <option value="Operations">Operations</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Staff">Staff</option>
                    <option value="Travel">Travel</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">
                    Amount (BDT)
                  </label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                    placeholder="0.00"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-orange-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">
                    Vendor / Recipient
                  </label>
                  <input
                    value={form.vendor}
                    onChange={(e) =>
                      setForm({ ...form, vendor: e.target.value })
                    }
                    placeholder="Vendor Name"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-orange-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">
                    Operational Notes
                  </label>
                  <input
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    placeholder="Reference / Memo"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 py-3 font-semibold text-sm text-white transition-all shadow-md active:scale-95"
              >
                {editingExpense ? (
                  <>
                    <FiCheck /> Update Record
                  </>
                ) : (
                  <>
                    <FiPlus /> Save Expense
                  </>
                )}
              </button>
            </form>
          </div>
          ) : (
            <div></div>
          )}

          {/* Recent Expenses List */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-md flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-white mb-4">
                Recent Expenses
              </h2>

              {loading ? (
                <div className="text-center py-12 text-sm text-slate-400">
                  Loading financial records...
                </div>
              ) : summary?.expenses.length ? (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {summary.expenses.map((expense) => (
                    <div
                      key={expense._id}
                      className="rounded-xl border border-white/10 bg-slate-950/80 p-3 sm:p-4 hover:border-white/20 transition-all flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-sm text-white">
                          {expense.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                          <span className="bg-orange-950 text-orange-400 px-2 py-0.5 rounded border border-orange-800/50">
                            {expense.category}
                          </span>
                          {expense.vendor && <span>• {expense.vendor}</span>}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-sm text-white">
                          {formatCurrency(expense.amount)}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {new Date(expense.date).toLocaleDateString("en-BD")}
                        </p>
                        <div className="mt-2 flex justify-end gap-1">
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => handleEdit(expense)}
                                className="rounded-md border border-white/10 p-1.5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                                title="Edit"
                              >
                                <FiEdit2 className="text-xs" />
                              </button>
                              <button
                                onClick={() => handleDelete(expense._id)}
                                className="rounded-md border border-white/10 p-1.5 text-red-400 hover:bg-red-500/20 transition-colors"
                                title="Delete"
                              >
                                <FiTrash2 className="text-xs" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-sm text-slate-400">
                  No expenditures logged for this period.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
