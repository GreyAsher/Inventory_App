import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, Truck, X, Phone, MapPin, Calendar } from 'lucide-react';
import { Supplier } from '../types';

interface SupplierViewProps {
  suppliers: Supplier[];
  onAddSupplier: (supplier: Omit<Supplier, 'id' | 'dateAdded'>) => void;
  onUpdateSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (supplierId: number) => void;
}

export const SupplierView: React.FC<SupplierViewProps> = ({
  suppliers,
  onAddSupplier,
  onUpdateSupplier,
  onDeleteSupplier,
}) => {
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<'Name' | 'Date Added'>('Name');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const [formData, setFormData] = useState({
    supplierName: '',
    contactNumber: '',
    address: '',
  });

  const filteredSuppliers = useMemo(() => {
    let result = suppliers.filter((s) => {
      if (!searchText.trim()) return true;
      const term = searchText.toLowerCase();
      return (
        s.supplierName.toLowerCase().includes(term) ||
        s.address.toLowerCase().includes(term) ||
        s.contactNumber.toLowerCase().includes(term)
      );
    });

    return result.sort((a, b) => {
      if (sortBy === 'Name') return a.supplierName.localeCompare(b.supplierName);
      if (sortBy === 'Date Added')
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      return 0;
    });
  }, [suppliers, searchText, sortBy]);

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setFormData({ supplierName: '', contactNumber: '', address: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Supplier) => {
    setEditingSupplier(s);
    setFormData({
      supplierName: s.supplierName,
      contactNumber: s.contactNumber,
      address: s.address,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplierName.trim()) return;

    if (editingSupplier) {
      onUpdateSupplier({
        ...editingSupplier,
        supplierName: formData.supplierName.trim(),
        contactNumber: formData.contactNumber.trim(),
        address: formData.address.trim(),
      });
    } else {
      onAddSupplier({
        supplierName: formData.supplierName.trim(),
        contactNumber: formData.contactNumber.trim(),
        address: formData.address.trim(),
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          Supplier Management
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Kiln studios, porcelain suppliers, and trade distributors
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-[#1E2227] p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#007FFF] hover:bg-[#006ee0] text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-xs w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Supplier</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADB5] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 cursor-pointer"
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
              placeholder="Search supplier..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
            />
          </div>
        </div>
      </div>

      {/* Supplier Table */}
      <div className="bg-white dark:bg-[#1E2227] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700 dark:text-gray-300">
            <thead className="bg-[#393E46] dark:bg-[#181A1E] text-white text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Supplier Name</th>
                <th className="py-3.5 px-4">Contact Number</th>
                <th className="py-3.5 px-4">Address</th>
                <th className="py-3.5 px-4">Date Added</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">{s.supplierName}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300 font-mono">
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {s.contactNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        {s.address}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500 dark:text-gray-400">
                      {new Date(s.dateAdded).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="px-2.5 py-1.5 text-xs font-medium bg-[#00ADB5]/10 dark:bg-[#00ADB5]/20 text-[#00ADB5] hover:bg-[#00ADB5] hover:text-white rounded-md transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 inline mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete supplier ${s.supplierName}?`)) {
                              onDeleteSupplier(s.id);
                            }
                          }}
                          className="px-2.5 py-1.5 text-xs font-medium bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white rounded-md transition-colors cursor-pointer"
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
                  <td colSpan={5} className="py-12 text-center text-gray-400 dark:text-gray-500">
                    <Truck className="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                    No suppliers found matching your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1E2227] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between px-6 py-4 bg-[#393E46] dark:bg-[#181A1E] text-white">
              <h2 className="text-lg font-bold">
                {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
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
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Supplier Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.supplierName}
                  onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                  placeholder="e.g., Jingdezhen Porcelain Crafts Ltd"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Contact Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="+63 917 888 3321"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="148 Pottery Lane, Binondo, Manila"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                />
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
                  className="px-5 py-2 bg-[#007FFF] hover:bg-[#006ee0] text-white rounded-lg text-sm font-semibold transition-colors shadow-xs"
                >
                  {editingSupplier ? 'Save Changes' : 'Save Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
