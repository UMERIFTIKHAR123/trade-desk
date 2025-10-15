'use server';

import { unstable_cache } from "next/cache";
import prisma from "./prisma";

export const getCategories = unstable_cache(
  async () => prisma.category.findMany(),
  ["categories"],                 // unique cache key
  { tags: ["categories"] }        // group name for invalidation
);
