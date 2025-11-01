'use client';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Calculator, ReceiptText, ShoppingCart } from "lucide-react";
import { Category, Customer, Product, PurchaseOrder, PurchaseOrderItem } from "@prisma/client";
import { PurchaseOrderFormData, usePurchaseOrderForm } from "../../../hooks/use-purchase-order-form";

import { useEffect, useState, useTransition } from "react";
import { Form } from "@/components/ui/form";
import { CustomerSelector } from "../../../components/customer-selector";
import { OrderSummaryCard } from "../../../components/order-summary-card";
import { OrderItemList } from "../../../components/order-item-list";
import { Button } from "@/components/ui/button";
import { updatePurchaseOrder } from "@/app/dashboard/server-actions/purchase-order-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { usePurchaseOrder } from "../../../context/purchase-order-context";
import { useWatch } from "react-hook-form";
import { formatCurrency } from "@/lib/utils";


interface IProps {
  purchaseOrder: (PurchaseOrder & { items: PurchaseOrderItem[] });
  products: (Product & { category: Category })[];
  customers: Customer[];
}

export const EditPurchaseOrderForm = ({ purchaseOrder, products, customers }: IProps) => {
  const router = useRouter()
  const [isCustomerLocked, setIsCustomerLocked] = useState(true);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);


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

      const response = await updatePurchaseOrder(data.id!, payload);
      if (response.success) {
        toast.success(response.message);
        router.push(`/dashboard/purchase-orders/${response.data?.id}`)
      } else {
        toast.error(response.message);
      }
    })


  const { form } = usePurchaseOrder();


  const watchedItems = useWatch({ control: form.control, name: 'items' })
  const values = useWatch();

  useEffect(() => {
    if (form.formState.isDirty) {
      setHasUnsavedChanges(true);
      console.log("changed subscripti....")
    }
  }, [values]);


  console.log("is form dirty: ", form.formState.isDirty, values)

  const calculateOrderTotals = () => {
    const subtotal = watchedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const totalDiscount = watchedItems.reduce((sum, item) => sum + item.dto, 0);
    const totalTax = watchedItems.reduce((sum, item) => sum + item.iva, 0);
    const total = subtotal - totalDiscount + totalTax;

    return { subtotal, totalDiscount, totalTax, total };
  };



  const handleDiscardChanges = () => {
    form.reset();
    setHasUnsavedChanges(false);
    setShowDiscardDialog(false);
  };

  const totals = calculateOrderTotals();
  const originalTotal = purchaseOrder.totalAmount;
  const hasAmountChanged = Math.abs(totals.total - originalTotal) > 0.01;

  return (
    <>
      {/* Unsaved Changes Alert */}
      {hasUnsavedChanges && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            You have unsaved changes. Don't forget to save your modifications.
          </AlertDescription>
        </Alert>
      )}

      {/* Amount Change Alert */}
      {hasAmountChanged && (
        <Alert className="border-blue-200 bg-blue-50">
          <Calculator className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Order total changed from {formatCurrency(originalTotal)} to {formatCurrency(totals.total)}
            ({totals.total > originalTotal ? '+' : ''}{formatCurrency(totals.total - originalTotal)})
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(savePurchaseOrder)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <CustomerSelector customers={customers} form={form} isLocked={isCustomerLocked} onLockToggle={() => setIsCustomerLocked(!isCustomerLocked)} />
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
              type="button"
              variant="outline"
              onClick={() => setShowDiscardDialog(true)}
              disabled={!hasUnsavedChanges}
            >
              Discard Changes
            </Button>

            <Button
              type="submit"
              disabled={isSavingPO || !hasUnsavedChanges}
              className="min-w-[200px]"
            >
              {isSavingPO ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                  Saving Changes...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ReceiptText className="h-4 w-4" />
                  Save Changes
                </div>
              )}
            </Button>
          </div>
        </form>
      </Form>

      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes that will be lost. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscardChanges} className="bg-red-600 hover:bg-red-700">
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}   