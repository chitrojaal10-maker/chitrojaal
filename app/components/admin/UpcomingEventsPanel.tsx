"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiMapPin } from "react-icons/fi";
import { formatDateKey, parseDateValue } from "@/lib/date-utils";

type EventScheduleEntry = {
  date?: string | Date | null;
  shift?: string | null;
};

export type UpcomingEventItem = {
  _id?: string;
  name?: string;
  eventName?: string;
  customerName?: string;
  eventDate?: string | Date | null;
  eventSchedule?: EventScheduleEntry[];
  eventLocation?: string;
  status?: string;
  eventProgramType?: string;
};

type UpcomingEventsPanelProps = {
  events: UpcomingEventItem[];
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  emptyLabel?: string;
  compact?: boolean;
};

type NormalizedUpcomingEvent = UpcomingEventItem & {
  primaryDate: Date;
  eventLabel: string;
  shift: string;
};

const weekdayHeaders = [
  { label: "Sun", textColor: "text-rose-400" },
  { label: "Mon", textColor: "text-sky-400" },
  { label: "Tue", textColor: "text-purple-400" },
  { label: "Wed", textColor: "text-emerald-400" },
  { label: "Thu", textColor: "text-indigo-400" },
  { label: "Fri", textColor: "text-cyan-400" },
  { label: "Sat", textColor: "text-fuchsia-400" },
];

const dayColorThemes = [
  {
    // Sun - Rose
    border: "border-rose-500/30 hover:border-rose-400/70",
    bg: "bg-gradient-to-br from-rose-950/40 via-rose-900/15 to-[#0A0A0A]",
    dayNum: "text-rose-200 font-bold",
    glow: "hover:shadow-[0_0_16px_rgba(244,63,94,0.22)]",
  },
  {
    // Mon - Sky
    border: "border-sky-500/30 hover:border-sky-400/70",
    bg: "bg-gradient-to-br from-sky-950/40 via-blue-950/15 to-[#0A0A0A]",
    dayNum: "text-sky-200 font-bold",
    glow: "hover:shadow-[0_0_16px_rgba(56,189,248,0.22)]",
  },
  {
    // Tue - Purple
    border: "border-purple-500/30 hover:border-purple-400/70",
    bg: "bg-gradient-to-br from-purple-950/40 via-purple-900/15 to-[#0A0A0A]",
    dayNum: "text-purple-200 font-bold",
    glow: "hover:shadow-[0_0_16px_rgba(168,85,247,0.22)]",
  },
  {
    // Wed - Emerald
    border: "border-emerald-500/30 hover:border-emerald-400/70",
    bg: "bg-gradient-to-br from-emerald-950/40 via-emerald-900/15 to-[#0A0A0A]",
    dayNum: "text-emerald-200 font-bold",
    glow: "hover:shadow-[0_0_16px_rgba(16,185,129,0.22)]",
  },
  {
    // Thu - Indigo
    border: "border-indigo-500/30 hover:border-indigo-400/70",
    bg: "bg-gradient-to-br from-indigo-950/40 via-indigo-900/15 to-[#0A0A0A]",
    dayNum: "text-indigo-200 font-bold",
    glow: "hover:shadow-[0_0_16px_rgba(99,102,241,0.22)]",
  },
  {
    // Fri - Cyan
    border: "border-cyan-500/30 hover:border-cyan-400/70",
    bg: "bg-gradient-to-br from-cyan-950/40 via-teal-900/15 to-[#0A0A0A]",
    dayNum: "text-cyan-200 font-bold",
    glow: "hover:shadow-[0_0_16px_rgba(6,182,212,0.22)]",
  },
  {
    // Sat - Fuchsia
    border: "border-fuchsia-500/30 hover:border-fuchsia-400/70",
    bg: "bg-gradient-to-br from-fuchsia-950/40 via-pink-900/15 to-[#0A0A0A]",
    dayNum: "text-fuchsia-200 font-bold",
    glow: "hover:shadow-[0_0_16px_rgba(217,70,239,0.22)]",
  },
];

