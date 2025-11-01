'use client';

import { Form } from "../../../../../../src-old/components/ui/form";
import { PurchaseOrderFormData } from "../../hooks/use-purchase-order-form";
import { CustomerSelector } from "../../components/customer-selector";
import { Category, Customer, Product } from "@prisma/client";
import { OrderSummaryCard } from "../../components/order-summary-card";
import { OrderItemList } from "../../components/order-item-list";
import { Button } from "../../../../../../src-old/components/ui/button";
import { ReceiptText } from "lucide-react";
import { createPurchaseOrder } from "../../../../../../src-old/app/dashboard/server-actions/purchase-order-actions";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { usePurchaseOrder } from "../../context/purchase-order-context";

interface IProps {
  customers: Customer[];
  products: (Product & { category: Category })[];
}

export const CreatePurchaseOrderForm = ({ customers, products }: IProps) => {

  const router = useRouter();
  const [isSavingPO, startSavingPO] = useTransition();

  const savePurchaseOrder = (data: PurchaseOrderFormData) =>
    startSavingPO(async () => {

      const payload = {
        customerId: data.customerId,
        items: data.items.map(({ productId, quantity, price, dto, iva }) => ({
          productId,
          quantity,
          price,
          dto,
          iva
        }))
      }

      const response = await createPurchaseOrder(payload);
      if (response.success) {
        toast.success(response.message);
        router.push(`/dashboard/purchase-orders/${response.data?.id}`)
      } else {
        toast.error(response.message);
      }
    })

  const { form } = usePurchaseOrder();


  const watchedItems = form.watch("items") || [];

  console.log(form.formState.errors)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(savePurchaseOrder)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <CustomerSelector customers={customers} form={form} />
          </div>
          <div>
            <OrderSummaryCard items={watchedItems} />
          </div>
        </div>

        <OrderItemList
          form={form}
          products={products}
        />

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={isSavingPO}
            className="min-w-[200px]"
          >
            {isSavingPO ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                Creating Order...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ReceiptText />
                Create Purchase Order
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}