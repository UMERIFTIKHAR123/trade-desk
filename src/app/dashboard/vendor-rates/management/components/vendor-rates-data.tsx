import prisma from "../../../../../../src-old/lib/prisma";
import { redirect } from "next/navigation";
import { VendorInfoCard } from "./vendor-info-card";
import { ProductRatesTable } from "./product-rates-table";
import { AddRateDialog } from "./add-rate-dialog";
import { getVendorUnique } from "@/lib/db/vendors";
import { getVendorProductsRates } from "@/lib/db/vendors-products-rates";
import { getProducts } from "@/lib/db/products";

export async function VendorRatesData({ vendorId }: { vendorId: string }) {
  const vendor = await getVendorWithRates(vendorId);
  const availableProducts = await getAvailableProducts(vendorId);

  if (!vendor) {
    redirect("/dashboard/vendor-rates");
  }

  return (
    <div className="space-y-6">
      <VendorInfoCard vendor={vendor} />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Product Rates</h2>
          <p className="text-muted-foreground">
            Manage pricing for all products from this vendor
          </p>
        </div>
        <AddRateDialog
          vendorId={vendorId}
          availableProducts={availableProducts}
        />
      </div>

      <ProductRatesTable rates={vendor.VendorProductRate} />
    </div>
  );
}

async function getVendorWithRates(vendorId: string) {

  return await getVendorUnique({
    where: { id: vendorId },
    include: {
      VendorProductRate: {
        include: {
          vendor: true,
          product: {
            include: {
              category: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });
}

async function getAvailableProducts(vendorId: string) {
  const existingRates = await getVendorProductsRates({
    where: { vendorId },
    select: { productId: true },
  });

  const excludedIds = existingRates.map((r) => r.productId);

  return await getProducts({
    where: {
      id: { notIn: excludedIds },
      isDeleted: false,
    },
    include: {
      category: true,
    },
    orderBy: { name: "asc" },
  });
}