const formatDay = (date: Date) =>
  new Intl.DateTimeFormat("en", { day: "numeric" }).format(date);

const formatMonth = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(date);

const getPrimaryDate = (event: UpcomingEventItem) => {
  const scheduleDate = event.eventSchedule?.[0]?.date;
  const dateValue = scheduleDate || event.eventDate;
  return parseDateValue(dateValue);
};

export default function UpcomingEventsPanel({
  events,
  title = "Calendar & Upcoming Events",
  description = "A quick calendar view of upcoming shoots and bookings.",
  actionHref = "/admin/event-managements",
  actionLabel = "Open Booking Management",
  emptyLabel = "No upcoming events found.",
  compact = false,
}: UpcomingEventsPanelProps) {
  const normalizedEvents = useMemo(() => {
    return events
      .map((event) => {
        const primaryDate = getPrimaryDate(event);
        return {
          ...event,
          primaryDate,
          eventLabel:
            event.name || event.eventName || event.customerName || "Untitled Event",
          shift: event.eventSchedule?.[0]?.shift || "Day",
        } as NormalizedUpcomingEvent;
      })
      .filter((event): event is NormalizedUpcomingEvent => Boolean(event.primaryDate))
      .sort(
        (left, right) =>
          (left.primaryDate?.getTime() ?? 0) - (right.primaryDate?.getTime() ?? 0),
      );
  }, [events]);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const resetToday = () => {
    setCurrentMonth(new Date());
  };

  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startPadding = monthStart.getDay();
  const daysInMonth = monthEnd.getDate();

  const eventMap = useMemo(() => {
    const map = new Map<string, Array<NormalizedUpcomingEvent>>();
    normalizedEvents.forEach((event) => {
      const primaryDate = event.primaryDate as Date;
      if (!primaryDate) return;
      const key = formatDateKey(primaryDate);
      const current = map.get(key) || [];
      current.push(event);
      map.set(key, current);
    });
    return map;
  }, [normalizedEvents]);

  const calendarCells = [
    ...Array.from({ length: startPadding }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        index + 1,
      );
      return date;
    }),
  ];

  const upcomingList = normalizedEvents.slice(0, compact ? 4 : 6);

  return (
    <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      {/* Calendar View Panel */}
      <div className="relative overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-950/25 via-[#0D0D0D] to-[#070707] p-4 shadow-[0_0_35px_rgba(234,88,12,0.12)] sm:p-5">
        <div className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full bg-orange-500/10 blur-3xl" />
        
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/20 text-orange-400 shadow-[0_0_15px_rgba(234,88,12,0.3)]">
                <FiCalendar size={18} />
              </span>
              <div>
                <h2 className="text-base font-bold text-white sm:text-lg">{title}</h2>
                <p className="text-xs leading-relaxed text-neutral-400 sm:text-sm">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevMonth}
                className="rounded-xl border border-white/15 bg-white/5 p-2 text-neutral-200 transition-all hover:border-orange-500/50 hover:bg-orange-500/20 hover:text-white"
                title="Previous Month"
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-black tracking-wide text-white px-1">
                {formatMonth(monthStart)}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="rounded-xl border border-white/15 bg-white/5 p-2 text-neutral-200 transition-all hover:border-orange-500/50 hover:bg-orange-500/20 hover:text-white"
                title="Next Month"
              >
                <FiChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={resetToday}
                className="rounded-xl border border-orange-500/40 bg-orange-500/20 px-3 py-1 text-[11px] font-bold text-orange-300 shadow-[0_0_10px_rgba(234,88,12,0.2)] transition-all hover:bg-orange-500/30 hover:text-white"
              >
                Today
              </button>
            </div>
            <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-400">
              {normalizedEvents.length} total events
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {weekdayHeaders.map((header) => (
              <div
                key={header.label}
                className={`pb-2 text-center text-[10px] font-extrabold uppercase tracking-wider ${header.textColor}`}
              >
                {header.label}
              </div>
            ))}
            {calendarCells.map((date, index) => {
              if (!date) {
                const blankTheme = dayColorThemes[index % 7];
                return (
                  <div
                    key={`blank-${index}`}
                    className={`min-h-16 rounded-xl border ${blankTheme.border} ${blankTheme.bg} opacity-20`}
                  />
                );
              }

              const dayEvents = eventMap.get(formatDateKey(date)) || [];
              const primaryEvent = dayEvents[0];
              const isToday = formatDateKey(date) === formatDateKey(new Date());
              const hasEvents = dayEvents.length > 0;
              const dayTheme = dayColorThemes[date.getDay()];

              if (hasEvents) {
                return (
                  <div
                    key={date.toISOString()}
                    className="relative z-10 min-h-16 rounded-xl border border-orange-400 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 p-2 text-white shadow-[0_0_20px_rgba(234,88,12,0.55)] ring-2 ring-orange-300/80 transition-all duration-200 transform hover:scale-[1.03]"
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <span className="text-xs font-black text-white drop-shadow-md">
                        {formatDay(date)}
                      </span>
                      <span className="rounded-full border border-white/40 bg-black/40 px-1.5 py-0.2 text-[9px] font-black text-white backdrop-blur-sm shadow-md">
                        {dayEvents.length}
                      </span>
                    </div>
                    {primaryEvent ? (
                      <div className="mt-1 space-y-0.5">
                        <p
                          className="truncate text-[10px] font-black text-white leading-tight drop-shadow-sm"
                          title={primaryEvent.eventLabel}
                        >
                          {primaryEvent.eventLabel}
                        </p>
                        <p className="truncate text-[9px] font-bold text-orange-100/95 drop-shadow-sm">
                          {primaryEvent.shift} shift
                        </p>
                      </div>
                    ) : null}
                  </div>
                );
              }

              return (
                <div
                  key={date.toISOString()}
                  className={`group min-h-16 rounded-xl border p-2 transition-all duration-200 ${dayTheme.border} ${dayTheme.bg} ${dayTheme.glow} ${
                    isToday
                      ? "ring-2 ring-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <span className={`text-xs font-black ${dayTheme.dayNum}`}>
                      {formatDay(date)}
                    </span>
                    {isToday && (
                      <span className="rounded-full border border-amber-400/40 bg-amber-500/20 px-1.5 py-0.2 text-[8px] font-black text-amber-300 shadow-sm">
                        TODAY
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upcoming Events List Panel */}
      <div className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-950/25 via-[#0D0D0D] to-[#070707] p-4 shadow-[0_0_35px_rgba(56,189,248,0.12)] sm:p-5">
        <div className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="relative z-10 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <h3 className="text-base font-bold text-white sm:text-lg">Upcoming Events</h3>
            <p className="text-xs leading-relaxed text-neutral-400 sm:text-sm">
              The next booked events in time order.
            </p>
          </div>
          <Link
            href={actionHref}
            className="inline-flex items-center gap-1 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-bold text-sky-300 transition-all hover:bg-sky-500/20 hover:border-sky-500/50 shadow-sm"
          >
            {actionLabel} <FiChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="relative z-10 mt-4 space-y-2.5">
          {upcomingList.length > 0 ? (
            upcomingList.map((event) => (
              <div
                key={event._id || `${event.eventLabel}-${event.eventDate}`}
                className="group rounded-xl border border-white/10 bg-[#121212]/90 p-3.5 transition-all hover:border-sky-500/40 hover:bg-sky-950/20 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white group-hover:text-sky-200 transition-colors">
                      {event.eventLabel}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-[11px] text-neutral-400">
                      <span>
                        {event.primaryDate?.toLocaleDateString("en-BD", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      {event.eventLocation ? (
                        <span className="inline-flex items-center gap-1 text-neutral-300">
                          <FiMapPin className="h-3 w-3 text-sky-400" />
                          {event.eventLocation}
                        </span>
                      ) : null}
                    </p>
                  </div>
                  <span className="rounded-full border border-orange-500/40 bg-gradient-to-r from-orange-500/20 to-amber-500/20 px-2.5 py-0.5 text-[10px] font-black text-orange-300 shadow-sm">
                    {event.shift}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center text-sm text-neutral-400">
              {emptyLabel}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
