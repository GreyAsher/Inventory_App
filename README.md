# Inventory App

A web-based inventory management system with stock tracking, sales invoicing, customer and supplier directories, and analytics, migrated from the desktop WPF application.

## Features

- **Dashboard**: High-level KPIs (Total Sales in ₱, Total Products, Out of Stock alerts, Suppliers), interactive sales trend chart (Analysis Preview), and top 10 best-selling products.
- **Product Management**: Full catalog of porcelain items with images, category filtering, cost vs. retail pricing, stock levels, and category manager.
- **Stock Management**: Live stock status indicators (In Stock vs. Out of Stock), restock action modal with instant inventory quantity adjustments.
- **Suppliers Directory**: Maintain supplier contacts, pottery kiln locations, and addresses.
- **Customer Directory**: Track client contacts, email addresses, and total order counts.
- **Sales & POS Invoicing**:
  - Interactive point-of-sale workflow: browse items, add to cart (+ / -), automatic inventory stock deductions.
  - Customer selection (existing or walk-in).
  - Printable invoice receipt with print preview support.
- **Sales & Reports**: Sales summary cards, sortable transaction history, and CSV export.
- **Authentication**: Admin sign-in screen matching the classic Cor Jeff brand styling with easy demo access.

## Running Locally

```bash
npm install
npm run dev
```

App runs on `http://localhost:3000`.
