'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/lib/state';
import {
  generateDynamicNavigation,
  checkPermission,
  ROLE_DEFAULT_PERMISSIONS,
  ROUTE_PERMISSION_MAP,
} from '@/lib/permission-engine';
import { ArchitectureSection } from '@/lib/portal-architecture';
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
  Bell,
  PanelLeftClose,
  PanelLeft,
  ChevronDown,
  LogOut,
  Store,
  HelpCircle,
  Search,
  User,
  ShieldAlert,
  Smartphone,
  Key,
  X,
  Home,
  MoreHorizontal,
  ChevronUp,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { BusinessType } from '@platform/types';

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-[18px] h-[18px]" />,
  Calculator: <Calculator className="w-[18px] h-[18px]" />,
  LayoutGrid: <LayoutGrid className="w-[18px] h-[18px]" />,
  ClipboardList: <ClipboardList className="w-[18px] h-[18px]" />,
  ChefHat: <ChefHat className="w-[18px] h-[18px]" />,
  BookOpen: <BookOpen className="w-[18px] h-[18px]" />,
  Receipt: <Receipt className="w-[18px] h-[18px]" />,
  CreditCard: <CreditCard className="w-[18px] h-[18px]" />,
  Package: <Package className="w-[18px] h-[18px]" />,
  Users: <Users className="w-[18px] h-[18px]" />,
  ShieldCheck: <ShieldCheck className="w-[18px] h-[18px]" />,
  TrendingDown: <TrendingDown className="w-[18px] h-[18px]" />,
  BarChart3: <BarChart3 className="w-[18px] h-[18px]" />,
  QrCode: <QrCode className="w-[18px] h-[18px]" />,
  Printer: <Printer className="w-[18px] h-[18px]" />,
  LineChart: <LineChart className="w-[18px] h-[18px]" />,
  Settings: <Settings className="w-[18px] h-[18px]" />,
  RefreshCw: <RefreshCw className="w-[18px] h-[18px]" />,
};

