"use client";

import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Minus, Trash2 } from "lucide-react";
import { ProductPicker } from "./product-picker";
import { Category, Product } from "@prisma/client";
import { useMemo } from "react";
import { PurchaseOrderFormData } from "../hooks/use-purchase-order-form";
import { formatCurrency } from "@/lib/utils";


interface OrderItemRowProps {
  form: UseFormReturn<PurchaseOrderFormData>;
  index: number;
  products: (Product & { category: Category })[];
  onRemove?: () => void;
  onProductSelect: (productId: string, index: number) => void;
  onQuantityChange: (index: number, quantity: number) => void;
  onDiscountChange: (index: number, discount: number) => void;
  showRemove?: boolean;
  isExisting?: boolean;
}

export function OrderItemRow({
  form,
  index,
  products,
  onRemove,
  onProductSelect,
  onQuantityChange,
  onDiscountChange,
  showRemove = true,
  isExisting = false,
}: OrderItemRowProps) {
  const watchedItem = form.watch(`items.${index}`);
  const selectedProduct = products.find(p => p.id === watchedItem?.productId);

  const { subTotal, itemTotal } = useMemo(() => {

    if (!watchedItem) return { subTotal: 0, itemTotal: 0 };

    const { quantity, unitPrice } = watchedItem;

    const dto = watchedItem.dto / 100 || 0;
    const iva = watchedItem.iva / 100 || 0;

    const dtoAmount = (quantity * unitPrice) * dto;
    const subTotal = (quantity * unitPrice) - dtoAmount;

    const itemTotal = (quantity * unitPrice) * (1 - dto) * (1 + iva);
    return { subTotal, itemTotal };
  }, [watchedItem.quantity, watchedItem?.unitPrice, watchedItem.dto, watchedItem.iva]);

  return (
    <div className="rounded-lg border bg-gray-50 p-4 relative">
      {isExisting && (
        <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
          Existing
        </Badge>
      )}
      <div className="grid gap-4 md:grid-cols-12 md:items-end">
        {/* Product Selection */}
        <div className="md:col-span-4">
          <FormField
            control={form.control}
            name={`items.${index}.productId`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product</FormLabel>
                <FormControl>
                  <ProductPicker
                    products={products}
                    selectedProductId={field.value}
                    onSelect={(productId) => onProductSelect(productId, index)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Quantity */}
        <div className="md:col-span-2">
          <FormField
            control={form.control}
            name={`items.${index}.quantity`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => {
                        const newQuantity = Math.max(1, field.value - 1);
                        field.onChange(newQuantity);
                        onQuantityChange(index, newQuantity);
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      className="h-9 text-center"
                      {...field}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        field.onChange(value);
                        onQuantityChange(index, value);
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => {
                        const newQuantity = field.value + 1;
                        field.onChange(newQuantity);
                        onQuantityChange(index, newQuantity);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Unit Price */}
        <div className="md:col-span-2">
          <FormField
            control={form.control}
            name={`items.${index}.unitPrice`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* DTO */}
        <div className="md:col-span-1">
          <FormField
            control={form.control}
            name={`items.${index}.dto`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>DTO %</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...field}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      field.onChange(value);
                      onDiscountChange(index, value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="md:col-span-1">
          <FormItem>
            <FormLabel>Sub Total</FormLabel>
            <Input type="text" value={subTotal} readOnly />
          </FormItem>
        </div>

        <div className="md:col-span-1">
          <FormField
            control={form.control}
            name={`items.${index}.iva`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>IVA %</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Remove Item Button */}
        <div className="md:col-span-1">
          {showRemove && onRemove && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={onRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Item Total */}
      {selectedProduct && (
        <div className="mt-4 flex justify-end">
          <div className="text-right">
            <p className="text-sm text-gray-600">Item Total</p>
            <p className="text-lg font-semibold">
              {formatCurrency(itemTotal)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}