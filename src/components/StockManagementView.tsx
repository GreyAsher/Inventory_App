import React, { useState, useMemo } from 'react';
import { Search, Plus, Warehouse, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Product } from '../types';

interface StockManagementViewProps {
  products: Product[];
  onUpdateStock: (productId: number, newQuantity: number) => void;
}

export const StockManagementView: React.FC<StockManagementViewProps> = ({
  products,
  onUpdateStock,
}) => {
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<'Name' | 'Stock Quantity' | 'Last Updated'>('Name');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantityToAdd, setQuantityToAdd] = useState('10');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      if (!searchText.trim()) return true;
      const term = searchText.toLowerCase();
      return (
        p.productName.toLowerCase().includes(term) ||
        p.categoryName?.toLowerCase().includes(term)
      );
    });

    return result.sort((a, b) => {
      if (sortBy === 'Name') return a.productName.localeCompare(b.productName);
      if (sortBy === 'Stock Quantity') return b.stockQuantity - a.stockQuantity;
      if (sortBy === 'Last Updated')
        return new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime();
      return 0;
    });
  }, [products, searchText, sortBy]);

  const handleOpenAddStock = (product: Product) => {
    setSelectedProduct(product);
    setQuantityToAdd('10');
    setIsModalOpen(true);
  };

  const handleConfirmStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    const addition = parseInt(quantityToAdd, 10) || 0;
    const newTotal = Math.max(0, selectedProduct.stockQuantity + addition);
    onUpdateStock(selectedProduct.id, newTotal);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          Stock Management
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Monitor inventory levels, restock inventory items, and track stock updates
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-[#1E2227] p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Sort by */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium whitespace-nowrap">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADB5] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 cursor-pointer"
          >
            <option value="Name">Name</option>
            <option value="Stock Quantity">Stock Quantity</option>
            <option value="Last Updated">Last Updated</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search stock..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
          />
        </div>
      </div>

      {/* Stock DataGrid */}
      <div className="bg-white dark:bg-[#1E2227] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700 dark:text-gray-300">
            <thead className="bg-[#393E46] dark:bg-[#181A1E] text-white text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-4">Retail Price</th>
                <th className="py-3.5 px-4">Last Updated</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const isOutOfStock = p.stockQuantity === 0;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">{p.productName}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold font-mono text-base ${
                            isOutOfStock ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {p.stockQuantity}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/60">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Out of Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-700 dark:text-gray-300">
                        ₱{p.retailPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-500 dark:text-gray-400">
                        {new Date(p.dateUpdated).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenAddStock(p)}
                          className="px-3 py-1.5 text-xs font-medium bg-[#00ADB5] hover:bg-[#009299] text-white rounded-lg transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Stock</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 dark:text-gray-500">
                    <Warehouse className="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                    No items found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Stock Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1E2227] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between px-6 py-4 bg-[#393E46] dark:bg-[#181A1E] text-white">
              <h2 className="text-lg font-bold">Add Stock: {selectedProduct.productName}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmStock} className="p-6 space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800/60 p-3 rounded-xl border border-gray-100 dark:border-gray-700/60 flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Current Stock Quantity:</span>
                <span className="font-bold text-gray-900 dark:text-gray-100 font-mono text-base">
                  {selectedProduct.stockQuantity} units
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Quantity to Add *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantityToAdd}
                  onChange={(e) => setQuantityToAdd(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                />
              </div>

              <div className="flex gap-2">
                {[5, 10, 25, 50].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuantityToAdd(String(num))}
                    className="flex-1 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md border border-gray-200 dark:border-gray-700 cursor-pointer"
                  >
                    +{num}
                  </button>
                ))}
              </div>

              <div className="bg-teal-50/50 dark:bg-teal-950/30 p-3 rounded-xl border border-teal-100 dark:border-teal-900/50 text-xs text-teal-800 dark:text-teal-300 flex justify-between">
                <span>New Total Stock:</span>
                <span className="font-bold font-mono">
                  {selectedProduct.stockQuantity + (parseInt(quantityToAdd, 10) || 0)} units
                </span>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00ADB5] hover:bg-[#009299] text-white rounded-lg text-sm font-semibold transition-colors shadow-xs"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
