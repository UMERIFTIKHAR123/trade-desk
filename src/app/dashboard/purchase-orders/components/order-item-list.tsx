"use client";

import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import { OrderItemRow } from "./order-item-row";
import { Category, Product } from "@prisma/client";
import { usePurchaseOrder } from "../context/purchase-order-context";


interface OrderItemListProps {
  form: UseFormReturn<any>;
  products: (Product & { category: Category })[];
  title?: string;
  description?: string;
}

export function OrderItemList({
  form,
  products,
  title = "Order Items",
  description = "Add products to this purchase order",
}: OrderItemListProps) {

  const { changeActiveStep } = usePurchaseOrder()

  const { fields, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");


  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        <Button
          type="button"
          variant="outline"
          className="absolute right-6"
          onClick={() => changeActiveStep('CHOOSE-PRODUCTS')}
        >
          <Plus /> Add more items
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <OrderItemRow
            key={field.id}
            form={form}
            index={index}
            products={products}
            onRemove={fields.length > 1 ? () => remove(index) : undefined}
            showRemove={fields.length > 1}
            isExisting={!!watchedItems[index]?.id}
          />
        ))}


      </CardContent>
    </Card>
  );
}