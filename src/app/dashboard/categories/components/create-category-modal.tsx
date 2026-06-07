"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { FormModal } from "@/components/ui/form-modal";
import { Button } from "@/components/ui/button";
import CategoryForm from "../category-form";

interface CreateCategoryModalProps {
  trigger: React.ReactNode;
}

const FORM_ID = "create-category-form";

export function CreateCategoryModal({ trigger }: CreateCategoryModalProps) {
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

  const handleSuccess = () => {
    setOpen(false);
    setIsSubmitting(false);
    router.refresh();
  };

  return (
    <FormModal
      open={open}
      onOpenChange={handleOpenChange}
      trigger={trigger}
      title="Add Category"
      description="Create a new product category"
      className="sm:max-w-[440px]"
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
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Add Category
              </>
            )}
          </Button>
        </>
      }
    >
      <CategoryForm
        key={formKey}
        formId={FORM_ID}
        hideActions
        onSuccess={handleSuccess}
        onCancel={() => setOpen(false)}
        onLoadingChange={setIsSubmitting}
      />
    </FormModal>
  );
}
