import { unstable_cache } from "next/cache";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";


export const getVendors = async <T extends Prisma.VendorFindManyArgs>(
  args?: Prisma.SelectSubset<T, Prisma.VendorFindManyArgs>
): Promise<Prisma.VendorGetPayload<T>[]> => {

  const cachedQuery = unstable_cache(
    async () => prisma.vendor.findMany(args),
    ['vendors', JSON.stringify(args)],
    { tags: ['vendors'] }
  );

  return cachedQuery();
};


export const getVendorUnique = async <T extends Prisma.VendorFindUniqueArgs>(
  args: Prisma.SelectSubset<T, Prisma.VendorFindUniqueArgs>
): Promise<Prisma.VendorGetPayload<T> | null> => {
  const cachedQuery = unstable_cache(
    () => prisma.vendor.findUnique(args),
    ['vendors', JSON.stringify(args)],
    { tags: ['vendors'] }
  );

  return cachedQuery();
};
