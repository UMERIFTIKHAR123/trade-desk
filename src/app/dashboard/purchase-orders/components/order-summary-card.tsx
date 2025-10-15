"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Calculator } from "lucide-react";


export interface OrderItem {
  id?: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  dto: number;
  iva: number;
}

interface OrderSummaryCardProps {
  items: OrderItem[];
  originalTotal?: number;
  showChanges?: boolean;
}

export function OrderSummaryCard({
  items,
  originalTotal,
  showChanges = false
}: OrderSummaryCardProps) {
  

  const calculateTotals = () => {
    let subTotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    let total = 0;

    for (const item of items) {
      const basePrice = item.quantity * item.unitPrice;
      const discount = basePrice * (item.dto / 100);
      const priceAfterDiscount = basePrice - discount;
      const tax = priceAfterDiscount * (item.iva / 100);
      const finalPrice = priceAfterDiscount + tax;

      subTotal += basePrice;
      totalDiscount += discount;
      totalTax += tax;
      total += finalPrice;
    }

    return {
      subTotal,
      totalDiscount,
      totalTax,
      total,
    };
  };

  const totals = calculateTotals();
  const hasAmountChanged = originalTotal !== undefined && Math.abs(totals.total - originalTotal) > 0.01;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Items:</span>
            <span>{items.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(totals.subTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span className="text-red-600">-{formatCurrency(totals.totalDiscount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (IVA):</span>
            <span>{formatCurrency(totals.totalTax)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span className={hasAmountChanged ? "text-blue-600" : ""}>
              {formatCurrency(totals.total)}
            </span>
          </div>
          {showChanges && hasAmountChanged && originalTotal !== undefined && (
            <div className="text-xs text-gray-500">
              Original: {formatCurrency(originalTotal)}
              <br />
              Change: {totals.total > originalTotal ? '+' : ''}{formatCurrency(totals.total - originalTotal)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}