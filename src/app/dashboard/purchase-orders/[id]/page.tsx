import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CalendarDays, Mail, Package, Phone, Receipt, SquarePen, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PurchaseOrderItem } from "@prisma/client";
import dayjs from "dayjs";
import Link from "next/link";
import { getPurchaseOrderUnique } from "@/lib/db/purchase-orders";
import { formatCurrency, formatDate, formatPurchaseOrderNo } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>
}

export default async function PurchaseOrderDetail({ params }: Props) {

  const id = (await params).id;

  const purchaseOrder = await getPurchaseOrderUnique({
    where: {
      id
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      },
      customer: true
    }
  });

  if (!purchaseOrder) {
    return notFound();
  }

  const calculateItemTotal = (item: PurchaseOrderItem) => {
    const subtotal = item.quantity * item.price;
    const discounted = subtotal - item.dto;
    return discounted + item.iva;
  };

  const calculateItemSubTotal = (item: PurchaseOrderItem) => {
    const subtotal = item.quantity * item.price;
    return subtotal;
  };

  const calculateSubtotal = () => {
    return purchaseOrder.items.reduce((sum, item) => {
      return sum + (item.quantity * item.price);
    }, 0);
  };

  function calculateTotalDiscount() {
    return purchaseOrder!.items.reduce((acc, item) => {
      const discountPerItem = (item.price * item.dto) / 100;
      const totalDiscount = discountPerItem * item.quantity;
      return acc + totalDiscount;
    }, 0);
  }

  function calculateTotalIva() {
    return purchaseOrder!.items.reduce((acc, item) => {
      const priceAfterDiscount = item.price - (item.price * item.dto) / 100;
      const ivaPerItem = (priceAfterDiscount * item.iva) / 100;
      const totalIva = ivaPerItem * item.quantity;
      return acc + totalIva;
    }, 0);
  }



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Purchase Order</h1>
          <p className="text-gray-600">PO#: {formatPurchaseOrderNo(purchaseOrder.orderNo)}</p>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline">
            <Receipt className="mr-2 h-4 w-4" />
            Download PDF
          </Button> */}
          <Link href={`/dashboard/purchase-orders/${purchaseOrder.id}/edit-v2`}>
            <Button variant={'outline'}><SquarePen /> Edit Order</Button>
          </Link>

        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-semibold">{purchaseOrder.customer.name}</p>
                <p className="text-sm text-gray-600">ID: {purchaseOrder.customer.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-400" />
              <span>{purchaseOrder.customer.email ?? "--"}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{purchaseOrder.customer.phone ?? "--"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Items:</span>
              <span>{purchaseOrder.items.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Quantity:</span>
              <span>
                {purchaseOrder.items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Total Discount:</span>
              <span>
                {formatCurrency(calculateTotalDiscount())}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Tax (IVA):</span>
              <span>
                {formatCurrency(calculateTotalIva())}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total Amount:</span>
              <span>{formatCurrency(purchaseOrder.totalAmount)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Order Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Order Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Created</p>
              <p className="text-sm text-gray-600">
                {formatDate(purchaseOrder.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-sm text-gray-600">
                {formatDate(purchaseOrder.updatedAt)}
              </p>
            </div>
            <Badge variant="secondary" className="w-fit">
              Active
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
          <CardDescription>
            {purchaseOrder.items.length} items in this purchase order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Sub Total</TableHead>
                  <TableHead className="text-right">Discount</TableHead>
                  <TableHead className="text-right">Tax (IVA)</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseOrder.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.product.imageUrl && (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {item.product.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.price)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {item.quantity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(calculateItemSubTotal(item))}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.dto}%
                    </TableCell>

                    <TableCell className="text-right">
                      {item.iva}%
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(calculateItemTotal(item))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Order Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-sm space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Discount:</span>
                <span className="text-red-600">
                  -{formatCurrency(calculateTotalDiscount())}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Tax (IVA):</span>
                <span>{formatCurrency(calculateTotalIva())}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount:</span>
                <span>{formatCurrency(purchaseOrder.totalAmount)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}