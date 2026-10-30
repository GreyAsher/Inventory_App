import React, { useState, useMemo } from 'react';
import { Download, TrendingUp, Users, Award, FileSpreadsheet, Search } from 'lucide-react';
import { Invoice, Customer, Product } from '../types';

interface ReportViewProps {
  invoices: Invoice[];
  customers: Customer[];
  products: Product[];
}

export const ReportView: React.FC<ReportViewProps> = ({
  invoices,
  customers,
  products,
}) => {
  const [sortBy, setSortBy] = useState<'Date' | 'Total Amount' | 'Customer Name'>('Date');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Total Sales
  const totalSales = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

  // 2. Total Customers
  const totalCustomers = customers.length;

  // 3. Best-Selling Product
  const productQuantityMap = new Map<string, number>();
  invoices.forEach((inv) => {
    inv.items?.forEach((item) => {
      const cur = productQuantityMap.get(item.productName) || 0;
      productQuantityMap.set(item.productName, cur + item.quantity);
    });
  });

  let bestSellingProduct = 'None';
  let maxQty = 0;
  productQuantityMap.forEach((qty, name) => {
    if (qty > maxQty) {
      maxQty = qty;
      bestSellingProduct = `${name} (${qty} units)`;
    }
  });

  // Filtered & Sorted Invoices
  const sortedInvoices = useMemo(() => {
    let result = invoices.filter((inv) => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        inv.customerName?.toLowerCase().includes(term) ||
        inv.invoiceNumber?.toLowerCase().includes(term)
      );
    });

    return result.sort((a, b) => {
      if (sortBy === 'Date')
        return new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime();
      if (sortBy === 'Total Amount') return b.totalAmount - a.totalAmount;
      if (sortBy === 'Customer Name')
        return (a.customerName || '').localeCompare(b.customerName || '');
      return 0;
    });
  }, [invoices, searchTerm, sortBy]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Invoice Number', 'Customer Name', 'Total Amount', 'Date Issued', 'Status'];
    const rows = sortedInvoices.map((inv) => [
      inv.invoiceNumber,
      `"${inv.customerName.replace(/"/g, '""')}"`,
      inv.totalAmount.toFixed(2),
      new Date(inv.dateIssued).toLocaleDateString(),
      'Completed',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `porcelain-sales-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Sales and Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Aggregated revenue, customer order frequencies, and transaction summaries
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#00ADB5] hover:bg-[#009299] text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-xs w-fit"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* 3 Summary Cards Layout (Matching ReportControl.xaml 3 Cards Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs text-center flex flex-col justify-center items-center">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-gray-700">Total Sales</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1 font-mono">
            ₱{totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs text-center flex flex-col justify-center items-center">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-gray-700">Total Customers</span>
          <div className="text-2xl font-bold text-blue-600 mt-1 font-mono">
            {totalCustomers}
          </div>
        </div>

        {/* Best-Selling Product */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs text-center flex flex-col justify-center items-center">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-gray-700">Best-Selling Product</span>
          <div className="text-sm sm:text-base font-semibold text-gray-900 mt-1 truncate max-w-full px-2">
            {bestSellingProduct}
          </div>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium whitespace-nowrap">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADB5] bg-white cursor-pointer"
          >
            <option value="Date">Date</option>
            <option value="Total Amount">Total Amount</option>
            <option value="Customer Name">Customer Name</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reports..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
          />
        </div>
      </div>

      {/* Sales Transactions Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-[#393E46] text-white text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Invoice No.</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedInvoices.length > 0 ? (
                sortedInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gray-800">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{inv.customerName}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600">
                      ₱{inv.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500">
                      {new Date(inv.dateIssued).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <FileSpreadsheet className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    No sales records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
