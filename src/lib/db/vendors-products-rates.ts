import { unstable_cache } from "next/cache";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";


export const getVendorProductsRates = async <T extends Prisma.VendorProductRateFindManyArgs>(
  args?: Prisma.SelectSubset<T, Prisma.VendorProductRateFindManyArgs>
): Promise<Prisma.VendorProductRateGetPayload<T>[]> => {

  const cachedQuery = unstable_cache(
    async () => prisma.vendorProductRate.findMany(args),
    ['vendorProductsRates', JSON.stringify(args)],
    { tags: ['vendorProductsRates'] }
  );

  return cachedQuery();
};
