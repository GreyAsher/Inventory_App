import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ProductView } from './components/ProductView';
import { StockManagementView } from './components/StockManagementView';
import { SupplierView } from './components/SupplierView';
import { CustomerView } from './components/CustomerView';
import { SalesView } from './components/SalesView';
import { ReportView } from './components/ReportView';
import { LoginModal } from './components/LoginModal';
import {
  Product,
  Category,
  Customer,
  Supplier,
  Invoice,
} from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_CUSTOMERS,
  INITIAL_SUPPLIERS,
  INITIAL_INVOICES,
} from './data/initialData';
import { RotateCcw } from 'lucide-react';

export function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem('porcelain_user') || 'Admin';
  });

  // Current Navigation Tab
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Stored state with local storage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('porcelain_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('porcelain_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('porcelain_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('porcelain_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('porcelain_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  // Save to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem('porcelain_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('porcelain_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('porcelain_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('porcelain_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('porcelain_invoices', JSON.stringify(invoices));
  }, [invoices]);

  const handleLogin = (user: string) => {
    setCurrentUser(user);
    localStorage.setItem('porcelain_user', user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('porcelain_user');
  };

  // Reset to sample initial state
  const handleResetData = () => {
    if (confirm('Reset all catalog, customer, and sales records to original demo data?')) {
      setProducts(INITIAL_PRODUCTS);
      setCategories(INITIAL_CATEGORIES);
      setCustomers(INITIAL_CUSTOMERS);
      setSuppliers(INITIAL_SUPPLIERS);
      setInvoices(INITIAL_INVOICES);
    }
  };

  // Products CRUD
  const handleAddProduct = (
    data: Omit<Product, 'id' | 'dateAdded' | 'dateUpdated' | 'stockStatus'>
  ) => {
    const nextId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...data,
      id: nextId,
      dateAdded: now,
      dateUpdated: now,
      stockStatus: data.stockQuantity > 0 ? 'In Stock' : 'Out of Stock',
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Category CRUD
  const handleAddCategory = (categoryName: string) => {
    const nextId = categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1;
    setCategories((prev) => [...prev, { id: nextId, categoryName }]);
  };

  const handleDeleteCategory = (categoryId: number) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  // Stock update
  const handleUpdateStock = (productId: number, newQuantity: number) => {
    const now = new Date().toISOString();
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              stockQuantity: newQuantity,
              stockStatus: newQuantity > 0 ? 'In Stock' : 'Out of Stock',
              dateUpdated: now,
            }
          : p
      )
    );
  };

  // Stock deduction for orders
  const handleDeductStock = (items: { productId: number; quantity: number }[]) => {
    const now = new Date().toISOString();
    setProducts((prev) =>
      prev.map((p) => {
        const orderItem = items.find((item) => item.productId === p.id);
        if (orderItem) {
          const newQty = Math.max(0, p.stockQuantity - orderItem.quantity);
          return {
            ...p,
            stockQuantity: newQty,
            stockStatus: newQty > 0 ? 'In Stock' : 'Out of Stock',
            dateUpdated: now,
          };
        }
        return p;
      })
    );
  };

  // Customer CRUD
  const handleAddCustomer = (c: Omit<Customer, 'id' | 'dateAdded'>) => {
    const nextId = customers.length > 0 ? Math.max(...customers.map((item) => item.id)) + 1 : 1;
    const newCust: Customer = {
      ...c,
      id: nextId,
      dateAdded: new Date().toISOString(),
    };
    setCustomers((prev) => [newCust, ...prev]);
  };

  const handleUpdateCustomer = (c: Customer) => {
    setCustomers((prev) => prev.map((item) => (item.id === c.id ? c : item)));
  };

  const handleDeleteCustomer = (customerId: number) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
  };

  // Supplier CRUD
  const handleAddSupplier = (s: Omit<Supplier, 'id' | 'dateAdded'>) => {
    const nextId = suppliers.length > 0 ? Math.max(...suppliers.map((item) => item.id)) + 1 : 1;
    const newSupp: Supplier = {
      ...s,
      id: nextId,
      dateAdded: new Date().toISOString(),
    };
    setSuppliers((prev) => [newSupp, ...prev]);
  };

  const handleUpdateSupplier = (s: Supplier) => {
    setSuppliers((prev) => prev.map((item) => (item.id === s.id ? s : item)));
  };

  const handleDeleteSupplier = (supplierId: number) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== supplierId));
  };

  // Invoice CRUD
  const handleAddInvoice = (inv: Omit<Invoice, 'id'>) => {
    const nextId = invoices.length > 0 ? Math.max(...invoices.map((i) => i.id)) + 1 : 1;
    setInvoices((prev) => [{ ...inv, id: nextId }, ...prev]);
  };

  const handleDeleteInvoice = (invoiceId: number) => {
    setInvoices((prev) => prev.filter((i) => i.id !== invoiceId));
  };

  if (!currentUser) {
    return <LoginModal onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-[#F4F6F9]">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        {/* Top bar with quick demo reset */}
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700 capitalize">
              {currentTab === 'dashboard' ? 'Overview' : currentTab}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetData}
              title="Reset Sample Data"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
            <div className="h-4 w-px bg-gray-300" />
            <div className="text-xs text-gray-500">
              Inventory App v1.0
            </div>
          </div>
        </header>

        {/* Dynamic Views */}
        <div className="p-6 md:p-8 flex-1">
          {currentTab === 'dashboard' && (
            <DashboardView
              products={products}
              invoices={invoices}
              suppliers={suppliers}
              onNavigate={setCurrentTab}
              onOpenNewInvoice={() => setCurrentTab('sales')}
              onOpenAddProduct={() => setCurrentTab('products')}
            />
          )}

          {currentTab === 'products' && (
            <ProductView
              products={products}
              categories={categories}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          )}

          {currentTab === 'stock' && (
            <StockManagementView
              products={products}
              onUpdateStock={handleUpdateStock}
            />
          )}

          {currentTab === 'suppliers' && (
            <SupplierView
              suppliers={suppliers}
              onAddSupplier={handleAddSupplier}
              onUpdateSupplier={handleUpdateSupplier}
              onDeleteSupplier={handleDeleteSupplier}
            />
          )}

          {currentTab === 'customers' && (
            <CustomerView
              customers={customers}
              invoices={invoices}
              onAddCustomer={handleAddCustomer}
              onUpdateCustomer={handleUpdateCustomer}
              onDeleteCustomer={handleDeleteCustomer}
            />
          )}

          {currentTab === 'sales' && (
            <SalesView
              invoices={invoices}
              products={products}
              customers={customers}
              onAddInvoice={handleAddInvoice}
              onDeleteInvoice={handleDeleteInvoice}
              onDeductStock={handleDeductStock}
            />
          )}

          {currentTab === 'reports' && (
            <ReportView
              invoices={invoices}
              customers={customers}
              products={products}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
