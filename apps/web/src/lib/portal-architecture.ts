import React from 'react';
import {
  LayoutDashboard,
  Calculator,
  LayoutGrid,
  ClipboardList,
  ChefHat,
  BookOpen,
  Receipt,
  CreditCard,
  Package,
  Users,
  ShieldCheck,
  TrendingDown,
  BarChart3,
  QrCode,
  Printer,
  LineChart,
  Settings,
  RefreshCw,
  LucideIcon,
} from 'lucide-react';
import { BusinessType } from '@platform/types';

export interface ArchitectureSection {
  id: string;
  name: string;
  purpose: string;
  href: string;
  iconName: string;
  badge?: string;
  children: {
    id: string;
    name: string;
    href: string;
  }[];
}

export const RESTAURANT_PORTAL_SECTIONS: ArchitectureSection[] = [
  // 01
  {
    id: 'dashboard',
    name: 'Dashboard',
    purpose: 'Main restaurant overview.',
    href: '/dashboard',
    iconName: 'LayoutDashboard',
    children: [
      { id: 'overview', name: 'Overview', href: '/dashboard?tab=overview' },
      { id: 'today_sales', name: "Today's Sales", href: '/dashboard?tab=sales' },
      { id: 'today_orders', name: "Today's Orders", href: '/dashboard?tab=orders' },
      { id: 'active_tables', name: 'Active Tables', href: '/dashboard?tab=tables' },
      { id: 'pending_orders', name: 'Pending Orders', href: '/dashboard?tab=pending' },
      { id: 'kitchen_status', name: 'Kitchen Status', href: '/dashboard?tab=kitchen' },
      { id: 'payment_summary', name: 'Payment Summary', href: '/dashboard?tab=payments' },
      { id: 'quick_actions', name: 'Quick Actions', href: '/dashboard?tab=actions' },
    ],
  },
  // 02
  {
    id: 'pos',
    name: 'POS',
    purpose: 'Main point-of-sale and billing workspace.',
    href: '/pos',
    iconName: 'Calculator',
    children: [
      { id: 'new_order', name: 'New Order', href: '/pos?mode=new' },
      { id: 'quick_billing', name: 'Quick Billing', href: '/pos?mode=quick' },
      { id: 'dine_in', name: 'Dine-In', href: '/pos?mode=dine_in' },
      { id: 'takeaway', name: 'Takeaway', href: '/pos?mode=takeaway' },
      { id: 'delivery', name: 'Delivery', href: '/pos?mode=delivery' },
      { id: 'held_orders', name: 'Held Orders', href: '/pos?mode=held' },
    ],
  },
  // 03
  {
    id: 'tables',
    name: 'Tables',
    purpose: 'Manage restaurant tables and active table orders.',
    href: '/tables',
    iconName: 'LayoutGrid',
    children: [
      { id: 'floor_view', name: 'Floor View', href: '/tables?view=floor' },
      { id: 'all_tables', name: 'All Tables', href: '/tables?view=all' },
      { id: 'table_sections', name: 'Table Sections', href: '/tables?view=sections' },
      { id: 'reservations', name: 'Reservations', href: '/tables?view=reservations' },
      { id: 'table_qr_codes', name: 'Table QR Codes', href: '/tables?view=qr' },
      { id: 'table_transfer', name: 'Table Transfer', href: '/tables?view=transfer' },
      { id: 'table_merge', name: 'Table Merge', href: '/tables?view=merge' },
    ],
  },
  // 04
  {
    id: 'orders',
    name: 'Orders',
    purpose: 'Manage all restaurant orders.',
    href: '/orders',
    iconName: 'ClipboardList',
    children: [
      { id: 'all_orders', name: 'All Orders', href: '/orders?status=all' },
      { id: 'active_orders', name: 'Active Orders', href: '/orders?status=active' },
      { id: 'completed_orders', name: 'Completed Orders', href: '/orders?status=completed' },
      { id: 'cancelled_orders', name: 'Cancelled Orders', href: '/orders?status=cancelled' },
      { id: 'dine_in_orders', name: 'Dine-In Orders', href: '/orders?type=dine_in' },
      { id: 'takeaway_orders', name: 'Takeaway Orders', href: '/orders?type=takeaway' },
      { id: 'delivery_orders', name: 'Delivery Orders', href: '/orders?type=delivery' },
      { id: 'order_details', name: 'Order Details', href: '/orders?view=details' },
    ],
  },
  // 05
  {
    id: 'kitchen',
    name: 'Kitchen',
    purpose: 'Kitchen and KOT management.',
    href: '/kitchen',
    iconName: 'ChefHat',
    children: [
      { id: 'kitchen_display', name: 'Kitchen Display', href: '/kitchen?view=display' },
      { id: 'new_orders', name: 'New Orders', href: '/kitchen?view=new' },
      { id: 'preparing', name: 'Preparing', href: '/kitchen?view=preparing' },
      { id: 'ready', name: 'Ready', href: '/kitchen?view=ready' },
      { id: 'served', name: 'Served', href: '/kitchen?view=served' },
      { id: 'kot', name: 'KOT', href: '/kitchen?view=kot' },
      { id: 'kitchen_stations', name: 'Kitchen Stations', href: '/kitchen?view=stations' },
    ],
  },
  // 06
  {
    id: 'menu',
    name: 'Menu',
    purpose: 'Manage all restaurant menu data.',
    href: '/menu',
    iconName: 'BookOpen',
    children: [
      { id: 'menu_overview', name: 'Menu Overview', href: '/menu?tab=overview' },
      { id: 'categories', name: 'Categories', href: '/menu?tab=categories' },
      { id: 'menu_items', name: 'Menu Items', href: '/menu?tab=items' },
      { id: 'variants', name: 'Variants', href: '/menu?tab=variants' },
      { id: 'modifiers', name: 'Modifiers', href: '/menu?tab=modifiers' },
      { id: 'add_ons', name: 'Add-ons', href: '/menu?tab=addons' },
      { id: 'pricing', name: 'Pricing', href: '/menu?tab=pricing' },
      { id: 'availability', name: 'Availability', href: '/menu?tab=availability' },
      { id: 'menu_images', name: 'Menu Images', href: '/menu?tab=images' },
      { id: 'ai_menu_import', name: 'AI Menu Import', href: '/menu?tab=ai_import' },
      { id: 'qr_menu', name: 'QR Menu', href: '/menu?tab=qr' },
    ],
  },
  // 07
  {
    id: 'billing',
    name: 'Billing',
    purpose: 'Manage bills, invoices and financial transactions.',
    href: '/billing',
    iconName: 'Receipt',
    children: [
      { id: 'all_bills', name: 'All Bills', href: '/billing?tab=all' },
      { id: 'open_bills', name: 'Open Bills', href: '/billing?tab=open' },
      { id: 'paid_bills', name: 'Paid Bills', href: '/billing?tab=paid' },
      { id: 'cancelled_bills', name: 'Cancelled Bills', href: '/billing?tab=cancelled' },
      { id: 'refunds', name: 'Refunds', href: '/billing?tab=refunds' },
      { id: 'split_bills', name: 'Split Bills', href: '/billing?tab=split' },
      { id: 'merged_bills', name: 'Merged Bills', href: '/billing?tab=merged' },
      { id: 'invoices', name: 'Invoices', href: '/billing?tab=invoices' },
      { id: 'reprint', name: 'Reprint', href: '/billing?tab=reprint' },
    ],
  },
  // 08
  {
    id: 'payments',
    name: 'Payments',
    purpose: 'Manage payment transactions.',
    href: '/payments',
    iconName: 'CreditCard',
    children: [
      { id: 'all_payments', name: 'All Payments', href: '/payments?type=all' },
      { id: 'cash', name: 'Cash', href: '/payments?type=cash' },
      { id: 'upi', name: 'UPI', href: '/payments?type=upi' },
      { id: 'card', name: 'Card', href: '/payments?type=card' },
      { id: 'online_payments', name: 'Online Payments', href: '/payments?type=online' },
      { id: 'split_payments', name: 'Split Payments', href: '/payments?type=split' },
      { id: 'payment_reconciliation', name: 'Payment Reconciliation', href: '/payments?type=reconciliation' },
    ],
  },
  // 09
  {
    id: 'inventory',
    name: 'Inventory',
    purpose: 'Manage stock and ingredients.',
    href: '/inventory',
    iconName: 'Package',
    children: [
      { id: 'inventory_overview', name: 'Inventory Overview', href: '/inventory?tab=overview' },
      { id: 'products', name: 'Products', href: '/inventory?tab=products' },
      { id: 'ingredients', name: 'Ingredients', href: '/inventory?tab=ingredients' },
      { id: 'stock', name: 'Stock', href: '/inventory?tab=stock' },
      { id: 'stock_adjustment', name: 'Stock Adjustment', href: '/inventory?tab=adjustment' },
      { id: 'low_stock', name: 'Low Stock', href: '/inventory?tab=low_stock' },
      { id: 'stock_history', name: 'Stock History', href: '/inventory?tab=history' },
      { id: 'recipes', name: 'Recipes', href: '/inventory?tab=recipes' },
      { id: 'suppliers', name: 'Suppliers', href: '/inventory?tab=suppliers' },
      { id: 'purchases', name: 'Purchases', href: '/inventory?tab=purchases' },
    ],
  },
  // 10
  {
    id: 'customers',
    name: 'Customers',
    purpose: 'Manage customer information and history.',
    href: '/customers',
    iconName: 'Users',
    children: [
      { id: 'all_customers', name: 'All Customers', href: '/customers?tab=all' },
      { id: 'customer_profiles', name: 'Customer Profiles', href: '/customers?tab=profiles' },
      { id: 'order_history', name: 'Order History', href: '/customers?tab=history' },
      { id: 'customer_analytics', name: 'Customer Analytics', href: '/customers?tab=analytics' },
      { id: 'feedback', name: 'Feedback', href: '/customers?tab=feedback' },
      { id: 'loyalty', name: 'Loyalty', href: '/customers?tab=loyalty' },
    ],
  },
  // 11
  {
    id: 'staff',
    name: 'Staff',
    purpose: 'Manage restaurant employees.',
    href: '/staff',
    iconName: 'ShieldCheck',
    children: [
      { id: 'all_staff', name: 'All Staff', href: '/staff?tab=all' },
      { id: 'add_staff', name: 'Add Staff', href: '/staff?tab=add' },
      { id: 'roles', name: 'Roles', href: '/staff?tab=roles' },
      { id: 'permissions', name: 'Permissions', href: '/staff?tab=permissions' },
      { id: 'staff_activity', name: 'Staff Activity', href: '/staff?tab=activity' },
      { id: 'devices', name: 'Devices', href: '/staff?tab=devices' },
      { id: 'sessions', name: 'Sessions', href: '/staff?tab=sessions' },
    ],
  },
  // 12
  {
    id: 'expenses',
    name: 'Expenses',
    purpose: 'Track restaurant expenses.',
    href: '/expenses',
    iconName: 'TrendingDown',
    children: [
      { id: 'expense_overview', name: 'Expense Overview', href: '/expenses?tab=overview' },
      { id: 'add_expense', name: 'Add Expense', href: '/expenses?tab=add' },
      { id: 'expense_categories', name: 'Expense Categories', href: '/expenses?tab=categories' },
      { id: 'recurring_expenses', name: 'Recurring Expenses', href: '/expenses?tab=recurring' },
      { id: 'expense_history', name: 'Expense History', href: '/expenses?tab=history' },
    ],
  },
  // 13
  {
    id: 'reports',
    name: 'Reports & Analytics',
    purpose: 'Business performance and operational analytics.',
    href: '/reports',
    iconName: 'BarChart3',
    children: [
      { id: 'sales_report', name: 'Sales Report', href: '/reports?type=sales' },
      { id: 'order_report', name: 'Order Report', href: '/reports?type=orders' },
      { id: 'payment_report', name: 'Payment Report', href: '/reports?type=payments' },
      { id: 'tax_report', name: 'Tax Report', href: '/reports?type=tax' },
      { id: 'product_performance', name: 'Product Performance', href: '/reports?type=products' },
      { id: 'category_performance', name: 'Category Performance', href: '/reports?type=categories' },
      { id: 'table_performance', name: 'Table Performance', href: '/reports?type=tables' },
      { id: 'staff_performance', name: 'Staff Performance', href: '/reports?type=staff' },
      { id: 'inventory_report', name: 'Inventory Report', href: '/reports?type=inventory' },
      { id: 'customer_report', name: 'Customer Report', href: '/reports?type=customers' },
      { id: 'expense_report', name: 'Expense Report', href: '/reports?type=expenses' },
    ],
  },
  // 14
  {
    id: 'qr',
    name: 'QR & Digital',
    purpose: 'Manage QR-based restaurant experiences.',
    href: '/qr',
    iconName: 'QrCode',
    children: [
      { id: 'qr_digital_menu', name: 'QR Digital Menu', href: '/qr?tab=menu' },
      { id: 'table_qr', name: 'Table QR', href: '/qr?tab=tables' },
      { id: 'qr_ordering', name: 'QR Ordering', href: '/qr?tab=ordering' },
      { id: 'qr_bill_payment', name: 'QR Bill Payment', href: '/qr?tab=payment' },
      { id: 'generate_qr', name: 'Generate QR', href: '/qr?tab=generate' },
    ],
  },
  // 15
  {
    id: 'printers',
    name: 'Printers & Devices',
    purpose: 'Configure POS printers and restaurant devices.',
    href: '/printers',
    iconName: 'Printer',
    children: [
      { id: 'printers', name: 'Printers', href: '/printers?tab=printers' },
      { id: 'thermal_printers', name: 'Thermal Printers', href: '/printers?tab=thermal' },
      { id: 'kot_printers', name: 'KOT Printers', href: '/printers?tab=kot' },
      { id: 'network_printers', name: 'Network Printers', href: '/printers?tab=network' },
      { id: 'connected_devices', name: 'Connected Devices', href: '/printers?tab=devices' },
      { id: 'test_print', name: 'Test Print', href: '/printers?tab=test' },
    ],
  },
  // 16
  {
    id: 'insights',
    name: 'Business Insights',
    purpose: 'High-level business intelligence.',
    href: '/insights',
    iconName: 'LineChart',
    children: [
      { id: 'revenue', name: 'Revenue', href: '/insights?tab=revenue' },
      { id: 'sales_trends', name: 'Sales Trends', href: '/insights?tab=trends' },
      { id: 'peak_hours', name: 'Peak Hours', href: '/insights?tab=peak' },
      { id: 'best_selling_items', name: 'Best Selling Items', href: '/insights?tab=bestsellers' },
      { id: 'staff_perf', name: 'Staff Performance', href: '/insights?tab=staff' },
      { id: 'table_perf', name: 'Table Performance', href: '/insights?tab=tables' },
    ],
  },
  // 17
  {
    id: 'settings',
    name: 'Settings',
    purpose: 'Configure the restaurant application.',
    href: '/settings',
    iconName: 'Settings',
    children: [
      { id: 'restaurant_profile', name: 'Restaurant Profile', href: '/settings?tab=profile' },
      { id: 'business_information', name: 'Business Information', href: '/settings?tab=business' },
      { id: 'tax_billing', name: 'Tax & Billing', href: '/settings?tab=tax' },
      { id: 'payment_settings', name: 'Payment Settings', href: '/settings?tab=payment' },
      { id: 'printer_settings', name: 'Printer Settings', href: '/settings?tab=printers' },
      { id: 'table_settings', name: 'Table Settings', href: '/settings?tab=tables' },
      { id: 'menu_settings', name: 'Menu Settings', href: '/settings?tab=menu' },
      { id: 'staff_settings', name: 'Staff Settings', href: '/settings?tab=staff' },
      { id: 'roles_permissions', name: 'Roles & Permissions', href: '/settings?tab=roles' },
      { id: 'module_management', name: 'Module Management', href: '/settings?tab=modules' },
      { id: 'notifications', name: 'Notifications', href: '/settings?tab=notifications' },
      { id: 'integrations', name: 'Integrations', href: '/settings?tab=integrations' },
      { id: 'security', name: 'Security', href: '/settings?tab=security' },
    ],
  },
  // 18
  {
    id: 'sync',
    name: 'Offline & Sync',
    purpose: 'Show offline status and synchronization state.',
    href: '/sync',
    iconName: 'RefreshCw',
    children: [
      { id: 'connection_status', name: 'Connection Status', href: '/sync?tab=status' },
      { id: 'pending_sync', name: 'Pending Sync', href: '/sync?tab=pending' },
      { id: 'sync_history', name: 'Sync History', href: '/sync?tab=history' },
      { id: 'failed_sync', name: 'Failed Sync', href: '/sync?tab=failed' },
    ],
  },
];

