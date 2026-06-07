"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save } from "lucide-react";
import { FormModal } from "@/components/ui/form-modal";
import { Button } from "@/components/ui/button";
import { ProductFormV2 } from "./product-form-v2";

interface Category {
  id: string;
  name: string;
}

interface CreateProductModalProps {
  categories: Category[];
  trigger?: React.ReactNode;
}

const FORM_ID = "create-product-form";

export function CreateProductModal({
  categories,
  trigger,
}: CreateProductModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setFormKey((current) => current + 1);
    } else {
      setIsSubmitting(false);
    }
  };

  const handleSuccess = (productId: string) => {
    setOpen(false);
    setIsSubmitting(false);
    router.refresh();
    router.push(`/dashboard/products/${productId}`);
  };

  const defaultTrigger = (
    <Button size="lg">
      <Plus className="h-5 w-5 mr-2" />
      Add Product
    </Button>
  );

  return (
    <FormModal
      open={open}
      onOpenChange={handleOpenChange}
      trigger={trigger ?? defaultTrigger}
      title="Create Product"
      description="Add a new product to your inventory"
      className="sm:max-w-[600px]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Product
              </>
            )}
          </Button>
        </>
      }
    >
      <ProductFormV2
        key={formKey}
        categories={categories}
        variant="modal"
        formId={FORM_ID}
        hideActions
        onSuccess={handleSuccess}
        onCancel={() => setOpen(false)}
        onLoadingChange={setIsSubmitting}
      />
    </FormModal>
  );
}
