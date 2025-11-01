"use client"
import * as React from "react"
import { Button } from "../../../../src-old/components/ui/button";
import { Input } from "../../../../src-old/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../../../src-old/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createCategory, updateCategory } from "../server-actions/category-actions"
import { Category } from "@prisma/client";
import { toast } from "sonner";
import { Loader } from "lucide-react";


const categorySchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface Props {
  category?: Category;
}

export default function CategoryForm({ category }: Props) {

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: category?.name || "" },
    mode: "onTouched",
  });


  function onSubmit(values: CategoryFormValues) {

    if (category) {
      updateCategory(category.id, { name: values.name })
        .then((response) => {
          if (response.success) {
            toast.success(response.message);
          } else {
            toast.error(response.message);
          }
        })
    } else {
      createCategory({ name: values.name })
        .then((response) => {
          if (response.success) {
            toast.success(response.message);
            form.reset();
          } else {
            toast.error(response.message);
          }
        })
    }


  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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


        <div className="flex items-center justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <>
                <Loader className="animate-spin" /> Submitting...
              </>

            )}
            {!form.formState.isSubmitting && (
              "Submit"
            )}

          </Button>
        </div>
      </form>
    </Form>
  )
}
