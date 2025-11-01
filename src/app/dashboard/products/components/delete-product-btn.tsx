'use client';

import { Button } from "../../../../../src-old/components/ui/button";
import { WarnAlertDialog } from "../../../../../src-old/components/warn-alert-dialog";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "../../server-actions/product-actions";
import { toast } from "sonner";

export function DeleteProductButton({ productId }: { productId: string }) {
  return (
    <WarnAlertDialog
      title="Are you absolutely sure?"
      description="This action cannot be undone. This will permanently delete the product from databaese."
      triggerElement={
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      }
      confirmBtnTitle="Delete"
      onConfirm={async () => {
        const response = await deleteProduct(productId)
        if (response.success) {
          toast.success(response.message)
        } else {
          toast.error(response.message || "Something went wrong ❌")
        }
      }}
    />
  );
}