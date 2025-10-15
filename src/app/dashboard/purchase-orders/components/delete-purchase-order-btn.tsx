
'use client';

import { Button } from "@/components/ui/button";
import { deletePurchaseOrder } from "../../server-actions/purchase-order-actions";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { WarnAlertDialog } from "@/components/warn-alert-dialog";

export function DeletePurchaseOrderButton({ id }: { id: string }) {

  const _deletePurchaseOrder = async () => {
    const response = await deletePurchaseOrder(id);

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message)
    }
  }

  return (
    <WarnAlertDialog
      triggerElement={
        <Button variant="destructive" size="sm">
          <Trash2 />
        </Button>
      }
      title="Delete Purchase Order"
      description="Are you sure you want to delete this purchase order? This action cannot be undone."
      confirmBtnTitle="Delete Purchase Order"
      onConfirm={_deletePurchaseOrder}
    />

  )
}