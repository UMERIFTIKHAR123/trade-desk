import { unstable_cache } from "next/cache";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

export const getProducts = async <T extends Prisma.ProductFindManyArgs>(
  args?: Prisma.SelectSubset<T, Prisma.ProductFindManyArgs>
): Promise<Prisma.ProductGetPayload<T>[]> => {
  const cachedQuery = unstable_cache(
    async () => prisma.product.findMany(args),
    ['products', JSON.stringify(args)],
    { tags: ['products'] }
  );

  return cachedQuery();
};

export const getProductUnique = async <T extends Prisma.ProductFindUniqueArgs>(
  args: Prisma.SelectSubset<T, Prisma.ProductFindUniqueArgs>
): Promise<Prisma.ProductGetPayload<T> | null> => {
  const cachedQuery = unstable_cache(
    () => prisma.product.findUnique(args),
    ['productUnique', JSON.stringify(args)],
    { tags: ['productUnique'] }
  );

  return cachedQuery();
};
