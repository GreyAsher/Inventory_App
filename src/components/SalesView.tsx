import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Eye,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  X,
  Printer,
  CheckCircle,
  PackageCheck,
  User,
} from 'lucide-react';
import { Invoice, Product, Customer } from '../types';

interface SalesViewProps {
  invoices: Invoice[];
  products: Product[];
  customers: Customer[];
  onAddInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  onDeleteInvoice: (invoiceId: number) => void;
  onDeductStock: (items: { productId: number; quantity: number }[]) => void;
}

interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  maxStock: number;
}

export const SalesView: React.FC<SalesViewProps> = ({
  invoices,
  products,
  customers,
  onAddInvoice,
  onDeleteInvoice,
  onDeductStock,
}) => {
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<'Date' | 'Total Amount' | 'Customer Name'>('Date');

  // New Invoice Modal flow
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customCustomerName, setCustomCustomerName] = useState<string>('');
  const [productSearch, setProductSearch] = useState('');

  // View Receipt Modal
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  // Filtered & sorted invoice transactions
  const filteredInvoices = useMemo(() => {
    let result = invoices.filter((inv) => {
      if (!searchText.trim()) return true;
      const term = searchText.toLowerCase();
      return (
        inv.customerName?.toLowerCase().includes(term) ||
        inv.invoiceNumber?.toLowerCase().includes(term) ||
        inv.totalAmount.toString().includes(term)
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
  }, [invoices, searchText, sortBy]);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    if (product.stockQuantity <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stockQuantity) return prev;
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            productName: product.productName,
            price: product.retailPrice,
            quantity: 1,
            maxStock: product.stockQuantity,
          },
        ];
      }
    });
  };

  const handleDecrementCart = (productId: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((item) => item.productId !== productId);
      }
      return prev.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleProceedToConfirm = () => {
    if (cart.length === 0) return;
    setIsConfirmOpen(true);
  };

  const handleFinalConfirmInvoice = () => {
    let customerName = customCustomerName.trim();
    let custId: number | undefined = undefined;

    if (selectedCustomerId) {
      const found = customers.find((c) => c.id === Number(selectedCustomerId));
      if (found) {
        customerName = found.fullName;
        custId = found.id;
      }
    }

    if (!customerName) {
      customerName = 'Walk-in Customer';
    }

    const nextId = invoices.length > 0 ? Math.max(...invoices.map((i) => i.id)) + 1 : 1;
    const invoiceNumber = `INV-${(1000 + nextId).toString()}`;

    const newInvoice: Omit<Invoice, 'id'> = {
      invoiceNumber,
      customerId: custId,
      customerName,
      totalAmount: cartTotal,
      dateIssued: new Date().toISOString(),
      items: cart.map((item, idx) => ({
        id: idx + 1,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    // Deduct stock in catalog
    onDeductStock(cart.map((c) => ({ productId: c.productId, quantity: c.quantity })));
    // Add invoice
    onAddInvoice(newInvoice);

    // Reset and open receipt view
    setCart([]);
    setSelectedCustomerId('');
    setCustomCustomerName('');
    setIsConfirmOpen(false);
    setIsNewInvoiceOpen(false);
    setViewingInvoice({
      id: nextId,
      ...newInvoice,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Sales Transactions
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Create new sales invoices, track receipts, and manage transaction history
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* New Invoice Button */}
        <button
          onClick={() => {
            setCart([]);
            setSelectedCustomerId('');
            setCustomCustomerName('');
            setIsNewInvoiceOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#007FFF] hover:bg-[#006ee0] text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-xs w-fit"
        >
          <FileText className="w-4 h-4" />
          <span>New Invoice</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
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
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search invoice or customer..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
            />
          </div>
        </div>
      </div>

      {/* Sales Transactions DataGrid */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-[#393E46] text-white text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Invoice No.</th>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Total Price</th>
                <th className="py-3.5 px-4">Date Purchased</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gray-800">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{inv.customerName}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600">
                      ₱{inv.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500">
                      {new Date(inv.dateIssued).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setViewingInvoice(inv)}
                          className="px-2.5 py-1.5 text-xs font-semibold bg-[#00ADB5]/10 text-[#00ADB5] hover:bg-[#00ADB5] hover:text-white rounded-md transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 inline mr-1" />
                          View Info
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete invoice ${inv.invoiceNumber}?`)) {
                              onDeleteInvoice(inv.id);
                            }
                          }}
                          className="px-2.5 py-1.5 text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    No sales invoices recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Add New Invoice (Product & Cart Selection) */}
      {isNewInvoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden border border-gray-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 bg-[#393E46] text-white">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#00ADB5]" />
                <h2 className="text-lg font-bold">Add New Invoice</h2>
              </div>
              <button
                onClick={() => setIsNewInvoiceOpen(false)}
                className="p-1 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Product Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Filter available products..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                />
              </div>

              {/* Product Selection List */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase">
                  Available Catalog Items
                </div>
                <div className="max-h-48 overflow-y-auto divide-y divide-gray-100">
                  {products
                    .filter((p) =>
                      productSearch ? p.productName.toLowerCase().includes(productSearch.toLowerCase()) : true
                    )
                    .map((p) => (
                      <div
                        key={p.id}
                        className="px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 text-sm"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-gray-900 truncate">{p.productName}</p>
                          <p className="text-xs text-gray-500">
                            ₱{p.retailPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} • Stock: {p.stockQuantity}
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={p.stockQuantity <= 0}
                          onClick={() => handleAddToCart(p)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                            p.stockQuantity > 0
                              ? 'bg-[#00ADB5] hover:bg-[#009299] text-white shadow-2xs'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Cart Box */}
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/60">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                    <ShoppingCart className="w-4 h-4 text-[#00ADB5]" />
                    <span>Cart ({cartItemCount} items)</span>
                  </h3>
                  {cart.length > 0 && (
                    <button
                      onClick={() => setCart([])}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {cart.length > 0 ? (
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-gray-200 shadow-2xs text-sm"
                      >
                        <div className="truncate pr-2">
                          <p className="font-semibold text-gray-900 truncate">{item.productName}</p>
                          <p className="text-xs text-gray-500 font-mono">
                            ₱{item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleDecrementCart(item.productId)}
                            className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-bold font-mono text-sm">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            disabled={item.quantity >= item.maxStock}
                            onClick={() => {
                              const prod = products.find((p) => p.id === item.productId);
                              if (prod) handleAddToCart(prod);
                            }}
                            className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                              item.quantity < item.maxStock
                                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                            }`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold text-gray-800 text-sm ml-2 w-20 text-right">
                            ₱{(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-center text-gray-400 py-6">
                    Cart is empty. Add products from the catalog above.
                  </p>
                )}
              </div>

              {/* Total Amount Banner */}
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-sm font-bold text-gray-800">Total Amount:</span>
                <span className="text-xl font-bold font-mono text-emerald-600">
                  ₱{cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsNewInvoiceOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={handleProceedToConfirm}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-xs ${
                  cart.length > 0
                    ? 'bg-[#007FFF] hover:bg-[#006ee0] text-white cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Confirm Invoice (Customer Entry & Finalization) */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 bg-[#393E46] text-white">
              <h2 className="text-lg font-bold">Confirm Invoice</h2>
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="p-1 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Customer Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Customer Name *
                </label>
                <div className="space-y-2">
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => {
                      setSelectedCustomerId(e.target.value);
                      if (e.target.value) setCustomCustomerName('');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADB5] bg-white"
                  >
                    <option value="">-- Choose Existing Customer --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fullName} ({c.contactNumber || c.email})
                      </option>
                    ))}
                  </select>

                  {!selectedCustomerId && (
                    <input
                      type="text"
                      value={customCustomerName}
                      onChange={(e) => setCustomCustomerName(e.target.value)}
                      placeholder="Or enter new / walk-in customer name..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                    />
                  )}
                </div>
              </div>

              {/* Invoice Summary */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-700 font-semibold uppercase">
                    <tr>
                      <th className="p-2.5">Product Name</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Price</th>
                      <th className="p-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {cart.map((item) => (
                      <tr key={item.productId}>
                        <td className="p-2.5 font-medium text-gray-900">{item.productName}</td>
                        <td className="p-2.5 text-center font-mono">{item.quantity}</td>
                        <td className="p-2.5 text-right font-mono text-gray-600">
                          ₱{item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-gray-900">
                          ₱{(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Banner */}
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-base font-bold text-gray-800">Total Amount:</span>
                <span className="text-2xl font-bold font-mono text-emerald-600">
                  ₱{cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                >
                  Back to Cart
                </button>
                <button
                  type="button"
                  onClick={handleFinalConfirmInvoice}
                  className="px-5 py-2 bg-[#007FFF] hover:bg-[#006ee0] text-white rounded-lg text-sm font-semibold transition-colors shadow-xs"
                >
                  Confirm & Issue Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Invoice Info / Printable Receipt (Matching InvoiceInfoWindow.xaml) */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-200 flex flex-col">
            {/* Header with Print */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#393E46] text-white no-print">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#00ADB5]" />
                <h2 className="text-lg font-bold">Invoice Receipt</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  title="Print Invoice"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewingInvoice(null)}
                  className="p-1 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Area */}
            <div className="p-8 space-y-6 text-gray-900 bg-white">
              {/* Receipt Header */}
              <div className="text-center border-b border-gray-200 pb-4">
                <div className="text-3xl mb-1">🏺</div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900">Inventory App</h1>
                <p className="text-xs text-gray-500">Fine Ceramics & Pottery Inventory</p>
                <p className="text-xs font-mono text-gray-400 mt-1">Invoice #{viewingInvoice.invoiceNumber}</p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div>
                  <span className="block text-xs font-semibold text-gray-500 uppercase">Customer Name</span>
                  <span className="font-bold text-gray-900">{viewingInvoice.customerName}</span>
                </div>
                <div className="text-right">
                  <span className="block text-xs font-semibold text-gray-500 uppercase">Date Purchased</span>
                  <span className="font-medium text-gray-700">
                    {new Date(viewingInvoice.dateIssued).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#393E46] text-white text-xs font-semibold uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Product Name</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Price</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {viewingInvoice.items?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="py-2.5 px-3 font-medium text-gray-900">{item.productName}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-gray-600">
                          ₱{item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-gray-900">
                          ₱{(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-center pt-2 border-t-2 border-gray-200">
                <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold font-mono text-emerald-600">
                  ₱{viewingInvoice.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="text-center text-xs text-gray-400 pt-4 border-t border-dashed border-gray-200">
                Thank you for your business! Inventory App.
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2 no-print">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 bg-[#00ADB5] hover:bg-[#009299] text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingInvoice(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
