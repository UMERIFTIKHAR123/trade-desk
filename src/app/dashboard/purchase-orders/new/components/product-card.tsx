'use client'

import { Badge } from "../../../../../../src-old/components/ui/badge";
import { Button } from "../../../../../../src-old/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../../../src-old/components/ui/card";
import { Category, Product } from "@prisma/client"
import { Package, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { QuantityControl } from "./quantity-control";
import { usePurchaseOrder } from "../../context/purchase-order-context";

interface Props {
  product: Product & { category: Category };
}
export const ProductCard = ({ product }: Props) => {

  const { addItem, updateQuantity, removeItem, form } = usePurchaseOrder();

  const handleAddClick = () => {

    const newItem = {
      productId: product.id,
      name: product.name,
      imageUrl: product.imageUrl!,
      price: product.price,
      iva: 21,
      dto: 0,
      quantity: 1
    }

    addItem(newItem)
  }

  const items = form.watch('items');
  const itemInCart = items.find(item => item.productId === product.id)

  return (
    <Card key={product.id} className="pt-0 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
      <div className="relative h-56 bg-muted overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        <Badge className="absolute top-3 right-3 bg-background/30 backdrop-blur-sm">
          {product.category.name}
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-1 text-lg">{product.name}</CardTitle>
        <CardDescription className="text-xl font-bold text-primary">
          €{product.price.toFixed(2)}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description || ""}
        </p>
      </CardContent>

      <CardFooter className="gap-2 pt-4 flex justify-center">
        {!!itemInCart ? (
          <QuantityControl
            size="sm"
            quantity={itemInCart.quantity}
            onQuantityChange={(qty) => {
              updateQuantity(itemInCart.productId, qty)
            }}
            onDelete={() => removeItem(itemInCart.productId)}
          />
        ) : (
          <Button onClick={handleAddClick}>
            <ShoppingCart /> Add to cart
          </Button>
        )}


      </CardFooter>
    </Card >
  )

}