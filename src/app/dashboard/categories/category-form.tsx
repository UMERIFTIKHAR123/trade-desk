"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createCategory, updateCategory } from "../server-actions/category-actions";
import { Category } from "@prisma/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const categorySchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category;
  formId?: string;
  hideActions?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
  onLoadingChange?: (isLoading: boolean) => void;
}

export default function CategoryForm({
  category,
  formId,
  hideActions = false,
  onSuccess,
  onCancel,
  onLoadingChange,
}: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: category?.name || "" },
    mode: "onTouched",
  });

  async function onSubmit(values: CategoryFormValues) {
    onLoadingChange?.(true);

    try {
      const response = category
        ? await updateCategory(category.id, { name: values.name })
        : await createCategory({ name: values.name });

      if (response.success) {
        toast.success(response.message);

        if (onSuccess) {
          onSuccess();
        } else if (!category) {
          form.reset();
        }
      } else {
        toast.error(response.message);
      }
    } finally {
      onLoadingChange?.(false);
    }
  }

  const showActions = !hideActions;

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Category Name"
                  {...field}
                  aria-invalid={!!form.formState.errors.name}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showActions ? (
          <div className="flex items-center justify-end gap-3">
            {onCancel ? (
              <Button
                type="button"
                variant="outline"
                disabled={form.formState.isSubmitting}
                onClick={onCancel}
              >
                Cancel
              </Button>
            ) : null}
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        ) : null}
      </form>
    </Form>
  );
}
