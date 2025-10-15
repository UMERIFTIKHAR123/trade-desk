'use client';

import { Form } from "@/components/ui/form";
import { PurchaseOrderFormData, usePurchaseOrderForm } from "../../hooks/use-purchase-order-form";
import { CustomerSelector } from "../../components/customer-selector";
import { Category, Customer, Product } from "@prisma/client";
import { OrderSummaryCard } from "../../components/order-summary-card";
import { OrderItemList } from "../../components/order-item-list";
import { useOrderCalculations } from "../../hooks/use-order-calculation";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { createPurchaseOrder } from "@/app/dashboard/server-actions/purchase-order-actions";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface IProps {
  customers: Customer[];
  products: (Product & { category: Category })[];
}

export const CreatePurchaseOrderForm = ({ customers, products }: IProps) => {
  const router = useRouter();
  const [isSavingPO, startSavingPO] = useTransition();

  const savePurchaseOrder = (data: PurchaseOrderFormData) =>
    startSavingPO(async () => {
      const response = await createPurchaseOrder(data);
      if (response.success) {
        toast.success(response.message);
        router.push(`/dashboard/purchase-orders/${response.data?.id}`)
      } else {
        toast.error(response.message);
      }
    })


  const { form, handleSubmit } = usePurchaseOrderForm({
    onSubmit: async (data) => savePurchaseOrder(data)
  })

  const { handleProductSelect, handleQuantityChange, handleDiscountChange, } = useOrderCalculations(products);

  const watchedItems = form.watch("items") || [];


  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
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
          onProductSelect={(productId, index) => handleProductSelect(productId, index, form.setValue, form.getValues)}
          onQuantityChange={(index, quantity) => handleQuantityChange(index, quantity, form.setValue, form.getValues)}
          onDiscountChange={(index, discount) => handleDiscountChange(index, discount, form.setValue, form.getValues)}
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
                <ShoppingCart className="h-4 w-4" />
                Create Purchase Order
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}