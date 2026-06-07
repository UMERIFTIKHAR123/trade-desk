import { DUMMY_DASHBOARD_CHART_DATA } from "../data/dummy-chart-data";
import { RevenueProfitChart } from "./revenue-profit-chart";
import { CategoryPieChart } from "./category-pie-chart";
import { CategoryBarChart } from "./category-bar-chart";

export function DashboardCharts() {
  const chartData = DUMMY_DASHBOARD_CHART_DATA;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueProfitChart data={chartData.revenueProfit} />
        </div>
        <div className="xl:col-span-1">
          <CategoryPieChart data={chartData.categoryPieData} />
        </div>
      </div>

      <CategoryBarChart data={chartData.categoryBarData} />
    </div>
  );
}
