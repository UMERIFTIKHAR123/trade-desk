import dayjs from "dayjs";
import prisma from "../prisma";
import type { DashboardChartData } from "@/app/dashboard/types/dashboard-charts";

export type { DashboardChartData, RevenueProfitRange } from "@/app/dashboard/types/dashboard-charts";

export const CHART_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

type OrderWithItems = Awaited<
  ReturnType<typeof fetchOrdersWithItems>
>[number];

async function fetchOrdersWithItems() {
  return prisma.purchaseOrder.findMany({
    include: { items: true },
    orderBy: { createdAt: "asc" },
  });
}

function buildRateMap(
  rates: { productId: string; rate: number }[],
): Map<string, number> {
  const totals = new Map<string, { sum: number; count: number }>();

  for (const rate of rates) {
    const current = totals.get(rate.productId) ?? { sum: 0, count: 0 };
    totals.set(rate.productId, {
      sum: current.sum + rate.rate,
      count: current.count + 1,
    });
  }

  return new Map(
    Array.from(totals.entries()).map(([productId, { sum, count }]) => [
      productId,
      sum / count,
    ]),
  );
}

function calculateOrderProfit(
  items: OrderWithItems["items"],
  rateMap: Map<string, number>,
) {
  return items.reduce((sum, item) => {
    const revenue =
      item.quantity *
      item.price *
      (1 - item.dto / 100) *
      (1 + item.iva / 100);
    const vendorRate = rateMap.get(item.productId);
    const cost = vendorRate
      ? vendorRate * item.quantity
      : revenue * 0.65;

    return sum + (revenue - cost);
  }, 0);
}

function formatBucket(date: dayjs.Dayjs, days: number) {
  if (days <= 30) {
    return date.format("MMM D");
  }

  if (days <= 90) {
    return date.startOf("week").format("MMM D");
  }

  return date.format("MMM YYYY");
}

function buildRevenueProfitSeries(
  orders: OrderWithItems[],
  rateMap: Map<string, number>,
  days: number,
) {
  const since = dayjs().subtract(days, "day").startOf("day");
  const buckets = new Map<string, { revenue: number; profit: number }>();

  for (const order of orders) {
    const orderDate = dayjs(order.createdAt);
    if (orderDate.isBefore(since)) {
      continue;
    }

    const key = formatBucket(orderDate, days);
    const current = buckets.get(key) ?? { revenue: 0, profit: 0 };

    buckets.set(key, {
      revenue: current.revenue + order.totalAmount,
      profit: current.profit + calculateOrderProfit(order.items, rateMap),
    });
  }

  return Array.from(buckets.entries()).map(([date, values]) => ({
    date,
    revenue: Math.round(values.revenue * 100) / 100,
    profit: Math.round(values.profit * 100) / 100,
  }));
}

export async function getDashboardChartData() {
  const [orders, categories, vendorRates, orderItems] = await Promise.all([
    fetchOrdersWithItems(),
    prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: { where: { isDeleted: false } },
          },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.vendorProductRate.findMany({
      select: { productId: true, rate: true },
    }),
    prisma.purchaseOrderItem.findMany({
      select: {
        quantity: true,
        product: {
          select: {
            category: {
              select: { name: true },
            },
          },
        },
      },
    }),
  ]);

  const rateMap = buildRateMap(vendorRates);

  const revenueProfit = {
    "7": buildRevenueProfitSeries(orders, rateMap, 7),
    "30": buildRevenueProfitSeries(orders, rateMap, 30),
    "90": buildRevenueProfitSeries(orders, rateMap, 90),
    "365": buildRevenueProfitSeries(orders, rateMap, 365),
  };

  const categoryPieData = categories
    .map((category, index) => ({
      name: category.name,
      value: category._count.products,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }))
    .filter((category) => category.value > 0);

  const salesByCategory = new Map<string, number>();

  for (const item of orderItems) {
    const categoryName = item.product.category.name;
    salesByCategory.set(
      categoryName,
      (salesByCategory.get(categoryName) ?? 0) + item.quantity,
    );
  }

  const categoryBarData = categories.map((category, index) => ({
    name: category.name,
    count: salesByCategory.get(category.name) ?? 0,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));

  return {
    revenueProfit,
    categoryPieData,
    categoryBarData,
  } satisfies DashboardChartData;
}
