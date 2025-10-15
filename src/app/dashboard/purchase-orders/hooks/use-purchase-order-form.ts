"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const purchaseOrderItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price must be positive"),
  dto: z.number().min(0, "Discount must be positive"),
  iva: z.number().min(0, "Tax must be positive"),
});

const purchaseOrderSchema = z.object({
  id: z.string().optional(),
  customerId: z.string().min(1, "Customer is required"),
  items: z.array(purchaseOrderItemSchema).min(1, "At least one item is required"),
});


export type PurchaseOrderFormData = z.input<typeof purchaseOrderSchema>;
export type PurchaseOrderOutputFormData = z.output<typeof purchaseOrderSchema>;

interface UsePurchaseOrderFormProps {
  defaultValues?: Partial<PurchaseOrderFormData>;
  onSubmit: (data: PurchaseOrderFormData) => Promise<void>;
}

export function usePurchaseOrderForm({ defaultValues, onSubmit }: UsePurchaseOrderFormProps) {
  const form = useForm<PurchaseOrderFormData, any, PurchaseOrderOutputFormData>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: defaultValues || {
      customerId: "",
      items: [
        {
          productId: "",
          quantity: 1,
          unitPrice: 0,
          dto: 0,
          iva: 21,
        }
      ],
    },
  });


  const handleSubmit = form.handleSubmit(onSubmit);

  return {
    form,
    handleSubmit,
  };
}