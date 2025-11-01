import { unstable_cache } from "next/cache";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

export const getPurchaseOrders = async <T extends Prisma.PurchaseOrderFindManyArgs>(
  args?: Prisma.SelectSubset<T, Prisma.PurchaseOrderFindManyArgs>
): Promise<Prisma.PurchaseOrderGetPayload<T>[]> => {
  const cachedQuery = unstable_cache(
    async () => prisma.purchaseOrder.findMany(args),
    ['purchaseOrders', JSON.stringify(args)],
    { tags: ['purchaseOrders'] }
  );

  return cachedQuery();
};


export const getPurchaseOrderUnique = <T extends Prisma.PurchaseOrderFindUniqueArgs>(
  args: Prisma.SelectSubset<T, Prisma.PurchaseOrderFindUniqueArgs>
): Promise<Prisma.PurchaseOrderGetPayload<T> | null> => {
  const cacheQuery = unstable_cache(
    () => prisma.purchaseOrder.findUnique(args),
    ["purchaseOrderUnique", JSON.stringify(args)],
    { tags: ["purchaseOrderUnique"] }
  );

  return cacheQuery();
};