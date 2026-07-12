import SEO from "../../components/SEO";
import Charts from "./Charts";
import StatusOrders from "./StatusOrders";
import SalesInsights from "./SalesInsights";
import TopRatedCustomers from "./TopRatedCustomers";

export interface SalesInsightsType {
  totalSales: number;
  totalOrders: number;
  mostSpent: number;
  activeCustomers: number;
}

function Insights() {
  return (
    <div className="w-full">
      <SEO title="Insights" description="View sales and performance insights." />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900">
          Dashboard Insights
        </h1>
        <select className="px-3 py-2 rounded-lg border border-surface-300 bg-white text-sm text-surface-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="day">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <SalesInsights />
      <StatusOrders />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="p-4 sm:p-6 border border-surface-200 bg-white rounded-xl">
          <Charts />
        </div>
        <div className="p-4 sm:p-6 border border-surface-200 bg-white rounded-xl">
          <TopRatedCustomers />
        </div>
      </div>
    </div>
  );
}

export default Insights;