export function DynamicNavigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    profile,
    businessType,
    setBusinessType,
    enabledModules,
    session,
    setSession,
    isOnline,
    setIsOnline,
  } = useApp();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<'PROFILE' | 'DEVICES' | 'SECURITY'>('PROFILE');

  // Dev-only simulator state
  const [devSimulatorOpen, setDevSimulatorOpen] = useState(false);

  const isPublicPage =
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/pending-approval' ||
    pathname === '/verify-email' ||
    pathname?.startsWith('/admin');

  // STEP 4 & 5: Load User Role & Permissions from authenticated backend session
  const effectivePermissions =
    session.permissions && session.permissions.length > 0
      ? session.permissions
      : ROLE_DEFAULT_PERMISSIONS[session.roleName] || ROLE_DEFAULT_PERMISSIONS.WAITER;

  // DYNAMIC SIDEBAR RESOLUTION RULE:
  // TENANT + RESTAURANT CONFIGURATION + ENABLED MODULES + USER ROLE + USER PERMISSIONS = Visible Navigation
  const visibleSections: ArchitectureSection[] = generateDynamicNavigation({
    tenantId: profile.tenantId || 'tenant-spice-garden',
    businessType,
    enabledModules: (enabledModules as string[]) || [],
    userRole: session.roleName,
    userPermissions: effectivePermissions,
  });

  // ROUTE ACCESS GUARD (Backend & Layout Authorization check)
  const matchedRouteEntry = Object.entries(ROUTE_PERMISSION_MAP).find(([route]) => {
    if (pathname === route) return true;
    if (route !== '/' && pathname.startsWith(`${route}/`)) return true;
    return false;
  });

  const requiredPermission = matchedRouteEntry ? matchedRouteEntry[1] : null;
  const isAuthorizedForCurrentRoute = requiredPermission
    ? checkPermission(effectivePermissions, requiredPermission)
    : true;

  // Check if unauthenticated and redirect to /login
  React.useEffect(() => {
    if (!isPublicPage) {
      const savedSession = typeof window !== 'undefined' ? localStorage.getItem('saas_active_session') : null;
      if (!savedSession && (!session?.userId || !session?.email)) {
        router.push('/login');
      }
    }
  }, [isPublicPage, session, router]);

  if (isPublicPage) {
    return <div className="min-h-screen w-full bg-background text-main overflow-x-hidden font-sans">{children}</div>;
  }


  const handleDevSwitchRole = (role: string) => {
    const roleDefaultPerms = ROLE_DEFAULT_PERMISSIONS[role] || [];
    const roleNames: Record<string, string> = {
      OWNER: 'Rajesh Sharma (Owner)',
      RESTAURANT_ADMIN: 'Karan Mehra (Admin)',
      MANAGER: 'Vikram Patel (Manager)',
      CASHIER: 'Priya Verma (Cashier)',
      WAITER: 'Rohan Gupta (Waiter)',
      KITCHEN: 'Chef Anand (Kitchen)',
      ACCOUNTANT: 'Sunil Rao (Accountant)',
    };

    setSession({
      ...session,
      roleName: role,
      fullName: roleNames[role] || `${role} Staff`,
      permissions: roleDefaultPerms,
    });
    setDevSimulatorOpen(false);

    // Auto-navigate to valid route if current becomes unauthorized
    if (role === 'KITCHEN') router.push('/kitchen');
    else if (role === 'WAITER') router.push('/pos');
    else if (role === 'ACCOUNTANT') router.push('/billing');
    else router.push('/dashboard');
  };

  // Determine authorized bottom navigation items for mobile
  const candidateMobileItems = [
    { id: 'dashboard', name: 'Home', href: '/dashboard', icon: Home, perm: 'dashboard.view' },
    { id: 'pos', name: 'POS', href: '/pos', icon: Calculator, perm: 'pos.view' },
    { id: 'tables', name: 'Tables', href: '/tables', icon: LayoutGrid, perm: 'tables.view' },
    { id: 'orders', name: 'Orders', href: '/orders', icon: ClipboardList, perm: 'orders.view' },
    { id: 'kitchen', name: 'Kitchen', href: '/kitchen', icon: ChefHat, perm: 'kitchen.view' },
    { id: 'billing', name: 'Billing', href: '/billing', icon: Receipt, perm: 'billing.view' },
  ];

  const authorizedMobileItems = candidateMobileItems
    .filter((item) => checkPermission(effectivePermissions, item.perm) && visibleSections.some((s) => s.id === item.id))
    .slice(0, 4);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-main font-sans">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          DESKTOP SIDEBAR (280-300px fixed per spec)
          Background: #FFFFFF, Border-right: 1px solid #E8E6E4
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <aside
        className={`hidden lg:flex flex-col bg-surface border-r border-border select-none transition-all duration-200 ${
          sidebarCollapsed ? 'w-20' : 'w-[290px]'
        }`}
      >
        {/* TOP: Brand Logo, Restaurant Name & Collapse */}
        <div className="h-16 px-5 border-b border-border flex items-center justify-between">
          <Link href={visibleSections[0]?.href || '/dashboard'} className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-bold text-white shadow-button flex-shrink-0">
              <Store className="w-5 h-5 stroke-[2]" />
            </div>
            {!sidebarCollapsed && (
              <div className="truncate">
                <span className="font-semibold text-[15px] text-heading truncate block leading-tight">
                  {profile.businessName || 'Restaurant Portal'}
                </span>
                <span className="text-[11px] text-muted font-medium capitalize">
                  {businessType.toLowerCase().replace('_', ' ')}
                </span>
              </div>
            )}
          </Link>

          {!sidebarCollapsed && (
            <div className="flex items-center space-x-1">
              <button
                type="button"
                className="p-1.5 rounded-lg text-placeholder hover:text-heading hover:bg-surfaceMuted transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1.5 rounded-lg text-placeholder hover:text-heading hover:bg-surfaceMuted transition"
                title="Collapse Sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* MIDDLE: Role-Based + Permission-Based Dynamic Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {!sidebarCollapsed && (
            <div className="px-3 pb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-placeholder">
              <span>Authorized Sections ({visibleSections.length})</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-surfaceMuted text-primary font-bold">
                {session.roleName}
              </span>
            </div>
          )}

          {visibleSections.map((sec) => {
            const isSectionActive =
              pathname === sec.href || (sec.href !== '/' && pathname.startsWith(sec.href));

            return (
              <Link
                key={sec.id}
                href={sec.href}
                className={`group relative flex items-center rounded-xl font-medium text-[14px] transition-colors duration-150 ${
                  sidebarCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3.5 py-2.5'
                } ${
                  isSectionActive
                    ? 'bg-primary-light text-primary font-semibold'
                    : 'text-secondary hover:text-main hover:bg-surfaceMuted'
                }`}
              >
                {/* Active vertical orange indicator per CRM spec: 4px x 24px, 0 4px 4px 0 radius */}
                {isSectionActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r" />
                )}

                <span className={isSectionActive ? 'text-primary' : 'text-placeholder group-hover:text-secondary'}>
                  {ICON_MAP[sec.iconName] || <LayoutDashboard className="w-[18px] h-[18px]" />}
                </span>

                {!sidebarCollapsed && (
                  <span className="flex-1 truncate">{sec.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            PRODUCTION PROFILE AREA
            Per Specification:
            Display: User Avatar, User Name, User Role, Restaurant Name
            Actions: Profile, My Devices, Security, Logout
            NO role-switching dropdown in real production UI!
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="p-3 border-t border-border bg-surface">
          {!sidebarCollapsed ? (
            <div className="p-3 rounded-xl bg-surfaceMuted border border-borderLight space-y-2.5">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-primary-soft text-primary font-bold flex items-center justify-center text-xs flex-shrink-0 border border-primary/20">
                    {session.fullName ? session.fullName.charAt(0) : 'U'}
                  </div>
                  <span className="w-2.5 h-2.5 bg-success rounded-full absolute bottom-0 right-0 border-2 border-surface" />
                </div>
                <div className="truncate flex-1">
                  <div className="text-[13px] font-semibold text-heading truncate">{session.fullName}</div>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase tracking-wider bg-primary-light text-primary">
                      {session.roleName}
                    </span>
                    <span className="text-[11px] text-muted truncate">
                      {profile.businessName || 'Restaurant'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Area Action Buttons */}
              <div className="pt-2 border-t border-borderLight flex items-center justify-between text-xs text-secondary">
                <button
                  type="button"
                  onClick={() => {
                    setActiveProfileTab('PROFILE');
                    setProfileModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg hover:text-primary hover:bg-surface transition"
                  title="Profile Information"
                >
                  <User className="w-4 h-4 stroke-[1.8]" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveProfileTab('DEVICES');
                    setProfileModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg hover:text-primary hover:bg-surface transition"
                  title="My Devices"
                >
                  <Smartphone className="w-4 h-4 stroke-[1.8]" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveProfileTab('SECURITY');
                    setProfileModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg hover:text-primary hover:bg-surface transition"
                  title="Security & Permissions"
                >
                  <Key className="w-4 h-4 stroke-[1.8]" />
                </button>

                <Link
                  href="/login"
                  className="p-1.5 rounded-lg text-placeholder hover:text-danger hover:bg-danger-bg transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 stroke-[1.8]" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <button
                type="button"
                onClick={() => setProfileModalOpen(true)}
                className="w-9 h-9 rounded-full bg-primary-soft text-primary font-bold flex items-center justify-center text-xs"
              >
                {session.fullName ? session.fullName.charAt(0) : 'U'}
              </button>
              <button
                type="button"
                onClick={() => setSidebarCollapsed(false)}
                className="p-2 rounded-lg text-placeholder hover:text-heading hover:bg-surfaceMuted"
                title="Expand Sidebar"
              >
                <PanelLeft className="w-5 h-5 stroke-[1.8]" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MAIN VIEWPORT & GLOBAL TOPBAR
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        <header className="h-16 border-b border-border bg-surface px-4 sm:px-6 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-secondary hover:text-main hover:bg-surfaceMuted"
            >
              <Store className="w-5 h-5 text-primary" />
            </button>

            {/* Restaurant Switcher */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted hidden sm:inline">Restaurant:</span>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                className="bg-surfaceMuted border border-border text-heading text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-primary"
              >
                <option value="RESTAURANT">🍽️ The Royal Biryani (Dine-In)</option>
                <option value="BAKERY">🥐 Artisan Bakery & Patisserie</option>
                <option value="CLOUD_KITCHEN">🛵 Cloud Kitchen Delivery</option>
                <option value="CAFE">☕ Central Bistro & Cafe</option>
                <option value="BAR">🍸 Taproom & Lounge</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Quick Search */}
            <div className="hidden md:flex relative items-center">
              <Search className="w-3.5 h-3.5 text-placeholder absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search orders, tables, items..."
                className="search-input h-[36px] text-xs pl-8 pr-3 w-52 lg:w-64"
              />
            </div>

            {/* Connection & Sync Status */}
            <button
              type="button"
              onClick={() => setIsOnline(!isOnline)}
              className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border transition ${
                isOnline
                  ? 'bg-success-bg text-success border-emerald-200'
                  : 'bg-danger-bg text-danger border-red-200'
              }`}
              title="Click to toggle Network Simulation"
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success' : 'bg-danger'}`} />
              <span className="hidden sm:inline">{isOnline ? 'Cloud Synced' : 'Offline Mode'}</span>
            </button>

            {/* Notifications */}
            <button
              type="button"
              className="p-2 rounded-xl text-placeholder hover:text-heading hover:bg-surfaceMuted transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4 stroke-[1.9]" />
            </button>

            {/* Architecture Overview */}
            <Link
              href="/screens"
              className="p-2 rounded-xl text-placeholder hover:text-heading hover:bg-surfaceMuted transition"
              title="Portal Architecture"
            >
              <HelpCircle className="w-4 h-4 stroke-[1.9]" />
            </Link>

            {/* POS Fast CTA (Only shown if user has POS permission) */}
            {checkPermission(effectivePermissions, 'pos.view') && (
              <Link href="/pos" className="btn-primary text-xs py-2 px-3.5 hidden sm:inline-flex">
                <Calculator className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>POS</span>
              </Link>
            )}
          </div>
        </header>

        {/* PAGE CONTENT OR 403 FORBIDDEN ACCESS GUARD */}
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          {!isAuthorizedForCurrentRoute ? (
            <div className="min-h-[80vh] flex items-center justify-center p-6 font-sans">
              <div className="card max-w-lg w-full p-8 text-center space-y-5 border-danger/30 shadow-card">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-danger-bg text-danger flex items-center justify-center">
                  <ShieldAlert className="w-7 h-7 stroke-[2]" />
                </div>
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-danger-bg text-danger">
                    403 Forbidden - Access Restricted
                  </span>
                  <h2 className="text-2xl font-bold text-heading">
                    Unauthorized Route
                  </h2>
                  <p className="text-secondary text-sm leading-relaxed">
                    Your role (<strong className="text-heading">{session.roleName}</strong>) does not have
                    permission to access this section (<code className="text-xs bg-surfaceMuted px-1.5 py-0.5 rounded">{pathname}</code>).
                  </p>
                </div>

                <div className="p-3.5 bg-surfaceMuted rounded-xl border border-borderLight text-xs text-left space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted">Required Permission:</span>
                    <span className="font-mono text-heading font-semibold">{requiredPermission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Authenticated Worker:</span>
                    <span className="text-heading font-medium">{session.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Active Tenant:</span>
                    <span className="text-heading font-medium">{profile.businessName}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href={visibleSections[0]?.href || '/pos'}
                    className="btn-primary w-full sm:w-auto text-xs py-2.5 px-6"
                  >
                    Return to Authorized Workspace ({visibleSections[0]?.name || 'Home'})
                  </Link>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto text-xs py-2.5 px-4 text-muted hover:text-heading"
                  >
                    Switch User Login
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            children
          )}
        </main>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            MOBILE NAVIGATION BAR (Bottom Nav)
            Strictly permission-filtered!
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-surface border-t border-border flex items-center justify-around h-16 z-30 px-2">
          {authorizedMobileItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition ${
                  isActive ? 'text-primary font-bold' : 'text-secondary hover:text-main'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5 stroke-[1.8]" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setMoreDrawerOpen(true)}
            className="flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium text-secondary hover:text-main"
          >
            <MoreHorizontal className="w-5 h-5 mb-0.5 stroke-[1.8]" />
            <span>More</span>
          </button>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            MOBILE MORE MENU DRAWER
            Permission-filtered: NEVER show unauthorized modules!
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {moreDrawerOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs lg:hidden flex flex-col justify-end">
            <div className="bg-surface rounded-t-[24px] border-t border-border p-5 max-h-[80vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-borderLight">
                <div>
                  <h3 className="font-semibold text-lg text-heading">Authorized Modules</h3>
                  <p className="text-xs text-muted">Role: {session.roleName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="p-1 rounded-lg text-placeholder hover:text-heading"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {visibleSections.map((sec) => (
                  <Link
                    key={sec.id}
                    href={sec.href}
                    onClick={() => setMoreDrawerOpen(false)}
                    className="p-3 rounded-xl bg-surfaceMuted border border-borderLight flex flex-col items-center text-center space-y-1.5 hover:border-primary/40 transition"
                  >
                    <span className="text-primary">{ICON_MAP[sec.iconName]}</span>
                    <span className="text-xs font-semibold text-heading truncate w-full">{sec.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          PROFILE AREA MODAL
          (Profile, My Devices, Security)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-border max-w-md w-full shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-borderLight flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary-soft text-primary font-bold flex items-center justify-center text-sm">
                  {session.fullName ? session.fullName.charAt(0) : 'U'}
                </div>
                <div>
                  <h3 className="font-semibold text-heading text-[15px]">{session.fullName}</h3>
                  <span className="text-xs text-primary font-semibold uppercase">{session.roleName}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="p-1.5 rounded-lg text-placeholder hover:text-heading"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Tabs */}
            <div className="flex border-b border-borderLight bg-surfaceMuted px-5">
              {(['PROFILE', 'DEVICES', 'SECURITY'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveProfileTab(tab)}
                  className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition ${
                    activeProfileTab === tab
                      ? 'border-primary text-primary'
                      : 'border-transparent text-secondary hover:text-heading'
                  }`}
                >
                  {tab === 'PROFILE' && 'Profile'}
                  {tab === 'DEVICES' && 'My Devices'}
                  {tab === 'SECURITY' && 'Security'}
                </button>
              ))}
            </div>

            <div className="p-5 space-y-4 text-xs">
              {activeProfileTab === 'PROFILE' && (
                <div className="space-y-3">
                  <div>
                    <span className="text-muted block mb-0.5">Email Address</span>
                    <span className="font-semibold text-heading">{session.email || 'user@royalbiryani.pos'}</span>
                  </div>
                  <div>
                    <span className="text-muted block mb-0.5">Restaurant</span>
                    <span className="font-semibold text-heading">{profile.businessName}</span>
                  </div>
                  <div>
                    <span className="text-muted block mb-0.5">Assigned Role</span>
                    <span className="inline-flex px-2 py-0.5 rounded font-semibold bg-primary-light text-primary">
                      {session.roleName}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted block mb-0.5">Worker Terminal ID</span>
                    <span className="font-mono text-heading">{session.deviceId || 'DEV-POS-01'}</span>
                  </div>
                </div>
              )}

              {activeProfileTab === 'DEVICES' && (
                <div className="space-y-2.5">
                  <div className="p-3 bg-surfaceMuted rounded-xl border border-borderLight flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-heading">Counter Terminal (This Device)</div>
                      <div className="text-[11px] text-muted">Platform: Web App / Windows</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-bg text-success">
                      AUTHORIZED
                    </span>
                  </div>
                  <div className="p-3 bg-surfaceMuted rounded-xl border border-borderLight flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-heading">Floor Tablet (Waiter POS)</div>
                      <div className="text-[11px] text-muted">Platform: Android 14</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-bg text-success">
                      ACTIVE
                    </span>
                  </div>
                </div>
              )}

              {activeProfileTab === 'SECURITY' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-heading">Session Authenticated</div>
                      <div className="text-[11px] text-muted">Backend verified JWT session token</div>
                    </div>
                    <span className="text-success font-semibold">Active</span>
                  </div>
                  <div className="pt-2 border-t border-borderLight">
                    <span className="text-muted block mb-1">Effective Level 1/2 Permissions</span>
                    <div className="max-h-24 overflow-y-auto p-2 bg-surfaceMuted rounded-lg font-mono text-[10px] text-heading space-y-0.5">
                      {effectivePermissions.map((p, idx) => (
                        <div key={idx}>• {p}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-borderLight bg-surfaceMuted flex items-center justify-between">
              <Link
                href="/login"
                className="text-danger hover:underline text-xs font-semibold flex items-center space-x-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </Link>
              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="btn-primary text-xs py-1.5 px-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          DEVELOPMENT ONLY ROLE SIMULATOR
          Per Specification:
          "If a role simulator is required for development,
           keep it behind a development-only environment flag:
           NODE_ENV=development. It must never be available in production."
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-40 select-none">
          {devSimulatorOpen ? (
            <div className="bg-surface border-2 border-primary rounded-2xl shadow-2xl p-3 w-64 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-borderLight">
                <span className="font-bold text-primary flex items-center space-x-1">
                  <span>🛠️</span>
                  <span>DEV: Persona Switcher</span>
                </span>
                <button
                  type="button"
                  onClick={() => setDevSimulatorOpen(false)}
                  className="text-placeholder hover:text-heading"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-muted">
                Emulates backend session authentication for development testing:
              </p>

              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'OWNER', label: '👑 Owner (All)' },
                  { id: 'RESTAURANT_ADMIN', label: '🛡️ Admin' },
                  { id: 'MANAGER', label: '💼 Manager' },
                  { id: 'CASHIER', label: '💵 Cashier' },
                  { id: 'WAITER', label: '🍽️ Waiter' },
                  { id: 'KITCHEN', label: '👨‍🍳 Kitchen' },
                  { id: 'ACCOUNTANT', label: '📊 Accountant' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleDevSwitchRole(r.id)}
                    className={`py-1.5 px-2 rounded-lg text-left font-medium transition ${
                      session.roleName === r.id
                        ? 'bg-primary text-white font-bold'
                        : 'bg-surfaceMuted text-heading hover:bg-borderLight'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setDevSimulatorOpen(true)}
              className="bg-heading hover:bg-black text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-lg border border-borderLight flex items-center space-x-1.5 transition opacity-75 hover:opacity-100"
              title="Development Role Simulator"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>[DEV] Role: {session.roleName}</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
