"use client";

import React, { useState } from "react";
import AdminLayout from "../../components/home/AdminLayout";

// 1. Define a type for your event objects
interface Event {
  id: string;
  name: string;
  location: string;
  type: string;
  status: string;
  date: string;
  // Add other properties that an event might have
}

// 2. Use the 'Event' type for your mock data array
const events: Event[] = [
  {
    id: "1",
    name: "Smith Wedding",
    location: "Venue A, City",
    type: "Wedding",
    status: "Confirmed",
    date: "2024-08-15",
  },
  {
    id: "2",
    name: "Corporate Gala",
    location: "Hotel Ballroom",
    type: "Corporate",
    status: "Pending",
    date: "2024-09-20",
  },
  // ... other events
];

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All Types" || event.type === typeFilter;
    const matchesStatus =
      statusFilter === "All Statuses" || event.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <AdminLayout>
      {/* Your JSX for displaying the events page, filters, and the filteredEvents table */}
      <h1>Events</h1>
    </AdminLayout>
  );
}
