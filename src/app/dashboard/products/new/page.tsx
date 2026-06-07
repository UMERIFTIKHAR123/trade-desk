import Link from "next/dist/client/link"
import prisma from "@/lib/prisma"
import { ProductFormV2 } from "../components/product-form-v2";
import { ArrowLeft } from "lucide-react";
import { getCategories } from "@/lib/db/categories";

export default async function NewProductPage() {

  const categories = await getCategories();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products">
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border bg-card hover:bg-muted transition-colors">
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Product</h1>
          <p className="text-muted-foreground">Add a new product to your inventory</p>
        </div>
      </div>

      {/* Form */}
      <ProductFormV2
        categories={categories}
      />
    </div>
  )
}
