"use client"

import * as React from "react"
import { ReceiptText, ShoppingCart, X, Trash2, Package } from "lucide-react"

import { Button } from "../../../../../../src-old/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Badge } from "../../../../../../src-old/components/ui/badge"
import { Separator } from "../../../../../../src-old/components/ui/separator"
import Image from "next/image"
import { formatCurrency } from "../../../../../../src-old/lib/utils"
import { QuantityControl } from "./quantity-control"
import { usePurchaseOrder } from "../../context/purchase-order-context"

export function POCartDrawer() {
  const { totalQuantity, changeActiveStep, updateQuantity, removeItem } = usePurchaseOrder();
  const { form } = usePurchaseOrder();
  const items = form.watch("items");

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);


  return (
    <Drawer direction="right">

      <PillCartTrigger totalQuantity={totalQuantity} subtotal={subtotal} />



      <DrawerContent className="md:max-w-[480px] w-full h-full flex flex-col">
        {/* Header */}
        <DrawerHeader className="border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DrawerTitle className="text-xl font-semibold">Purchase Order Cart</DrawerTitle>
              <DrawerDescription className="text-sm mt-1">
                {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} selected
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground max-w-[280px]">
                Add items to your purchase order to get started
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative bg-card border rounded-lg p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.imageUrl}
                        height={80}
                        width={80}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-medium text-sm leading-tight line-clamp-2">
                          {item.name}
                        </h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeItem(item.productId)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground mb-3">
                        {formatCurrency(item.price)} per unit
                      </p>

                      {/* Quantity and Price Row */}
                      <div className="flex items-center justify-between">
                        <QuantityControl
                          size="sm"
                          quantity={item.quantity}
                          onQuantityChange={(qty) => {
                            updateQuantity(item.productId, qty)
                          }}
                          onDelete={() => removeItem(item.productId)}
                        />
                        <div className="text-right">
                          <p className="font-semibold text-sm">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Summary */}
        {items.length > 0 && (
          <>
            <Separator />
            <div className="p-4 space-y-4">
              {/* Order Summary */}
              <div className="space-y-2">

                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold">{formatCurrency(subtotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  className="flex-1 gap-2"
                  size="lg"
                  onClick={() => changeActiveStep('COMPLETE-PO')}
                >
                  <ReceiptText className="h-4 w-4" />
                  Review Order
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" size="lg">
                    Continue Shopping
                  </Button>
                </DrawerClose>
              </div>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
export function PillCartTrigger({ totalQuantity, subtotal }: { totalQuantity: number, subtotal: number }) {
  if (totalQuantity === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DrawerTrigger asChild>
        <div className="bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center gap-6 cursor-pointer">
          <div className="relative">
            <ShoppingCart className="h-7 w-7" />
            <Badge
              variant="secondary"
              className="absolute -top-2 -right-2 h-5 min-w-5 px-1.5 flex items-center justify-center text-xs font-bold border-2 border-primary"
            >
              {totalQuantity}
            </Badge>
          </div>

          <div className="flex flex-col items-start">
            <span className="text-xs opacity-90 font-normal">View Cart</span>
            <span className="text-sm font-bold">{formatCurrency(subtotal)}</span>
          </div>
        </div>

      </DrawerTrigger>
    </div>
  )
}