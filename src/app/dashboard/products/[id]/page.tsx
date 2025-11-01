// app/products/[id]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '../../../../../src-old/components/ui/badge';
import { Button } from '../../../../../src-old/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../src-old/components/ui/card';
import { Separator } from '../../../../../src-old/components/ui/separator';
import { Pencil, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getProductUnique } from '@/lib/db/products';
import { formatCurrency, formatDate } from '../../../../../src-old/lib/utils';



export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const product = await getProductUnique({ where: { id: id }, include: { category: true } });

  if (!product) {
    notFound();
  }

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard/products">
            <Button variant="ghost" className="-ml-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>

          <Link href={`/dashboard/products/${product.id}/edit`}>
            <Button>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Product
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Information */}
          <div className="space-y-6">
            {/* Basic Information Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl">{product.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{product.category.name}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.description || 'No description available'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="flex justify-between items-center">
                    <dt className="text-sm font-medium text-gray-600">Product ID</dt>
                    <dd className="text-sm text-gray-900 font-mono">
                      {product.id}
                    </dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <dt className="text-sm font-medium text-gray-600">Category</dt>
                    <dd className="text-sm text-gray-900 font-medium">
                      {product.category.name}
                    </dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <dt className="text-sm font-medium text-gray-600">Price</dt>
                    <dd className="text-sm text-gray-900 font-medium">
                      {formatCurrency(product.price)}
                    </dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <dt className="text-sm font-medium text-gray-600">Created At</dt>
                    <dd className="text-sm text-gray-900">
                      {formatDate(product.createdAt)}
                    </dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <dt className="text-sm font-medium text-gray-600">Last Updated</dt>
                    <dd className="text-sm text-gray-900">
                      {formatDate(product.updatedAt)}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
          {/* Product Image */}
          <div>
            <Card className="overflow-hidden">
              <div className="relative aspect-square bg-gray-100">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <span className="text-6xl">📦</span>
                  </div>
                )}
              </div>
            </Card>

          </div>


        </div>
      </div>
    </div>
  );
}