import {
  Boxes,
  Package,
  ReceiptText,
  TrendingUp,
  Users,
} from "lucide-react";
import { getProductsCount } from "@/lib/db/products";
import prisma from "@/lib/prisma";
import { DashboardStatCard } from "./dashboard-stat-card";
import { DashboardRefreshButton } from "./dashboard-refresh-button";
import { DashboardCharts } from "./dashboard-charts";

async function getDashboardData() {
  const [
    totalProducts,
    totalCustomers,
    totalPurchaseOrders,
    totalCategories,
    totalRevenue,
  ] = await Promise.all([
    getProductsCount({ isDeleted: false }),
    prisma.customer.count(),
    prisma.purchaseOrder.count(),
    prisma.category.count(),
    prisma.purchaseOrder.aggregate({
      _sum: { totalAmount: true },
    }),
  ]);

  const revenue = totalRevenue._sum.totalAmount || 0;
  const averageOrderValue =
    totalPurchaseOrders > 0 ? revenue / totalPurchaseOrders : 0;

  return {
    totalProducts,
    totalCustomers,
    totalPurchaseOrders,
    totalCategories,
    revenue,
    averageOrderValue,
  };
}

export async function DashboardOverview() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Welcome back! Here&apos;s what&apos;s happening with your platform
              today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Updated just now
            </span>
            <DashboardRefreshButton />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-1 lg:overflow-visible">
        <div className="grid min-w-[750px] grid-cols-5 gap-3 lg:min-w-0 lg:w-full">
        <DashboardStatCard
          title="Total Revenue"
          value={`€${data.revenue.toFixed(2)}`}
          href="/dashboard/purchase-orders"
          icon={TrendingUp}
          iconClassName="text-emerald-600"
          iconBgClassName="bg-emerald-50 dark:bg-emerald-950/40"
          footer={
            <>
              Avg. order:{" "}
              <span className="font-semibold text-emerald-600">
                €{data.averageOrderValue.toFixed(2)}
              </span>
            </>
          }
        />

        <DashboardStatCard
          title="Purchase Orders"
          value={data.totalPurchaseOrders}
          href="/dashboard/purchase-orders"
          icon={ReceiptText}
          iconClassName="text-slate-700 dark:text-slate-300"
          iconBgClassName="bg-slate-100 dark:bg-slate-800"
          footer="Total orders placed"
        />

        <DashboardStatCard
          title="Total Products"
          value={data.totalProducts}
          href="/dashboard/products"
          icon={Package}
          iconClassName="text-blue-600"
          iconBgClassName="bg-blue-50 dark:bg-blue-950/40"
          footer="Active in inventory"
        />

        <DashboardStatCard
          title="Total Customers"
          value={data.totalCustomers}
          href="/dashboard/customers"
          icon={Users}
          iconClassName="text-orange-500"
          iconBgClassName="bg-orange-50 dark:bg-orange-950/40"
          footer="Registered on platform"
        />

        <DashboardStatCard
          title="Categories"
          value={data.totalCategories}
          href="/dashboard/categories"
          icon={Boxes}
          iconClassName="text-indigo-600"
          iconBgClassName="bg-indigo-50 dark:bg-indigo-950/40"
          footer="Categories configured"
        />
        </div>
      </div>

      <DashboardCharts />
    </div>
  );
}
