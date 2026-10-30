import React, { useState, useMemo } from 'react';
import {
  Plus,
  FolderTree,
  Search,
  Edit2,
  Trash2,
  Image as ImageIcon,
  X,
  Package,
} from 'lucide-react';
import { Product, Category } from '../types';
import { CategoryModal } from './CategoryModal';

interface ProductViewProps {
  products: Product[];
  categories: Category[];
  onAddProduct: (product: Omit<Product, 'id' | 'dateAdded' | 'dateUpdated' | 'stockStatus'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
  onAddCategory: (categoryName: string) => void;
  onDeleteCategory: (categoryId: number) => void;
}

const SAMPLE_IMAGE_PRESETS = [
  { label: 'Blue & White Vase', url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80' },
  { label: 'Celadon Tea Set', url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80' },
  { label: 'Dragon Bowl', url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400&q=80' },
  { label: 'Rose Platter', url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=400&q=80' },
  { label: 'Crane Figurine', url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=400&q=80' },
  { label: 'Glazed Pot', url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80' },
];

export const ProductView: React.FC<ProductViewProps> = ({
  products,
  categories,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddCategory,
  onDeleteCategory,
}) => {
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<'Name' | 'Category' | 'Price' | 'Date Added'>('Name');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    productName: '',
    categoryId: categories[0]?.id || 1,
    originalPrice: '',
    retailPrice: '',
    stockQuantity: '10',
    productImage: SAMPLE_IMAGE_PRESETS[0].url,
  });

  // Filter & sort logic matching WPF ViewModel
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
      if (sortBy === 'Category') return (a.categoryName || '').localeCompare(b.categoryName || '');
      if (sortBy === 'Price') return b.retailPrice - a.retailPrice;
      if (sortBy === 'Date Added') return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      return 0;
    });
  }, [products, searchText, sortBy]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      productName: '',
      categoryId: categories[0]?.id || 1,
      originalPrice: '',
      retailPrice: '',
      stockQuantity: '10',
      productImage: SAMPLE_IMAGE_PRESETS[0].url,
    });
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      categoryId: product.categoryId,
      originalPrice: product.originalPrice.toString(),
      retailPrice: product.retailPrice.toString(),
      stockQuantity: product.stockQuantity.toString(),
      productImage: product.productImage || SAMPLE_IMAGE_PRESETS[0].url,
    });
    setIsEditModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === Number(formData.categoryId));
    const catName = cat ? cat.categoryName : 'Uncategorized';

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        productName: formData.productName,
        categoryId: Number(formData.categoryId),
        categoryName: catName,
        originalPrice: parseFloat(formData.originalPrice) || 0,
        retailPrice: parseFloat(formData.retailPrice) || 0,
        stockQuantity: parseInt(formData.stockQuantity, 10) || 0,
        stockStatus: (parseInt(formData.stockQuantity, 10) || 0) > 0 ? 'In Stock' : 'Out of Stock',
        dateUpdated: new Date().toISOString(),
        productImage: formData.productImage,
      });
    } else {
      onAddProduct({
        productName: formData.productName,
        categoryId: Number(formData.categoryId),
        categoryName: catName,
        originalPrice: parseFloat(formData.originalPrice) || 0,
        retailPrice: parseFloat(formData.retailPrice) || 0,
        stockQuantity: parseInt(formData.stockQuantity, 10) || 0,
        productImage: formData.productImage,
      });
    }
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Products</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage porcelain inventory catalog, pricing, and categories</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-[#1E2227] p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-200">
        <div className="flex flex-wrap items-center gap-2">
          {/* Add Product Button */}
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#007FFF] hover:bg-[#006ee0] text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>

          {/* Manage Categories Button */}
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#393E46] dark:bg-gray-700 hover:bg-[#222831] dark:hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-sm"
          >
            <FolderTree className="w-4 h-4 text-[#00ADB5]" />
            <span>Manage Categories</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Sorting */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADB5] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 cursor-pointer"
            >
              <option value="Name">Name</option>
              <option value="Category">Category</option>
              <option value="Price">Price</option>
              <option value="Date Added">Date Added</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
            />
          </div>
        </div>
      </div>

      {/* Product DataGrid */}
      <div className="bg-white dark:bg-[#1E2227] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm overflow-hidden transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700 dark:text-gray-300">
            <thead className="bg-[#393E46] text-white text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Image</th>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Original Price</th>
                <th className="py-3.5 px-4">Retail Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Date Added</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4">
                      {p.productImage ? (
                        <img
                          src={p.productImage}
                          alt={p.productName}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-2xs"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">{p.productName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                        {p.categoryName}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-600 dark:text-gray-400">
                      ₱{p.originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-gray-900 dark:text-gray-100">
                      ₱{p.retailPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          p.stockQuantity > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
                        }`}
                      >
                        {p.stockQuantity} units
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500 dark:text-gray-400">
                      {new Date(p.dateAdded).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="px-2.5 py-1.5 text-xs font-medium bg-[#00ADB5]/10 dark:bg-[#00ADB5]/20 text-[#00ADB5] hover:bg-[#00ADB5] hover:text-white rounded-md transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5 inline mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${p.productName}?`)) {
                              onDeleteProduct(p.id);
                            }
                          }}
                          className="px-2.5 py-1.5 text-xs font-medium bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white rounded-md transition-colors"
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
                  <td colSpan={8} className="py-12 text-center text-gray-400 dark:text-gray-500">
                    <Package className="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1E2227] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 transition-colors duration-200">
            <div className="flex items-center justify-between px-6 py-4 bg-[#393E46] text-white">
              <h2 className="text-lg font-bold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="e.g., Jingdezhen Porcelain Vase"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Category *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Original Price (₱) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="2500.00"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Retail Price (₱) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.retailPrice}
                    onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
                    placeholder="4200.00"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Initial Stock Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Product Image URL
                </label>
                <input
                  type="url"
                  value={formData.productImage}
                  onChange={(e) => setFormData({ ...formData, productImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                />
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Or pick a sample preset:</p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {SAMPLE_IMAGE_PRESETS.map((preset, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setFormData({ ...formData, productImage: preset.url })}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#007FFF] hover:bg-[#006ee0] text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        products={products}
        onAddCategory={onAddCategory}
        onDeleteCategory={onDeleteCategory}
      />
    </div>
  );
};