/**
 * Filter sections dynamically based on Role, Business Type & Enabled Modules
 * per Section <dynamic_sidebar> in the specification
 */
export function filterSectionsForContext(params: {
  role: string;
  businessType: BusinessType;
  enabledModules: string[];
}): ArchitectureSection[] {
  const { role, businessType } = params;
  const upperRole = (role || 'OWNER').toUpperCase();

  // Role based filtering from specification
  if (upperRole.includes('KITCHEN') || upperRole === 'CHEF') {
    return RESTAURANT_PORTAL_SECTIONS.filter((s) => ['kitchen', 'orders'].includes(s.id));
  }

  if (upperRole.includes('WAITER')) {
    return RESTAURANT_PORTAL_SECTIONS.filter((s) =>
      ['dashboard', 'pos', 'tables', 'orders', 'menu'].includes(s.id)
    );
  }

  if (upperRole.includes('CASHIER')) {
    return RESTAURANT_PORTAL_SECTIONS.filter((s) =>
      ['dashboard', 'pos', 'orders', 'billing', 'payments'].includes(s.id)
    );
  }

  if (upperRole.includes('ACCOUNTANT')) {
    return RESTAURANT_PORTAL_SECTIONS.filter((s) =>
      ['billing', 'payments', 'expenses', 'reports'].includes(s.id)
    );
  }

  // Bakery specific logic from specification
  if (businessType === 'BAKERY') {
    return RESTAURANT_PORTAL_SECTIONS.filter((s) =>
      ['dashboard', 'pos', 'orders', 'menu', 'inventory', 'customers', 'billing', 'reports', 'settings', 'sync'].includes(
        s.id
      )
    );
  }

  // Cloud kitchen (no tables)
  if (businessType === 'CLOUD_KITCHEN') {
    return RESTAURANT_PORTAL_SECTIONS.filter((s) => s.id !== 'tables');
  }

  // Owner / Admin gets all authorized modules
  return RESTAURANT_PORTAL_SECTIONS;
}
