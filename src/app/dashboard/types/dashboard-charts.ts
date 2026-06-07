export type RevenueProfitPoint = {
  date: string;
  revenue: number;
  profit: number;
};

export type RevenueProfitRange = "7" | "30" | "90" | "365";

export type CategoryPiePoint = {
  name: string;
  value: number;
  fill: string;
};

export type CategoryBarPoint = {
  name: string;
  count: number;
  fill: string;
};

export type DashboardChartData = {
  revenueProfit: Record<RevenueProfitRange, RevenueProfitPoint[]>;
  categoryPieData: CategoryPiePoint[];
  categoryBarData: CategoryBarPoint[];
};
