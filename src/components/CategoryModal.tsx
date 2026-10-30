import React, { useState } from 'react';
import { X, Plus, Trash2, FolderPlus, Tag } from 'lucide-react';
import { Category, Product } from '../types';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  products: Product[];
  onAddCategory: (categoryName: string) => void;
  onDeleteCategory: (categoryId: number) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  categories,
  products,
  onAddCategory,
  onDeleteCategory,
}) => {
  const [newCatName, setNewCatName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      setError('Please provide a category name');
      return;
    }
    if (categories.some((c) => c.categoryName.toLowerCase() === newCatName.trim().toLowerCase())) {
      setError('A category with this name already exists');
      return;
    }
    onAddCategory(newCatName.trim());
    setNewCatName('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1E2227] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 transition-colors duration-200">
        <div className="flex items-center justify-between px-6 py-4 bg-[#393E46] text-white">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#00ADB5]" />
            <h2 className="text-lg font-bold">Category Management</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Add Category Form */}
          <form onSubmit={handleSubmit} className="space-y-2">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Add New Category
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => {
                  setNewCatName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g., Celadon Ware"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#00ADB5] hover:bg-[#009299] text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </form>

          {/* Existing Categories List */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Existing Categories ({categories.length})
            </label>
            <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              {categories.map((cat) => {
                const productCount = products.filter((p) => p.categoryId === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/60 text-sm"
                  >
                    <div>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{cat.categoryName}</span>
                      <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">({productCount} products)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (productCount > 0) {
                          if (!confirm(`Warning: ${productCount} products are in this category. Delete anyway?`)) {
                            return;
                          }
                        }
                        onDeleteCategory(cat.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 rounded-md transition-colors cursor-pointer"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
