"use client";

import Link from "next/link";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { DashboardChartData } from "@/app/dashboard/types/dashboard-charts";

interface CategoryPieChartProps {
  data: DashboardChartData["categoryPieData"];
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  return (
    <div className="flex h-full flex-col rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Product Categories
        </h2>
        <Link
          href="/dashboard/categories"
          className="text-sm font-medium text-emerald-600 hover:underline"
        >
          Manage
        </Link>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          No categories with products yet.
        </div>
      ) : (
        <>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  strokeWidth={2}
                  stroke="#ffffff"
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                  formatter={(value, _name, item) => {
                    const count = Number(value ?? 0);
                    const name =
                      item && typeof item === "object" && "payload" in item
                        ? (item.payload as { name?: string }).name
                        : "Category";

                    return [`${count} products`, name ?? "Category"];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 max-h-[140px] space-y-2 overflow-y-auto pr-1">
            {data.map((category) => (
              <div
                key={category.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: category.fill }}
                  />
                  <span className="truncate text-foreground">
                    {category.name}
                  </span>
                </div>
                <span className="shrink-0 font-semibold text-foreground">
                  {category.value}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
