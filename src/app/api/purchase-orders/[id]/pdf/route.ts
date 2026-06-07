import { NextRequest, NextResponse } from "next/server";
import { getPurchaseOrderUnique } from "@/lib/db/purchase-orders";
import jsPDF from "jspdf";
import autoTable, { UserOptions } from "jspdf-autotable";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const purchaseOrder = await getPurchaseOrderUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!purchaseOrder) {
      return NextResponse.json({ error: "Purchase order not found" }, { status: 404 });
    }

    // Create PDF
    const doc = new jsPDF();

    // Helper functions for calculations
    const calculateItemSubTotal = (item: typeof purchaseOrder.items[0]) => {
      return item.quantity * item.price;
    };

    const calculateItemTotal = (item: typeof purchaseOrder.items[0]) => {
      const subtotal = item.quantity * item.price;
      const discountAmount = (subtotal * item.dto) / 100;
      const afterDiscount = subtotal - discountAmount;
      const taxAmount = (afterDiscount * item.iva) / 100;
      return afterDiscount + taxAmount;
    };

    const calculateSubtotal = () => {
      return purchaseOrder.items.reduce((sum, item) => {
        return sum + item.quantity * item.price;
      }, 0);
    };

    const calculateTotalDiscount = () => {
      return purchaseOrder.items.reduce((acc, item) => {
        const subtotal = item.quantity * item.price;
        const discountAmount = (subtotal * item.dto) / 100;
        return acc + discountAmount;
      }, 0);
    };

    const calculateTotalIva = () => {
      return purchaseOrder.items.reduce((acc, item) => {
        const subtotal = item.quantity * item.price;
        const discountAmount = (subtotal * item.dto) / 100;
        const afterDiscount = subtotal - discountAmount;
        const taxAmount = (afterDiscount * item.iva) / 100;
        return acc + taxAmount;
      }, 0);
    };

    // Header
    doc.setFontSize(24);
    doc.setTextColor(55, 65, 81); // gray-700
    doc.text("PURCHASE ORDER", 14, 20);

    // Company Info
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128); // gray-500
    doc.text("TAG TRADING", 14, 30);
    doc.setFontSize(10);
    doc.text(`PO Number: #${purchaseOrder.orderNo.toString().padStart(6, "0")}`, 14, 36);
    doc.text(`Date: ${new Date(purchaseOrder.createdAt).toLocaleDateString()}`, 14, 42);

    // Customer Information
    doc.setFontSize(12);
    doc.setTextColor(55, 65, 81);
    doc.text("Bill To:", 14, 55);
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(purchaseOrder.customer.name, 14, 61);
    if (purchaseOrder.customer.email) {
      doc.text(`Email: ${purchaseOrder.customer.email}`, 14, 67);
    }
    if (purchaseOrder.customer.phone) {
      doc.text(`Phone: ${purchaseOrder.customer.phone}`, 14, 73);
    }

    // Items Table
    const tableData = purchaseOrder.items.map((item) => {
      const subtotal = calculateItemSubTotal(item);
      const discountAmount = (subtotal * item.dto) / 100;
      const afterDiscount = subtotal - discountAmount;
      const taxAmount = (afterDiscount * item.iva) / 100;
      const total = afterDiscount + taxAmount;

      return [
        item.product.name,
        item.product.category.name,
        `€${item.price.toFixed(2)}`,
        item.quantity.toString(),
        `€${subtotal.toFixed(2)}`,
        `${item.dto}%`,
        `${item.iva}%`,
        `€${total.toFixed(2)}`,
      ];
    });

    autoTable(doc, {
      startY: 80,
      head: [
        [
          "Product",
          "Category",
          "Unit Price",
          "Qty",
          "Subtotal",
          "Discount",
          "Tax (IVA)",
          "Total",
        ],
      ],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [55, 65, 81],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25, halign: "right" },
        3: { cellWidth: 15, halign: "center" },
        4: { cellWidth: 25, halign: "right" },
        5: { cellWidth: 20, halign: "center" },
        6: { cellWidth: 20, halign: "center" },
        7: { cellWidth: 25, halign: "right" },
      },
    });

    // Summary Section
    const finalY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 10 : 150;

    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);

    // Summary box
    const summaryX = 120;
    const summaryY = finalY;

    doc.setDrawColor(229, 231, 235); // gray-200
    doc.setFillColor(249, 250, 251); // gray-50
    doc.roundedRect(summaryX, summaryY, 75, 50, 3, 3, "FD");

    doc.setTextColor(55, 65, 81);
    doc.setFontSize(10);
    doc.text("Summary", summaryX + 5, summaryY + 8);

    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    let yPos = summaryY + 15;

    doc.text("Subtotal:", summaryX + 5, yPos);
    doc.text(`€${calculateSubtotal().toFixed(2)}`, summaryX + 70, yPos, { align: "right" });
    yPos += 6;

    doc.text("Total Discount:", summaryX + 5, yPos);
    doc.setTextColor(220, 38, 38); // red-600
    doc.text(`-€${calculateTotalDiscount().toFixed(2)}`, summaryX + 70, yPos, { align: "right" });
    doc.setTextColor(107, 114, 128);
    yPos += 6;

    doc.text("Total Tax (IVA):", summaryX + 5, yPos);
    doc.text(`€${calculateTotalIva().toFixed(2)}`, summaryX + 70, yPos, { align: "right" });
    yPos += 8;

    doc.setDrawColor(209, 213, 219); // gray-300
    doc.line(summaryX + 5, yPos, summaryX + 70, yPos);
    yPos += 6;

    doc.setFontSize(11);
    doc.setTextColor(55, 65, 81);
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount:", summaryX + 5, yPos);
    doc.text(`€${purchaseOrder.totalAmount.toFixed(2)}`, summaryX + 70, yPos, { align: "right" });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175); // gray-400
    doc.text(
      `Generated on ${new Date().toLocaleString()}`,
      14,
      pageHeight - 10,
      { align: "left" }
    );
    doc.text(
      "TAG TRADING - Purchase Order",
      doc.internal.pageSize.width - 14,
      pageHeight - 10,
      { align: "right" }
    );

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="purchase-order-${purchaseOrder.orderNo.toString().padStart(6, "0")}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

