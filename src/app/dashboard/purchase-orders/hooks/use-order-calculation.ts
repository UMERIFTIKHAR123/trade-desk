"use client";

import { Product } from "@prisma/client";
import { PurchaseOrderFormData } from "./use-purchase-order-form";
import { UseFormSetValue } from "react-hook-form";

export function useOrderCalculations(products: Product[]) {
  const calculateTax = (quantity: number, unitPrice: number, discount: number, taxRate: number = 0.16) => {
    const subtotal = quantity * unitPrice;
    const taxableAmount = subtotal - discount;
    return Math.max(0, taxableAmount * taxRate);
  };

  const handleProductSelect = (
    productId: string,
    index: number,
    setValue: UseFormSetValue<PurchaseOrderFormData>,
    getValues: (name: string) => any
  ) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setValue(`items.${index}.productId`, productId);
      setValue(`items.${index}.unitPrice`, product.price);
    }
  };

  const handleQuantityChange = (
    index: number,
    quantity: number,
    setValue: UseFormSetValue<PurchaseOrderFormData>,
    getValues: (name: string) => any
  ) => {
    const unitPrice = getValues(`items.${index}.unitPrice`);
  
  };

  const handleDiscountChange = (
    index: number,
    discount: number,
    setValue: UseFormSetValue<PurchaseOrderFormData>,
    getValues: (name: string) => any
  ) => {
    const quantity = getValues(`items.${index}.quantity`);
    const unitPrice = getValues(`items.${index}.unitPrice`);
    
  };

  return {
    handleProductSelect,
    handleQuantityChange,
    handleDiscountChange,
  };
}