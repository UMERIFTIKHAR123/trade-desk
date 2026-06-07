"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Save,
  X,
  Upload,
  ImageIcon,
  Loader2,
  Package,
  AlertCircle,
  Euro,
} from "lucide-react";
import Image from "next/image";

import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import { createProduct, updateProduct } from "../../server-actions/product-actions";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

const productFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional().nullable(),
  price: z.number().min(0.01, "Price must be greater than 0"),
  categoryId: z.string().min(1, "Category is required"),
  image: z.any().refine((files) => files?.length === 1, "Image is required").optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  initialData?: ProductFormData & { id?: string; imageUrl?: string | null; imagePath?: string | null; };
  categories: Category[];
  variant?: "page" | "modal";
  formId?: string;
  hideActions?: boolean;
  onSuccess?: (productId: string) => void;
  onCancel?: () => void;
  onLoadingChange?: (isLoading: boolean) => void;
}

export function ProductFormV2({
  initialData,
  categories,
  variant = "page",
  formId,
  hideActions = false,
  onSuccess,
  onCancel,
  onLoadingChange,
}: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const inputImageRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mode = initialData?.id ? "edit" : "create";

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      price: 0,
      categoryId: "",
      image: null,
    },
  });


  // Clean up the object URL when the component unmounts or imagePreview changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);


  const handleSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    onLoadingChange?.(true);
    setError(null);
    try {


      const image = data.image?.[0];
      let newBlob: PutBlobResult | null = null;
      if (image) {
        newBlob = await upload(image.name, image, {
          access: 'public',
          handleUploadUrl: '/api/product-image/upload',
        });
      }

      const body = {
        name: data.name,
        description: data.description || "",
        price: data.price,
        categoryId: data.categoryId,
        imageUrl: newBlob ? newBlob.url : initialData?.imageUrl || "",
        imagePath: newBlob ? newBlob.pathname : initialData?.imagePath || "",
      }

      let response;
      if (mode === 'create') {
        response = await createProduct(body)
      } else {
        const isImageReplaced = !!newBlob;
        response = await updateProduct({
          id: initialData?.id!,
          ...body,
        }, isImageReplaced)
      }


      if (response.success) {
        toast.success(response.message);

        if (onSuccess && response.data?.id) {
          onSuccess(response.data.id);
        } else if (response.data?.id) {
          router.push("/dashboard/products/" + response.data.id);
        }
      } else {
        toast.error(response.message);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  };


  const isDirty = form.formState.isDirty;
  const currentImage = imagePreview ?? initialData?.imageUrl ?? null;
  const isModal = variant === "modal";
  const showActions = !hideActions;

  const productInfoFields = (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Name</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. Wireless Headphones Pro"
                {...field}
              />
            </FormControl>
            {!isModal ? (
              <FormDescription>
                A clear and descriptive name for your product
              </FormDescription>
            ) : null}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the product features, specifications, and benefits..."
                className={isModal ? "min-h-[80px] resize-none" : "min-h-[120px] resize-none"}
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormDescription>
              {field.value?.length || 0}/500 characters
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-9"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );

  const imageFields = (
    <>
      <FormField
        control={form.control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{initialData ? "Change Image" : "Select Image"}</FormLabel>
            <FormControl>
              <div
                className={
                  isModal
                    ? "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-4 text-center hover:bg-muted/30 transition cursor-pointer"
                    : "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-6 text-center hover:bg-muted/30 transition cursor-pointer"
                }
                onClick={() => inputImageRef.current?.click()}
              >
                <Input
                  ref={inputImageRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    field.onChange(files);
                    if (files && files[0]) {
                      setImagePreview(URL.createObjectURL(files[0]));
                    }
                  }}
                />
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {imagePreview ? "Image selected" : "Click to upload or drag & drop"}
                </p>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {currentImage ? (
        <div>
          <Label className="mb-2 block">Preview</Label>
          <div className="relative w-full overflow-hidden rounded-lg border border-muted bg-muted/30">
            <Image
              height={isModal ? 160 : 250}
              width={isModal ? 160 : 250}
              className="object-contain mx-auto"
              src={currentImage}
              alt="Product preview"
              onError={() => setImagePreview(null)}
            />
            {imagePreview ? (
              <div className={isModal ? "px-4" : "px-10"}>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="my-4 w-full"
                  onClick={() => {
                    setImagePreview(null);
                    form.setValue("image", null);
                    if (inputImageRef.current) inputImageRef.current.value = "";
                  }}
                >
                  <X className="h-4 w-4" /> Clear Selection
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );

  const formFields = (
    <>
      {productInfoFields}
      {imageFields}
    </>
  );

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {isModal ? (
          <div className="space-y-4">{formFields}</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Product Information
                </CardTitle>
                <CardDescription>
                  {mode === "create"
                    ? "Enter the details for the new product"
                    : "Update the product information"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">{productInfoFields}</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Product Image
                </CardTitle>
                <CardDescription>
                  {initialData
                    ? "Update the product image or keep the existing one"
                    : "Upload a product image"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">{imageFields}</CardContent>
            </Card>
          </div>
        )}

        {showActions ? (
          <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
            <div className="text-sm text-muted-foreground">
              {mode === "edit" && isDirty ? (
                <span className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                  <AlertCircle className="h-4 w-4" />
                  You have unsaved changes
                </span>
              ) : null}
            </div>
            <div className="flex gap-3">
              {onCancel ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              ) : (
                <Link href="/dashboard/products">
                  <Button type="button" variant="outline" disabled={isLoading}>
                    Cancel
                  </Button>
                </Link>
              )}

              <Button
                type="submit"
                disabled={isLoading || (mode === "edit" && !isDirty)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === "create" ? "Creating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {mode === "create" ? "Create Product" : "Save Changes"}
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : null}
      </form>
    </Form>
  );
}