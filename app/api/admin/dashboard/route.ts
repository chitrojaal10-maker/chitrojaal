import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Event from "@/models/Event";
import Order from "@/models/Order";
import Staff from "@/models/Staff";
import Pose from "@/models/Pose";
import { getSessionTokenFromRequest, verifySessionToken } from "@/lib/session";
import { parseDateValue } from "@/lib/date-utils";

const FINANCE_METRIC_LABELS = ["Payment Received", "Due Payment"];

type OrderLike = {
  eventDate?: string | Date | null;
  eventSchedule?: Array<{ date?: string | Date | null; shift?: string | null }>;
  eventName?: string | null;
  customerName?: string | null;
  status?: string | null;
  dueAmount?: number | null;
  paidAmount?: number | null;
  totalAmount?: number | null;
  createdAt?: string | Date | null;
};

async function getSessionRole(request: Request) {
  const token = getSessionTokenFromRequest(request);
  const session = await verifySessionToken(token);
  return session?.accessRole || null;
}

function getOrderPrimaryDate(order: OrderLike) {
  const scheduleDate = order.eventSchedule?.[0]?.date;
  const dateValue = scheduleDate || order.eventDate;
  return parseDateValue(dateValue);
}

function normalizeOrder(order: OrderLike) {
  const primaryDate = getOrderPrimaryDate(order);
  return {
    ...order,
    eventDate: primaryDate ? primaryDate.toISOString() : null,
    primaryDate,
  };
}

export async function GET(request: Request) {
  await mongooseConnect();

  try {
    const role = await getSessionRole(request);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [allOrders, completedEventsCount, orderSummaries, totalStaff, totalPoses, allPoses] =
      await Promise.all([
        Order.find({}).lean(),
        Order.countDocuments({ status: "Completed" }),
        Order.find(
          {},
          "dueAmount paidAmount advanceAmount totalAmount eventDate eventSchedule eventName customerName status",
        ).lean(),
        Staff.countDocuments(),
        Pose.countDocuments(),
        Pose.find({}).select("imageUrls").lean(),
      ]);

    const galleryImages = (allPoses as Array<{ imageUrls?: string[] }>).flatMap(
      (p) => p.imageUrls || [],
    );

    const normalizedOrders = (allOrders as OrderLike[])
      .map(normalizeOrder)
      .sort((left, right) => {
        const leftTime = left.primaryDate?.getTime() ?? 0;
        const rightTime = right.primaryDate?.getTime() ?? 0;
        return leftTime - rightTime;
      });

    const upcomingEvents = normalizedOrders.filter(
      (order) =>
        ["Pending", "Approved"].includes(order.status || "Pending") &&
        !!order.primaryDate &&
        order.primaryDate >= tomorrow,
    );

    const recentOrders = [...normalizedOrders]
      .sort((left, right) => {
        const leftTime = left.primaryDate?.getTime() ?? 0;
        const rightTime = right.primaryDate?.getTime() ?? 0;
        return rightTime - leftTime;
      })
      .slice(0, 5);

    const paymentReceived = orderSummaries.reduce(
      (sum, order: any) =>
        sum + Math.max(Number(order.paidAmount || 0), Number(order.advanceAmount || 0)),
      0,
    );

    const duePayment = orderSummaries.reduce(
      (sum, order) => sum + (order.dueAmount || 0),
      0,
    );
    const dueOrderCount = orderSummaries.filter(
      (order) => (order.dueAmount || 0) > 0,
    ).length;

    const metrics = [
      {
        label: "Upcoming Events",
        value: upcomingEvents.length,
        kind: "count",
        detail: upcomingEvents[0]
          ? `${upcomingEvents[0].eventName || upcomingEvents[0].customerName || "Untitled Event"} • ${upcomingEvents[0].primaryDate?.toLocaleDateString("en-BD", { dateStyle: "medium" })}`
          : "No upcoming events",
        icon: "calendar",
      },
      {
        label: "Events Done",
        value: completedEventsCount,
        kind: "count",
        detail:
          completedEventsCount === 0
            ? "No finished events yet"
            : `${completedEventsCount} events completed`,
        icon: "check",
      },
      {
        label: "Payment Received",
        value: paymentReceived,
        kind: "currency",
        detail: `${orderSummaries.length} orders tracked`,
        icon: "dollar",
      },
      {
        label: "Due Payment",
        value: duePayment,
        kind: "currency",
        detail: `${dueOrderCount} order${dueOrderCount === 1 ? "" : "s"} still pending`,
        icon: "clock",
      },
      {
        label: "Total Staff",
        value: totalStaff,
        kind: "count",
        detail: `${totalStaff} staff members`,
        icon: "users",
      },
      {
        label: "Photo Gallery",
        value: totalPoses,
        kind: "count",
        detail: `${totalPoses} photo reference${totalPoses === 1 ? "" : "s"}`,
        icon: "image",
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        galleryImages,
        accessRole: role || "admin",
        upcomingEvents: upcomingEvents.map((event) => ({
          ...event,
          name: event.eventName || event.customerName || "Untitled Event",
          eventDate: event.primaryDate ? event.primaryDate.toISOString() : null,
        })),
        recentOrders: recentOrders.map((order) => ({
          ...order,
          eventDate: order.eventDate || null,
          eventSchedule: order.eventSchedule || [],
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 },
    );
  }
}
