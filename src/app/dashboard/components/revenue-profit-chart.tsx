"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DashboardChartData,
  RevenueProfitRange,
} from "@/app/dashboard/types/dashboard-charts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const ranges: { label: string; value: RevenueProfitRange }[] = [
  { label: "7 Days", value: "7" },
  { label: "30 Days", value: "30" },
  { label: "90 Days", value: "90" },
  { label: "1 Year", value: "365" },
];

interface RevenueProfitChartProps {
  data: DashboardChartData["revenueProfit"];
}

export function RevenueProfitChart({ data }: RevenueProfitChartProps) {
  const [range, setRange] = useState<RevenueProfitRange>("30");
  const chartData = data[range];

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Revenue &amp; Profit
          </h2>
          <p className="text-sm text-muted-foreground">
            Monthly performance overview
          </p>
        </div>

        <ToggleGroup
          type="single"
          value={range}
          onValueChange={(value) => {
            if (value) {
              setRange(value as RevenueProfitRange);
            }
          }}
          className="rounded-lg border bg-muted/40 p-1"
        >
          {ranges.map((item) => (
            <ToggleGroupItem
              key={item.value}
              value={item.value}
              className="px-3 text-xs data-[state=on]:bg-background data-[state=on]:shadow-sm"
            >
              {item.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="h-[280px] w-full">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No revenue data for this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.03} />
                </linearGradient>
                <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e3a5f" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#1e3a5f" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#6b7280" }}
                minTickGap={24}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#6b7280" }}
                width={48}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                  fontSize: "12px",
                }}
                formatter={(value, name) => {
                  const amount = Number(value ?? 0);
                  return [
                    `€${amount.toFixed(2)}`,
                    name === "revenue" ? "Revenue" : "Profit",
                  ];
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) =>
                  value === "revenue" ? "Revenue (€)" : "Profit (€)"
                }
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#revenueFill)"
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#1e3a5f"
                strokeWidth={2}
                fill="url(#profitFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <Link
          href="/dashboard/purchase-orders"
          className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:underline"
        >
          View Financial Analytics
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
