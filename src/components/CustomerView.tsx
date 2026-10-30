import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, Users, X, Mail, Phone, Calendar } from 'lucide-react';
import { Customer, Invoice } from '../types';

interface CustomerViewProps {
  customers: Customer[];
  invoices: Invoice[];
  onAddCustomer: (customer: Omit<Customer, 'id' | 'dateAdded'>) => void;
  onUpdateCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: number) => void;
}

export const CustomerView: React.FC<CustomerViewProps> = ({
  customers,
  invoices,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
}) => {
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<'Name' | 'Date Added'>('Name');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
  });

  const filteredCustomers = useMemo(() => {
    let result = customers.filter((c) => {
      if (!searchText.trim()) return true;
      const term = searchText.toLowerCase();
      return (
        c.fullName.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.contactNumber.toLowerCase().includes(term)
      );
    });

    return result.sort((a, b) => {
      if (sortBy === 'Name') return a.fullName.localeCompare(b.fullName);
      if (sortBy === 'Date Added')
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      return 0;
    });
  }, [customers, searchText, sortBy]);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({ fullName: '', contactNumber: '', email: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Customer) => {
    setEditingCustomer(c);
    setFormData({
      fullName: c.fullName,
      contactNumber: c.contactNumber,
      email: c.email,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;

    if (editingCustomer) {
      onUpdateCustomer({
        ...editingCustomer,
        fullName: formData.fullName.trim(),
        contactNumber: formData.contactNumber.trim(),
        email: formData.email.trim(),
      });
    } else {
      onAddCustomer({
        fullName: formData.fullName.trim(),
        contactNumber: formData.contactNumber.trim(),
        email: formData.email.trim(),
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Customer Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Client directory, contact info, and purchase histories
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#007FFF] hover:bg-[#006ee0] text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-xs w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADB5] bg-white cursor-pointer"
            >
              <option value="Name">Name</option>
              <option value="Date Added">Date Added</option>
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search customer..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
            />
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-[#393E46] text-white text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Date Added</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => {
                  const customerOrders = invoices.filter(
                    (inv) => inv.customerId === c.id || inv.customerName.toLowerCase() === c.fullName.toLowerCase()
                  );
                  return (
                    <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-gray-900">{c.fullName}</td>
                      <td className="py-3 px-4 text-gray-600">
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          {c.email || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-mono">
                        <span className="inline-flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {c.contactNumber || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                          {customerOrders.length} orders
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-500">
                        {new Date(c.dateAdded).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(c)}
                            className="px-2.5 py-1.5 text-xs font-medium bg-[#00ADB5]/10 text-[#00ADB5] hover:bg-[#00ADB5] hover:text-white rounded-md transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5 inline mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete customer ${c.fullName}?`)) {
                                onDeleteCustomer(c.id);
                              }
                            }}
                            className="px-2.5 py-1.5 text-xs font-medium bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-md transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    No customers found matching search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 bg-[#393E46] text-white">
              <h2 className="text-lg font-bold">
                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g., Maria Santos"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="+63 917 123 4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="customer@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#007FFF] hover:bg-[#006ee0] text-white rounded-lg text-sm font-semibold transition-colors shadow-xs"
                >
                  {editingCustomer ? 'Save Changes' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
