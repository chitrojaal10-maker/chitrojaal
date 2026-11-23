// app/api/invoices/[orderId]/route.ts
import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { readFileSync } from "fs";
import path from "path";

type RouteContext = {
  params: Promise<{ orderId?: string }> | { orderId?: string };
};

export async function GET(request: Request, context: RouteContext) {
  await mongooseConnect();

  try {
    const params = await context.params;
    const orderId = params?.orderId;
    const { searchParams } = new URL(request.url);
    const shouldDownload = searchParams.get("download") === "1";

    if (
      !orderId ||
      typeof orderId !== "string" ||
      !/^[0-9a-fA-F]{24}$/.test(orderId)
    ) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const order = await Order.findById(orderId).populate("payments");

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Initialize Document Setup (A4 Page)
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 36;
    const contentWidth = pageWidth - margin * 2;

    // Palette & Styling Standards
    const brandColor = "#EA580C"; // Vibrant Accent
    const darkText = "#0F172A"; // Slate 900
    const bodyText = "#334155"; // Slate 700
    const mutedText = "#64748B"; // Slate 500
    const borderFill = "#E2E8F0"; // Slate 200

    // Standard ASCII Currency Helper (Prevents font symbol corruption)
    const formatBDT = (amount: number) =>
      `BDT ${amount.toLocaleString("en-BD", { minimumFractionDigits: 2 })}`;

    const totalAmount = Number(order.totalAmount || 0);
    const discountAmount = Number(order.discountAmount || 0);
    const finalAmount = Math.max(totalAmount - discountAmount, 0);

    const paymentsSum = Array.isArray(order.payments)
      ? order.payments.reduce((sum: number, p: any) => sum + Number(p?.amount || 0), 0)
      : 0;
    const paidAmount = Math.max(
      Number(order.paidAmount || 0),
      Number(order.advanceAmount || 0),
      paymentsSum,
    );
    const dueAmount = Math.max(finalAmount - paidAmount, 0);

    const isPaid = dueAmount <= 0;
    const statusText = isPaid ? "PAID IN FULL" : "PAYMENT PENDING";
    const statusColor = isPaid
      ? { fill: "#DCFCE7", text: "#15803D" }
      : { fill: "#FEF3C7", text: "#B45309" };

    // Helper: Render Text
    const addText = (
      text: string,
      x: number,
      y: number,
      options: {
        fontSize?: number;
        color?: string;
        weight?: "normal" | "bold";
        align?: "left" | "center" | "right";
      } = {},
    ) => {
      doc.setFont("helvetica", options.weight || "normal");
      doc.setFontSize(options.fontSize || 9);
      doc.setTextColor(options.color || darkText);
      doc.text(text, x, y, { align: options.align || "left" });
    };

    // Helper: Draw Card Background Box
    const drawCard = (x: number, y: number, w: number, h: number) => {
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(borderFill);
      doc.setLineWidth(0.8);
      doc.roundedRect(x, y, w, h, 4, 4, "FD");
    };

    // -------------------------------------------------------------
    // 1. BRAND HEADER & INVOICE META
    // -------------------------------------------------------------
    const logoPath = path.join(process.cwd(), "app/components/navbar/logo.png");
    const logoBase64 = readFileSync(logoPath, { encoding: "base64" });
    const logoBoxX = margin;
    const logoBoxY = margin + 2;
    // Moderate logo size so it fits and doesn't crowd the header
    const logoBoxSize = 64;
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(logoBoxX, logoBoxY, logoBoxSize, logoBoxSize, 10, 10, "F");
    doc.setFillColor(2, 6, 23);
    doc.roundedRect(
      logoBoxX + 4,
      logoBoxY + 4,
      logoBoxSize - 8,
      logoBoxSize - 8,
      8,
      8,
      "F",
    );
    // Slightly inset logo area and balanced header text.
    // Preserve original aspect ratio by reading PNG IHDR width/height from the buffer.
    const logoBuf = Buffer.from(logoBase64, "base64");
    let drawWidth = logoBoxSize - 16;
    let drawHeight = logoBoxSize - 16;
    try {
      // PNG IHDR chunk: width at bytes 16-19, height at 20-23 (big-endian)
      if (
        logoBuf.length >= 24 &&
        logoBuf.toString("ascii", 12, 16) === "IHDR"
      ) {
        const imgW = logoBuf.readUInt32BE(16);
        const imgH = logoBuf.readUInt32BE(20);
        if (imgW > 0 && imgH > 0) {
          const boxW = logoBoxSize - 16;
          const boxH = logoBoxSize - 16;
          const ratio = imgW / imgH;
          // Fit by width first, then constrain by height if needed
          drawWidth = boxW;
          drawHeight = Math.round(boxW / ratio);
          if (drawHeight > boxH) {
            drawHeight = boxH;
            drawWidth = Math.round(boxH * ratio);
          }
        }
      }
    } catch (err) {
      // fallback - use square area
      drawWidth = logoBoxSize - 16;
      drawHeight = logoBoxSize - 16;
    }
    const drawX = logoBoxX + 8 + (logoBoxSize - 16 - drawWidth) / 2;
    const drawY = logoBoxY + 8 + (logoBoxSize - 16 - drawHeight) / 2;
    doc.addImage(logoBase64, "PNG", drawX, drawY, drawWidth, drawHeight);
    const headerTextX = logoBoxX + logoBoxSize + 14;
    addText("CHITROJAAL", headerTextX, margin + 22, {
      fontSize: 24,
      color: brandColor,
      weight: "bold",
    });
    addText(
      "Juma Market, Mizan Road, Feni 3900, Bangladesh",
      headerTextX,
      margin + 42,
      { fontSize: 8.5, color: mutedText },
    );
    addText(
      "Phone: +880 1834-258375 | Web: www.chitrojaal.com",
      headerTextX,
      margin + 55,
      { fontSize: 8.5, color: mutedText },
    );

    // Right Header - Invoice Badge & Numbers
    addText("INVOICE", pageWidth - margin, margin + 20, {
      fontSize: 22,
      color: darkText,
      weight: "bold",
      align: "right",
    });
    addText(
      `Invoice ID: #INV-${String(order._id).slice(-8).toUpperCase()}`,
      pageWidth - margin,
      margin + 35,
      { fontSize: 8.5, color: bodyText, weight: "bold", align: "right" },
    );
    addText(
      `Issue Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString(
        "en-BD",
      )}`,
      pageWidth - margin,
      margin + 48,
      { fontSize: 8, color: mutedText, align: "right" },
    );
    addText(
      `Event Date: ${
        order.eventDate
          ? new Date(order.eventDate).toLocaleDateString("en-BD")
          : "N/A"
      }`,
      pageWidth - margin,
      margin + 60,
      { fontSize: 8, color: mutedText, align: "right" },
    );

    // Status Badge Block
    doc.setFillColor(statusColor.fill);
    doc.roundedRect(pageWidth - margin - 100, margin + 68, 100, 16, 8, 8, "F");
    addText(statusText, pageWidth - margin - 50, margin + 79, {
      fontSize: 7.5,
      color: statusColor.text,
      weight: "bold",
      align: "center",
    });

    // Decorative Header Divider
    doc.setDrawColor(brandColor);
    doc.setLineWidth(1.5);
    doc.line(margin, margin + 92, pageWidth - margin, margin + 92);

    // -------------------------------------------------------------
    // 2. CLIENT & PROJECT INFORMATION CARDS
    // -------------------------------------------------------------
    const gridY = margin + 105;
    const cardWidth = contentWidth / 2 - 8;
    const cardHeight = 82;

    // Card 1: Client Information
    drawCard(margin, gridY, cardWidth, cardHeight);
    addText("BILLED TO", margin + 12, gridY + 16, {
      fontSize: 8,
      color: brandColor,
      weight: "bold",
    });
    addText(order.customerName || "Valued Client", margin + 12, gridY + 32, {
      fontSize: 10.5,
      color: darkText,
      weight: "bold",
    });
    addText(
      `Contact: ${order.customerPhone || "N/A"}`,
      margin + 12,
      gridY + 46,
      { fontSize: 8, color: bodyText },
    );
    addText(`Email: ${order.customerEmail || "N/A"}`, margin + 12, gridY + 58, {
      fontSize: 8,
      color: bodyText,
    });
    // Wrap long customer addresses to avoid overflow inside the billed card
    const addressLines: string[] = (order.customerAddress || "N/A").match(
      /.{1,60}(?:\s|$)/g,
    ) || ["N/A"];
    addressLines.slice(0, 3).forEach((line: string, i: number) => {
      addText(line.trim(), margin + 12, gridY + 70 + i * 10, {
        fontSize: 8,
        color: bodyText,
      });
    });

    // Card 2: Operational & Project Context
    const rightCardX = margin + cardWidth + 16;
    drawCard(rightCardX, gridY, cardWidth, cardHeight);
    addText("PROJECT & OPERATIONAL DETAILS", rightCardX + 12, gridY + 16, {
      fontSize: 8,
      color: brandColor,
      weight: "bold",
    });
    addText(
      `Service Package: ${order.package || "Custom Production"}`,
      rightCardX + 12,
      gridY + 32,
      { fontSize: 8.5, color: darkText, weight: "bold" },
    );
    // Program and Lead Studio Unit lines removed per request
    addText(
      `Coverage Area: Feni & Regional Operations`,
      rightCardX + 12,
      gridY + 70,
      { fontSize: 8, color: bodyText },
    );
    // 3. TABULAR DELIVERABLES DATA
    // -------------------------------------------------------------
    const tableY = gridY + cardHeight + 15;

    const formatDateStr = (d?: string | Date) => {
      if (!d) return "N/A";
      const dateObj = new Date(d);
      return isNaN(dateObj.getTime())
        ? String(d)
        : dateObj.toLocaleDateString("en-BD");
    };

    const tableRows =
      Array.isArray(order.eventSchedule) && order.eventSchedule.length > 0
        ? order.eventSchedule.map(
            (item: {
              date?: string | Date;
              shift?: string;
              packageName?: string;
              amount?: number;
            }) => [
              item.packageName ||
                order.package ||
                "Creative Production Package",
              formatDateStr(item.date || order.eventDate),
              item.shift || "Day",
              formatBDT(
                item.amount && Number(item.amount) > 0
                  ? Number(item.amount)
                  : (order.totalAmount || 0) / order.eventSchedule.length,
              ),
            ],
          )
        : [
            [
              order.package || "Creative Production Package",
              formatDateStr(order.eventDate),
              "Day",
              formatBDT(order.totalAmount || 0),
            ],
          ];

    autoTable(doc, {
      startY: tableY,
      margin: { left: margin, right: margin },
      head: [["Description", "Date", "Shift", "Amount per Shift"]],
      body: tableRows,
      styles: {
        font: "helvetica",
        fontSize: 8.5,
        cellPadding: 8,
        textColor: [51, 65, 85],
      },
      headStyles: {
        fillColor: [234, 88, 12],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8.5,
      },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: 90, halign: "center" },
        2: { cellWidth: 70, halign: "center" },
        3: { cellWidth: 120, halign: "right" },
      },
      theme: "grid",
    });

    // @ts-expect-error lastAutoTable injected by autoTable plugin
    const finalTableY = doc.lastAutoTable.finalY || tableY + 70;

    // -------------------------------------------------------------
    // 4. FINANCIAL SUMMARY & PAYMENT BANKING DETAILS
    // -------------------------------------------------------------
    const bottomGridY = finalTableY + 15;
    const summaryCardWidth = 210;
    const summaryCardX = pageWidth - margin - summaryCardWidth;
    const paymentBoxWidth = contentWidth - summaryCardWidth - 14;

    // Payment Info Card
    drawCard(margin, bottomGridY, paymentBoxWidth, 100);
    addText("PAYMENT INSTRUCTIONS & BANKING", margin + 12, bottomGridY + 16, {
      fontSize: 8,
      color: brandColor,
      weight: "bold",
    });
    addText(
      "Bank Name: Dutch Bangla Bank - DBBL (Feni Branch)",
      margin + 12,
      bottomGridY + 32,
      { fontSize: 8, color: bodyText },
    );
    addText("Account Title: MD SALMAN HOSSAIN", margin + 12, bottomGridY + 45, {
      fontSize: 8,
      color: bodyText,
    });
    addText("Account No: 1407348737513", margin + 12, bottomGridY + 58, {
      fontSize: 8,
      color: darkText,
      weight: "bold",
    });
    // Use 'Personal' wording only for bKash/Nagad
    addText(
      "bKash / Nagad Wallet: +880 1834-258375 (Personal)",
      margin + 12,
      bottomGridY + 71,
      { fontSize: 8, color: bodyText },
    );
    addText(
      `Payment Ref: INV-${String(order._id).slice(-6).toUpperCase()}`,
      margin + 12,
      bottomGridY + 84,
      { fontSize: 8, color: mutedText },
    );

    // Financial Calculation Card
    drawCard(summaryCardX, bottomGridY, summaryCardWidth, 100);
    let calcY = bottomGridY + 18;

    const addSummaryRow = (
      label: string,
      value: string,
      isBold = false,
      color = darkText,
    ) => {
      addText(label, summaryCardX + 12, calcY, {
        fontSize: 8.5,
        color: isBold ? color : mutedText,
        weight: isBold ? "bold" : "normal",
      });
      addText(value, summaryCardX + summaryCardWidth - 12, calcY, {
        fontSize: 8.5,
        color,
        weight: isBold ? "bold" : "normal",
        align: "right",
      });
      calcY += 16;
    };

    addSummaryRow("Subtotal", formatBDT(totalAmount));
    if (discountAmount > 0) {
      addSummaryRow(
        "Discount Applied",
        `- ${formatBDT(discountAmount)}`,
        false,
        "#16A34A",
      );
    }
    addSummaryRow("Total Paid", formatBDT(paidAmount), true);

    // Divider Line
    doc.setDrawColor(brandColor);
    doc.setLineWidth(1);
    doc.line(
      summaryCardX + 12,
      calcY,
      summaryCardX + summaryCardWidth - 12,
      calcY,
    );

    // Total Due
    calcY += 16;
    addSummaryRow(
      "Total Due",
      formatBDT(dueAmount),
      true,
      dueAmount <= 0 ? "#16A34A" : brandColor,
    );

    // -------------------------------------------------------------
    // 5. TERMS & CONDITIONS
    // -------------------------------------------------------------
    const termsY = bottomGridY + 112;
    const termsHeight = 118;

    drawCard(margin, termsY, contentWidth, termsHeight);
    addText("TERMS AND CONDITIONS", margin + 12, termsY + 16, {
      fontSize: 8,
      color: brandColor,
      weight: "bold",
    });

    const policies = [
      "Minimum 30% advance have to be paid for booking.",
      "90% Payment must be cleared when event is finished.",
      "No work will be done outside the time specified in the package details.",
      "Extra payment have to be paid for work and extra time.",
      "Images and videos captured by Chitrojaal can be shared across our social media channels.",
      "Final image and video delivery will be completed within 21-28 working days after the event.",
      "During the event, client has to provide us food and a proper place to rest at night.",
    ];

    let pY = termsY + 28;
    policies.forEach((policy) => {
      addText(policy, margin + 12, pY, { fontSize: 7.5, color: bodyText });
      pY += 10;
    });

    // -------------------------------------------------------------
    // 6. SIGNATURE BLOCK & FOOTER
    // -------------------------------------------------------------
    const footerY = pageHeight - 25;
    const sigLineY = pageHeight - 65;

    // Authorized Signature Block
    const sigWidth = 140;
    const sigX = pageWidth - margin - sigWidth;

    doc.setDrawColor("#94A3B8");
    doc.setLineWidth(0.8);
    doc.line(sigX, sigLineY, sigX + sigWidth, sigLineY);

    addText("Authorized Signature", sigX + sigWidth / 2, sigLineY + 12, {
      fontSize: 8,
      color: darkText,
      weight: "bold",
      align: "center",
    });
    addText(
      "Chitrojaal Digital Engineering",
      sigX + sigWidth / 2,
      sigLineY + 22,
      {
        fontSize: 7,
        color: mutedText,
        align: "center",
      },
    );

    // Footer Divider Line
    doc.setDrawColor(borderFill);
    doc.setLineWidth(0.8);
    doc.line(margin, footerY - 12, pageWidth - margin, footerY - 12);

    addText(
      "Thank you for choosing Chitrojaal for your creative production.",
      margin,
      footerY,
      { fontSize: 7.5, color: mutedText },
    );
    addText("chitrojaal@gmail.com", pageWidth / 2, footerY, {
      fontSize: 7.5,
      color: mutedText,
      align: "center",
    });
    addText("www.chitrojaal.com", pageWidth - margin, footerY, {
      fontSize: 7.5,
      color: mutedText,
      align: "right",
    });

    // Very subtle marketing line for developer attribution
    addText(
      "System designed and developed by Sahariar Hosen Supto",
      pageWidth / 2,
      footerY + 12,
      {
        fontSize: 6,
        color: "#9CA3AF",
        align: "center",
      },
    );

    // Buffer Generation
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": shouldDownload
          ? `attachment; filename="invoice-${order._id}.pdf"`
          : `inline; filename="invoice-${order._id}.pdf"`,
        "Cache-Control": "no-store, no-cache, must-revalidate, private",
        Pragma: "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error generating invoice:", error);
    return NextResponse.json(
      { error: "Error generating invoice" },
      { status: 500 },
    );
  }
}
