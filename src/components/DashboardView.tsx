import React from 'react';
import {
  TrendingUp,
  Package,
  AlertTriangle,
  Truck,
  PlusCircle,
  ShoppingCart,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Product, Invoice, Supplier } from '../types';

interface DashboardViewProps {
  products: Product[];
  invoices: Invoice[];
  suppliers: Supplier[];
  onNavigate: (tab: any) => void;
  onOpenNewInvoice: () => void;
  onOpenAddProduct: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  invoices,
  suppliers,
  onNavigate,
  onOpenNewInvoice,
  onOpenAddProduct,
}) => {
  // Total Sales calculation
  const totalSales = invoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
  const totalProducts = products.length;
  const outOfStock = products.filter((p) => p.stockQuantity === 0).length;
  const totalSuppliers = suppliers.length;

  // Best Selling Products calculation
  const productSalesMap = new Map<string, number>();
  invoices.forEach((inv) => {
    inv.items?.forEach((item) => {
      const current = productSalesMap.get(item.productName) || 0;
      productSalesMap.set(item.productName, current + item.quantity);
    });
  });

  const bestSellingProducts = Array.from(productSalesMap.entries())
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 8);

  // Sales trend by month (last 6 months)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData: { [key: string]: number } = {};

  invoices.forEach((inv) => {
    const d = new Date(inv.dateIssued);
    if (!isNaN(d.getTime())) {
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`;
      monthlyData[key] = (monthlyData[key] || 0) + inv.totalAmount;
    }
  });

  // Ensure default progression if sparse
  const chartData = Object.keys(monthlyData).length > 0
    ? Object.entries(monthlyData).map(([month, sales]) => ({ month, sales }))
    : [
        { month: 'Jan', sales: 9000 },
        { month: 'Feb', sales: 4800 },
        { month: 'Mar', sales: 11400 },
        { month: 'Apr', sales: 8600 },
        { month: 'May', sales: 7350 },
      ];

  return (
    <div className="space-y-6">
      {/* Page Title & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Live metrics and performance for Inventory App</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewInvoice}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#00ADB5] hover:bg-[#009299] text-white rounded-lg font-medium shadow-sm transition-colors text-sm cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>New Invoice</span>
          </button>
          <button
            onClick={onOpenAddProduct}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#393E46] hover:bg-[#222831] text-white rounded-lg font-medium shadow-sm transition-colors text-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div
          onClick={() => onNavigate('sales')}
          className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#00ADB5]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-500">Total Sales</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 tracking-tight">
            ₱{totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center text-xs text-gray-400 mt-2">
            <span>{invoices.length} invoices issued</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1 text-emerald-500" />
          </div>
        </div>

        {/* Total Products */}
        <div
          onClick={() => onNavigate('products')}
          className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#00ADB5]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-500">Total Products</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 tracking-tight">{totalProducts}</div>
          <div className="text-xs text-gray-400 mt-2">In product catalog</div>
        </div>

        {/* Out of Stock */}
        <div
          onClick={() => onNavigate('stock')}
          className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-red-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-500">Out of Stock</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform ${
              outOfStock > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-2xl font-bold tracking-tight ${outOfStock > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {outOfStock}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            {outOfStock > 0 ? 'Urgent restocking needed' : 'All items in stock'}
          </div>
        </div>

        {/* Total Suppliers */}
        <div
          onClick={() => onNavigate('suppliers')}
          className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#00ADB5]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-500">Suppliers</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 tracking-tight">{totalSuppliers}</div>
          <div className="text-xs text-gray-400 mt-2">Active partners & kilns</div>
        </div>
      </div>

      {/* Main Charts & Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Plot Model (OxyPlot style replication) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Analysis Preview</h2>
              <p className="text-xs text-gray-500">Monthly Sales Revenue Trend</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-teal-50 text-[#00ADB5] rounded-md">
              OxyPlot Graph
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <YAxis
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(val) => `₱${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: any) => [`₱${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 'Sales Amount']}
                  contentStyle={{
                    backgroundColor: '#393E46',
                    borderRadius: '8px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#00ADB5' }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  name="Sales"
                  stroke="#00ADB5"
                  strokeWidth={3}
                  dot={{ r: 6, fill: '#00ADB5', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 8, fill: '#393E46', stroke: '#00ADB5', strokeWidth: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Best-Selling Products</h2>
            <span className="text-xs font-medium text-gray-400">Top Units</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {bestSellingProducts.length > 0 ? (
              bestSellingProducts.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100/80 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-[#393E46] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-800 truncate">{p.name}</span>
                  </div>
                  <span className="text-xs font-bold bg-[#00ADB5]/10 text-[#00ADB5] px-2.5 py-1 rounded-full shrink-0">
                    {p.quantity} units
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 py-8 text-center">No sales recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
