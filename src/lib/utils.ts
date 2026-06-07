import { clsx, type ClassValue } from "clsx"
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, locale: string = 'en-US', currency: string = 'EUR') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date: Date) {
  return dayjs(date).format("DD-MM-YYYY hh:mm a")
}

export function formatPurchaseOrderNo(orderNo: number) {
  return orderNo.toString().padStart(4, '0')
}