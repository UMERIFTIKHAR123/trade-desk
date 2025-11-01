'use server';

import { unstable_cache } from "next/cache";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

export const getCategories = async <T extends Prisma.CategoryFindManyArgs>(
  args?: Prisma.SelectSubset<T, Prisma.CategoryFindManyArgs>
): Promise<Prisma.CategoryGetPayload<T>[]> => {

  const cachedQuery = unstable_cache(
    async () => prisma.category.findMany(args),
    ['categories', JSON.stringify(args)],
    { tags: ['categories'] }
  );

  return cachedQuery();
};


export const getCategoryUnique = async <T extends Prisma.CategoryFindUniqueArgs>(
  args: Prisma.SelectSubset<T, Prisma.CategoryFindUniqueArgs>
): Promise<Prisma.CategoryGetPayload<T> | null> => {
  const cachedQuery = unstable_cache(
    () => prisma.category.findUnique(args),
    ['categoryUnique', JSON.stringify(args)],
    { tags: ['categoryUnique'] }
  );

  return cachedQuery();
};