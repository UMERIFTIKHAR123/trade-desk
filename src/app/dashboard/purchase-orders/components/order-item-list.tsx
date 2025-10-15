"use client";

import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import { OrderItemRow } from "./order-item-row";
import { Category, Product } from "@prisma/client";


interface OrderItemListProps {
  form: UseFormReturn<any>;
  products: (Product & { category: Category })[];
  onProductSelect: (productId: string, index: number) => void;
  onQuantityChange: (index: number, quantity: number) => void;
  onDiscountChange: (index: number, discount: number) => void;
  title?: string;
  description?: string;
}

export function OrderItemList({
  form,
  products,
  onProductSelect,
  onQuantityChange,
  onDiscountChange,
  title = "Order Items",
  description = "Add products to this purchase order",
}: OrderItemListProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");

  const addItem = () => {
    append({
      productId: "",
      quantity: 1,
      unitPrice: 0,
      dto: 0,
      iva: 21,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <OrderItemRow
            key={field.id}
            form={form}
            index={index}
            products={products}
            onRemove={fields.length > 1 ? () => remove(index) : undefined}
            onProductSelect={onProductSelect}
            onQuantityChange={onQuantityChange}
            onDiscountChange={onDiscountChange}
            showRemove={fields.length > 1}
            isExisting={!!watchedItems[index]?.id}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </CardContent>
    </Card>
  );
}