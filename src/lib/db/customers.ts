import { unstable_cache } from "next/cache";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";



export const getCustomers = async <T extends Prisma.CustomerFindManyArgs>(
  args?: Prisma.SelectSubset<T, Prisma.CustomerFindManyArgs>
): Promise<Prisma.CustomerGetPayload<T>[]> => {

  const cachedQuery = unstable_cache(
    async () => prisma.customer.findMany(args),
    ['customers', JSON.stringify(args)],
    { tags: ['customers'] }
  );

  return cachedQuery();
};


export const getCustomerUnique = async <T extends Prisma.CustomerFindUniqueArgs>(
  args: Prisma.SelectSubset<T, Prisma.CustomerFindUniqueArgs>
): Promise<Prisma.CustomerGetPayload<T> | null> => {
  const cachedQuery = unstable_cache(
    () => prisma.customer.findUnique(args),
    ['customerUnique', JSON.stringify(args)],
    { tags: ['customerUnique'] }
  );

  return cachedQuery();
};