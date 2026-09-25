export interface ScreenDefinition {
  id: string; // e.g. "01", "02", ... "52"
  number: number;
  title: string;
  phaseId: number;
  phaseName: string;
  category: string;
  description: string;
  route: string;
}

export const PHASES = [
  { id: 1, name: 'Phase 1 — Authentication & Account Creation', screensRange: '01 - 06', color: 'indigo' },
  { id: 2, name: 'Phase 2 — Super Admin Portal', screensRange: '07 - 10', color: 'blue' },
  { id: 3, name: 'Phase 3 — Smart Onboarding & Business Setup', screensRange: '11 - 26', color: 'emerald' },
  { id: 4, name: 'Phase 4 — Restaurant Operation (POS & Orders)', screensRange: '27 - 40', color: 'amber' },
  { id: 5, name: 'Phase 5 — Management & Reports', screensRange: '41 - 49', color: 'rose' },
  { id: 6, name: 'Phase 6 — SaaS & Communication', screensRange: '50 - 52', color: 'cyan' },
];

export const SCREENS: ScreenDefinition[] = [
  // Phase 1
  { id: '01', number: 1, title: 'Splash / App Launch', phaseId: 1, phaseName: 'Phase 1', category: 'Authentication', description: 'RestoPro branded splash screen with dark culinary theme', route: '/screens/01' },
  { id: '02', number: 2, title: 'Welcome / Landing', phaseId: 1, phaseName: 'Phase 1', category: 'Authentication', description: 'Hero landing with Get Started, Watch Demo, and feature teasers', route: '/screens/02' },
  { id: '03', number: 3, title: 'Login', phaseId: 1, phaseName: 'Phase 1', category: 'Authentication', description: 'Email/Password login, Remember Me, Forgot Password, and Google OAuth', route: '/screens/03' },
  { id: '04', number: 4, title: 'Sign Up', phaseId: 1, phaseName: 'Phase 1', category: 'Authentication', description: 'Full Name, Email, Password, Confirm Password, and Google Sign Up', route: '/screens/04' },
  { id: '05', number: 5, title: 'Email Verification', phaseId: 1, phaseName: 'Phase 1', category: 'Authentication', description: 'Verify Your Email notification with Open Email App and Resend actions', route: '/screens/05' },
  { id: '06', number: 6, title: 'Pending Approval', phaseId: 1, phaseName: 'Phase 1', category: 'Authentication', description: 'Registration Submitted state tracker (Submitted -> Under Review -> Approval Pending)', route: '/screens/06' },

  // Phase 2
  { id: '07', number: 7, title: 'Super Admin Login', phaseId: 2, phaseName: 'Phase 2', category: 'Super Admin', description: 'Dedicated administrative authentication gateway for platform governance', route: '/screens/07' },
  { id: '08', number: 8, title: 'Super Admin Dashboard', phaseId: 2, phaseName: 'Phase 2', category: 'Super Admin', description: 'Platform metrics (Total Businesses 128, Pending 12, Approved 96, Rejected 8)', route: '/screens/08' },
  { id: '09', number: 9, title: 'Registration Requests', phaseId: 2, phaseName: 'Phase 2', category: 'Super Admin', description: 'Manage incoming restaurant onboarding requests with View/Approve/Reject', route: '/screens/09' },
  { id: '10', number: 10, title: 'Approval Details', phaseId: 2, phaseName: 'Phase 2', category: 'Super Admin', description: 'Detailed tenant review modal for Spice Garden with document inspection', route: '/screens/10' },

  // Phase 3
  { id: '11', number: 11, title: 'Business Type', phaseId: 3, phaseName: 'Phase 3', category: 'Onboarding', description: 'Select Restaurant, Cafe, Bakery, Fast Food, Cloud Kitchen, or Bar', route: '/screens/11' },
  { id: '12', number: 12, title: 'Restaurant Information', phaseId: 3, phaseName: 'Phase 3', category: 'Onboarding', description: 'Business Name, Phone Number, Email, Address, City, State, Country, Logo', route: '/screens/12' },
  { id: '13', number: 13, title: 'Services Selection', phaseId: 3, phaseName: 'Phase 3', category: 'Onboarding', description: 'Configure services: Dine-in, Takeaway, Delivery, Online Orders', route: '/screens/13' },
  { id: '14', number: 14, title: 'Module Selection', phaseId: 3, phaseName: 'Phase 3', category: 'Onboarding', description: 'Enable/disable modules: POS, Tables, Kitchen/KOT, Inventory, Customers, Reports', route: '/screens/14' },
  { id: '15', number: 15, title: 'Table Configuration', phaseId: 3, phaseName: 'Phase 3', category: 'Onboarding', description: 'Dynamic table count selector with automatic table generator', route: '/screens/15' },
  { id: '16', number: 16, title: 'Table Sections', phaseId: 3, phaseName: 'Phase 3', category: 'Onboarding', description: 'Create and organize sections: Indoor (10), Outdoor (6), VIP (4)', route: '/screens/16' },
  { id: '17', number: 17, title: 'Staff Setup', phaseId: 3, phaseName: 'Phase 3', category: 'Onboarding', description: 'Configure staff count and roles: Owner, Manager, Waiter, Kitchen', route: '/screens/17' },
  { id: '18', number: 18, title: 'Roles & Permissions', phaseId: 3, phaseName: 'Phase 3', category: 'Onboarding', description: 'Granular permissions matrix for View Tables, Create Orders, Edit Orders, Send KOT', route: '/screens/18' },
  { id: '19', number: 19, title: 'Device Assignment', phaseId: 3, phaseName: 'Phase 3', category: 'Onboarding', description: 'Add and authorize worker devices with platform, device ID, and worker assignment', route: '/screens/19' },
  { id: '20', number: 20, title: 'Category Setup', phaseId: 3, phaseName: 'Phase 3', category: 'Onboarding', description: 'Create menu categories: Starters, Main Course, Biryani, Rice, Beverages', route: '/screens/20' },
  { id: '21', number: 21, title: 'AI Menu Import', phaseId: 3, phaseName: 'Phase 3', category: 'Onboarding', description: 'Upload physical menu cards via photo or multiple images for AI ingestion', route: '/screens/21' },
  { id: '22', number: 22, title: 'AI Menu Review', phaseId: 3, phaseName: 'Phase 3', category: 'Onboarding', description: 'Staged review table: edit AI extracted items and prices before importing', route: '/screens/22' },
  { id: '23', number: 23, title: 'Manual Menu Setup', phaseId: 3, phaseName: 'Phase 3', category: 'Onboarding', description: 'Add individual dishes with name, description, category, price, and food type', route: '/screens/23' },
  { id: '24', number: 24, title: 'Configure Billing Settings', phaseId: 3, phaseName: 'Phase 3', category: 'Onboarding', description: 'Currency, Tax/GST toggle, Service Charge, Round Off, Tax Rate (5%), Bill Prefix', route: '/screens/24' },
  { id: '25', number: 25, title: 'Printer Setup', phaseId: 3, phaseName: 'Phase 3', category: 'Onboarding', description: 'Connect Bluetooth, USB, or Network ESC/POS thermal printers with Test Print', route: '/screens/25' },
  { id: '26', number: 26, title: 'Final Review', phaseId: 3, phaseName: 'Phase 3', category: 'Onboarding', description: 'Review summary checklist and Complete Setup to launch custom platform', route: '/screens/26' },

  // Phase 4
  { id: '27', number: 27, title: 'Restaurant Dashboard', phaseId: 4, phaseName: 'Phase 4', category: 'Operations', description: 'Live revenue metrics, today orders, active table occupancy, sales graph', route: '/screens/27' },
  { id: '28', number: 28, title: 'POS / Billing Screen', phaseId: 4, phaseName: 'Phase 4', category: 'Operations', description: 'High-speed touch item grid, categories, cart, Send KOT, and Bill actions', route: '/screens/28' },
  { id: '29', number: 29, title: 'Tables Dashboard', phaseId: 4, phaseName: 'Phase 4', category: 'Operations', description: 'Interactive floor plan with Available, Occupied, Billing, and Reserved tables', route: '/screens/29' },
  { id: '30', number: 30, title: 'Table Order Screen', phaseId: 4, phaseName: 'Phase 4', category: 'Operations', description: 'Table 5 specific active ticket, guest count, item additions, Send KOT', route: '/screens/30' },
  { id: '31', number: 31, title: 'Menu / Categories', phaseId: 4, phaseName: 'Phase 4', category: 'Operations', description: 'Visual catalog navigation with dish photos, food types, and availability badges', route: '/screens/31' },
  { id: '32', number: 32, title: 'Current Order / Cart', phaseId: 4, phaseName: 'Phase 4', category: 'Operations', description: 'Detailed order item modifiers, quantity steppers, special instructions', route: '/screens/32' },
  { id: '33', number: 33, title: 'Kitchen Display (KOT)', phaseId: 4, phaseName: 'Phase 4', category: 'Operations', description: 'Real-time kitchen order tickets (New Orders, Preparing, Ready) with timers', route: '/screens/33' },
  { id: '34', number: 34, title: 'Billing / Invoice Screen', phaseId: 4, phaseName: 'Phase 4', category: 'Operations', description: 'Itemized invoice #INV000123 with subtotal, tax breakdown, total, Print, Share', route: '/screens/34' },
  { id: '35', number: 35, title: 'Payment Screen', phaseId: 4, phaseName: 'Phase 4', category: 'Operations', description: 'Payment tender with Cash, UPI, Card, Split tabs, and Complete Payment', route: '/screens/35' },
  { id: '36', number: 36, title: 'QR Bill Payment', phaseId: 4, phaseName: 'Phase 4', category: 'Operations', description: 'Dynamic table QR code for contactless guest payment via GPay/PhonePe/Paytm', route: '/screens/36' },
  { id: '37', number: 37, title: 'Print Status', phaseId: 4, phaseName: 'Phase 4', category: 'Operations', description: 'Safe transaction print dialog: Try Again, Done, and offline retry spooler', route: '/screens/37' },
  { id: '38', number: 38, title: 'Orders Management', phaseId: 4, phaseName: 'Phase 4', category: 'Operations', description: 'Order tracking log #1234, #1233 with status pills (Preparing, Served, Cancelled)', route: '/screens/38' },
  { id: '39', number: 39, title: 'Order Details', phaseId: 4, phaseName: 'Phase 4', category: 'Operations', description: 'Individual order breakdown, server name, status, and Print Again action', route: '/screens/39' },
  { id: '40', number: 40, title: 'Worker Activity', phaseId: 4, phaseName: 'Phase 4', category: 'Operations', description: 'Granular worker timeline for Ramesh: items added, KOTs sent, bills settled', route: '/screens/40' },

  // Phase 5
  { id: '41', number: 41, title: 'Staff Management', phaseId: 5, phaseName: 'Phase 5', category: 'Management', description: 'Directory of staff members, phone, role, status, and Add Staff', route: '/screens/41' },
  { id: '42', number: 42, title: 'Inventory', phaseId: 5, phaseName: 'Phase 5', category: 'Management', description: 'Ingredient stock (Rice, Tomato, Oil, Onion), units, and low-stock alerts', route: '/screens/42' },
  { id: '43', number: 43, title: 'Customers', phaseId: 5, phaseName: 'Phase 5', category: 'Management', description: 'Customer directory with phone, total spend, total visits, and Add Customer', route: '/screens/43' },
  { id: '44', number: 44, title: 'Reports & Analytics', phaseId: 5, phaseName: 'Phase 5', category: 'Management', description: 'Sales Report bar chart, daily revenue breakdown, popular dish rankings', route: '/screens/44' },
  { id: '45', number: 45, title: 'Expenses', phaseId: 5, phaseName: 'Phase 5', category: 'Management', description: 'Daily expense ledger (Rent ₹20,000, Salaries ₹35,000, Utilities ₹5,000)', route: '/screens/45' },
  { id: '46', number: 46, title: 'Restaurant Settings', phaseId: 5, phaseName: 'Phase 5', category: 'Management', description: 'Configuration panel: General, Billing & Tax, Printers, Payment Methods', route: '/screens/46' },
  { id: '47', number: 47, title: 'Module Management', phaseId: 5, phaseName: 'Phase 5', category: 'Management', description: 'Feature toggle matrix to enable/disable POS, Tables, Kitchen, Inventory', route: '/screens/47' },
  { id: '48', number: 48, title: 'Roles & Permissions Matrix', phaseId: 5, phaseName: 'Phase 5', category: 'Management', description: 'Complete role permissions matrix with individual check toggles', route: '/screens/48' },
  { id: '49', number: 49, title: 'Devices & Sessions', phaseId: 5, phaseName: 'Phase 5', category: 'Management', description: 'Authorized devices list (iPhone, iPad, Android) with Revoke access button', route: '/screens/49' },

  // Phase 6
  { id: '50', number: 50, title: 'Offline / Sync Status', phaseId: 6, phaseName: 'Phase 6', category: 'SaaS', description: 'Offline mode indicator, pending sync queue counter, and Sync Now action', route: '/screens/50' },
  { id: '51', number: 51, title: 'Subscription / Plan', phaseId: 6, phaseName: 'Phase 6', category: 'SaaS', description: 'Plan comparison (Free, Pro ₹999/mo, Enterprise Custom) and Upgrade', route: '/screens/51' },
  { id: '52', number: 52, title: 'Notifications', phaseId: 6, phaseName: 'Phase 6', category: 'SaaS', description: 'Live event stream: New Orders, Payments, Low Stock alerts, and System updates', route: '/screens/52' },
];
