"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Category } from "@prisma/client";
import { FormModal } from "@/components/ui/form-modal";
import { Button } from "@/components/ui/button";
import CategoryForm from "../category-form";

interface EditCategoryModalProps {
  category: Category;
  trigger: React.ReactNode;
}

export function EditCategoryModal({
  category,
  trigger,
}: EditCategoryModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formId = `edit-category-form-${category.id}`;

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
      title="Edit Category"
      description="Update the category name"
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
          <Button type="submit" form={formId} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </>
      }
    >
      <CategoryForm
        key={`${category.id}-${formKey}`}
        category={category}
        formId={formId}
        hideActions
        onSuccess={handleSuccess}
        onCancel={() => setOpen(false)}
        onLoadingChange={setIsSubmitting}
      />
    </FormModal>
  );
}
