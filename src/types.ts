export interface Product {
  id: number;
  productName: string;
  categoryId: number;
  categoryName: string;
  originalPrice: number;
  retailPrice: number;
  stockQuantity: number;
  stockStatus: 'In Stock' | 'Out of Stock';
  dateAdded: string;
  dateUpdated: string;
  productImage?: string;
}

export interface Category {
  id: number;
  categoryName: string;
}

export interface Customer {
  id: number;
  fullName: string;
  contactNumber: string;
  email: string;
  dateAdded: string;
}

export interface Supplier {
  id: number;
  supplierName: string;
  contactNumber: string;
  address: string;
  dateAdded: string;
}

export interface InvoiceItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  customerId?: number;
  customerName: string;
  totalAmount: number;
  dateIssued: string;
  items: InvoiceItem[];
}

export interface SalesReportItem {
  id: number;
  invoiceNumber: string;
  customerName: string;
  totalAmount: number;
  saleDate: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
}
