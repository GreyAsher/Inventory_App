import React from 'react';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Truck,
  Users,
  ShoppingCart,
  BarChart3,
  LogOut,
  UserCheck,
  Sun,
  Moon,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'products'
  | 'stock'
  | 'suppliers'
  | 'customers'
  | 'sales'
  | 'reports';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentUser: string | null;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onLogout,
  darkMode,
  onToggleDarkMode,
}) => {
  const menuItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" /> },
    { id: 'products', label: 'Products', icon: <Package className="w-5 h-5 mr-3" /> },
    { id: 'stock', label: 'Stock Management', icon: <Warehouse className="w-5 h-5 mr-3" /> },
    { id: 'suppliers', label: 'Suppliers', icon: <Truck className="w-5 h-5 mr-3" /> },
    { id: 'customers', label: 'Customer', icon: <Users className="w-5 h-5 mr-3" /> },
    { id: 'sales', label: 'Sales', icon: <ShoppingCart className="w-5 h-5 mr-3" /> },
    { id: 'reports', label: 'Report', icon: <BarChart3 className="w-5 h-5 mr-3" /> },
  ];

  return (
    <aside className="w-64 bg-[#393E46] text-white flex flex-col shrink-0 min-h-screen shadow-xl no-print">
      {/* Brand & User Header */}
      <div className="pt-8 pb-4 px-6 text-center border-b border-gray-600/50">
        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner border border-white/10">
          <span className="text-3xl">🏺</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#00ADB5] mb-1">
          <UserCheck className="w-3.5 h-3.5" />
          <span>{currentUser || 'Admin'}</span>
        </div>
        <h1 className="text-lg font-bold tracking-tight text-white">Inventory App</h1>
        <p className="text-xs text-gray-400 mt-0.5">Inventory Management</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#00ADB5] text-white shadow-md shadow-[#00ADB5]/20 font-semibold translate-x-1'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Dark / Light Theme Toggle Pill */}
      <div className="px-4 py-3 border-t border-gray-600/50">
        <div className="bg-white/5 p-1 rounded-xl flex items-center gap-1 border border-white/10">
          <button
            type="button"
            onClick={() => {
              if (darkMode) onToggleDarkMode();
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              !darkMode
                ? 'bg-[#00ADB5] text-white shadow-xs'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (!darkMode) onToggleDarkMode();
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              darkMode
                ? 'bg-[#00ADB5] text-white shadow-xs'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark</span>
          </button>
        </div>
      </div>

      {/* Bottom Session Info & Logout */}
      <div className="p-4 border-t border-gray-600/50">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-red-500/20 hover:text-red-300 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
