import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/dist/client/link"
import { ArrowLeft, Calendar } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { ProductFormV2 } from "../../components/product-form-v2"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const productId = (await params).id;

  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product) {
    notFound()
  }

  const categories = await prisma.category.findMany();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/products/${productId}`}>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" />
          </button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Product ID: {product.id}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Created: {formatDate(product.createdAt)}</span>
            </div>
            <span>•</span>
            <span>Last updated: {formatDate(product.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <ProductFormV2
        categories={categories}
        initialData={product}
      />
    </div>
  )
}
