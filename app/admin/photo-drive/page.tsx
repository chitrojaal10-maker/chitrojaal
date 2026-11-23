"use client";

import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "../../components/home/AdminLayout";
import {
  FiCopy,
  FiEdit2,
  FiLink,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";

type DriveLink = {
  _id: string;
  title: string;
  link: string;
  clientName?: string;
  eventName?: string;
  accessLevel?: string;
  notes?: string;
  status?: string;
  contactNumber?: string;
};

type Order = {
  _id: string;
  name: string;
  clientName?: string;
  status?: string;
  contactNumber?: string;
};

export default function PhotoDrivePage() {
  const [links, setLinks] = useState<DriveLink[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [editingLink, setEditingLink] = useState<DriveLink | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [orderSearchTerm, setOrderSearchTerm] = useState("");
  const [linkSearchTerm, setLinkSearchTerm] = useState("");
  const [form, setForm] = useState({
    title: "",
    link: "",
    clientName: "",
    eventName: "",
    accessLevel: "Client",
    notes: "",
    contactNumber: "",
  });
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const isAdmin = userRole === "admin";

  const loadLinks = async (contact?: string) => {
    setLoading(true);
    try {
      const url = contact
        ? `/api/admin/photo-drive?contact=${encodeURIComponent(contact)}`
        : "/api/admin/photo-drive";
      const response = await fetch(url);
      const result = await response.json();
      if (response.ok) {
        setLinks(result.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      setUserLoading(true);
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const userData = await response.json();
          setUserRole(userData.user?.accessRole);
        }
      } catch (error) {
        console.error("Failed to fetch user role", error);
      } finally {
        setUserLoading(false);
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    if (userRole === "admin" || userRole === "staff") {
      const timer = window.setTimeout(() => {
        loadLinks();
      }, 0);

      return () => window.clearTimeout(timer);
    }
  }, [userRole]);

  useEffect(() => {
    const loadOrders = async () => {
      setOrdersLoading(true);
      try {
        const response = await fetch("/api/event-managements");
        const result = await response.json();
        if (response.ok) {
          const apiOrders = Array.isArray(result) ? result : result.data || [];
          const mappedOrders = apiOrders.map((order: {
            _id: string;
            eventName?: string;
            customerName?: string;
            customerPhone?: string;
            status?: string;
          }) => ({
            _id: order._id,
            name: order.eventName,
            clientName: order.customerName,
            contactNumber: order.customerPhone,
            status: order.status,
          }));
          setOrders(mappedOrders);
        }
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setOrdersLoading(false);
      }
    };
    loadOrders();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/photo-drive", {
        method: editingLink ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editingLink ? { _id: editingLink._id } : {}),
          ...form,
        }),
      });
      if (response.ok) {
        setForm({
          title: "",
          link: "",
          clientName: "",
          eventName: "",
          accessLevel: "Client",
          notes: "",
          contactNumber: "",
        });
        setSelectedOrderId("");
        setEditingLink(null);
        loadLinks();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (link: DriveLink) => {
    setEditingLink(link);
    setForm({
      title: link.title,
      link: link.link,
      clientName: link.clientName || "",
      eventName: link.eventName || "",
      accessLevel: link.accessLevel || "Client",
      notes: link.notes || "",
      contactNumber: link.contactNumber || "",
    });
    setSelectedOrderId(""); // Reset order selection on manual edit
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this link?")) return;
    try {
      const response = await fetch(`/api/admin/photo-drive/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        loadLinks();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const orderId = e.target.value;
    setSelectedOrderId(orderId);
    const selectedOrder = orders.find((order) => order._id === orderId);
    if (selectedOrder) {
      setForm((prevForm) => ({
        ...prevForm,
        title: prevForm.title || `${selectedOrder.name} Photos`,
        eventName: selectedOrder.name,
        clientName: selectedOrder.clientName || "",
        contactNumber: selectedOrder.contactNumber || "",
      }));
    }
  };

  const filteredOrders = useMemo(() => {
    if (!orderSearchTerm) return orders;
    return orders.filter(
      (order) =>
        order.name.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
        order.clientName
          ?.toLowerCase()
          .includes(orderSearchTerm.toLowerCase()) ||
        order.contactNumber
          ?.toLowerCase()
          .includes(orderSearchTerm.toLowerCase()),
    );
  }, [orders, orderSearchTerm]);

  const filteredLinks = useMemo(() => {
    if (!linkSearchTerm) return links;
    return links.filter(
      (link) =>
        link.title.toLowerCase().includes(linkSearchTerm.toLowerCase()) ||
        link.eventName?.toLowerCase().includes(linkSearchTerm.toLowerCase()) ||
        link.clientName?.toLowerCase().includes(linkSearchTerm.toLowerCase()) ||
        link.contactNumber
          ?.toLowerCase()
          .includes(linkSearchTerm.toLowerCase()),
    );
  }, [links, linkSearchTerm]);

  const handleCopy = (link: string, id: string) => {
    navigator.clipboard.writeText(link).then(() => {
      // Visually indicate that the copy was successful
      const button = document.getElementById(`copy-btn-${id}`);
      if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = "Copied!";
        button.classList.add("text-green-400");
        setTimeout(() => {
          button.innerHTML = originalText;
          button.classList.remove("text-green-400");
        }, 2000);
      }
    });
  };

  if (userLoading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto space-y-8 pb-12 text-neutral-200">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-800 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-neutral-800 rounded w-1/2"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12 text-neutral-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <h1 className="text-3xl font-bold">Photo Drive Links</h1>
              <p className="text-sm text-neutral-400 mt-2">
                Store and manage shared client photo-drive access links from one
                place.
              </p>
            </div>
          </div>

          <div className={`grid ${isAdmin ? "lg:grid-cols-[1.1fr_0.9fr]" : "grid-cols-1"} gap-8`}>
            {isAdmin && (
              <div className="rounded-[1.5rem] border border-white/10 bg-[#0A0A0A]/80 p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {editingLink ? "Edit Link" : "Create Link"}
                </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="order-search"
                    className="block text-sm font-medium text-neutral-400 mb-2"
                  >
                    Search Booking
                  </label>
                  <input
                    id="order-search"
                    type="text"
                    placeholder="Search by event, client, or phone..."
                    value={orderSearchTerm}
                    onChange={(e) => setOrderSearchTerm(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3 mb-2"
                    disabled={editingLink !== null}
                  />
                  <label
                    htmlFor="order-select"
                    className="block text-sm font-medium text-neutral-400 mb-2"
                  >
                    Select Completed Booking (Optional)
                  </label>
                  <select
                    id="order-select"
                    value={selectedOrderId}
                    onChange={handleOrderChange}
                    className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
                    disabled={ordersLoading || editingLink !== null}
                  >
                    <option value="">
                      {ordersLoading ? "Loading bookings..." : "Select a booking"}
                    </option>
                    {filteredOrders.map((order) => (
                      <option key={order._id} value={order._id}>
                        {order.name} - {order.clientName}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Title"
                  className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
                  required
                />
                <input
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
                  required
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    value={form.clientName}
                    onChange={(e) =>
                      setForm({ ...form, clientName: e.target.value })
                    }
                    placeholder="Client name"
                    className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
                  />
                  <input
                    value={form.eventName}
                    onChange={(e) =>
                      setForm({ ...form, eventName: e.target.value })
                    }
                    placeholder="Event name"
                    className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
                  />
                  <input
                    value={form.contactNumber}
                    onChange={(e) =>
                      setForm({ ...form, contactNumber: e.target.value })
                    }
                    placeholder="Contact number"
                    className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <select
                    value={form.accessLevel}
                    onChange={(e) =>
                      setForm({ ...form, accessLevel: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
                  >
                    <option>Client</option>
                    <option>Admin</option>
                    <option>Vendor</option>
                  </select>
                  <input
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Notes"
                    className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white"
                >
                  <FiPlus /> {editingLink ? "Update link" : "Save link"}
                </button>
                </form>
              </div>
            )}

            <div className="rounded-[1.5rem] border border-white/10 bg-[#0A0A0A]/80 p-6 flex flex-col h-full">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                <h2 className="text-xl font-semibold">Saved Links</h2>
                <div className="relative w-full sm:w-auto">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search links..."
                    value={linkSearchTerm}
                    onChange={(e) => setLinkSearchTerm(e.target.value)}
                    className="w-full sm:w-64 rounded-xl border border-white/10 bg-[#050505] pl-10 pr-4 py-2 text-sm"
                  />
                </div>
              </div>

              {loading ? (
                <p className="text-sm text-neutral-400">Loading links...</p>
              ) : filteredLinks.length === 0 ? (
                <p className="text-sm text-neutral-400">No links yet.</p>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                  {filteredLinks.map((link) => (
                    <div
                      key={link._id}
                      className="rounded-xl border border-white/10 bg-[#050505] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0 pr-2">
                          <h3 className="font-semibold text-white truncate text-sm sm:text-base">
                            {link.title}
                          </h3>
                          <p className="text-[11px] sm:text-xs text-neutral-400 mt-1 truncate">
                            {link.eventName && (
                              <span>{link.eventName} &bull; </span>
                            )}
                            {link.clientName && (
                              <span>{link.clientName} &bull; </span>
                            )}
                            {link.contactNumber && (
                              <span>{link.contactNumber}</span>
                            )}
                          </p>
                        </div>
                        {isAdmin && (
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleEdit(link)}
                              className="rounded-lg border border-white/10 p-2"
                              title="Edit"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => handleDelete(link._id)}
                              className="rounded-lg border border-white/10 p-2"
                              title="Delete"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <a
                          href={link.link}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                        >
                          <FiLink /> Open link
                        </a>
                        <button
                          id={`copy-btn-${link._id}`}
                          onClick={() => handleCopy(link.link, link._id)}
                          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                        >
                          <FiCopy /> Copy
                        </button>
                      </div>
                      {link.notes ? (
                        <p className="mt-2 text-sm text-neutral-400">
                          {link.notes}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
    </AdminLayout>
  );
}
