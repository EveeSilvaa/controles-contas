import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Receipt, BarChart3, CalendarDays,
  Bell, Settings, TrendingUp, Target, Landmark,
  ChevronLeft, ChevronRight, Wallet, X
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  notificationCount: number;
  userName: string;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'bills', label: 'Contas', icon: Receipt },
  { id: 'income', label: 'Receitas', icon: TrendingUp },
  { id: 'analytics', label: 'Análises', icon: BarChart3 },
  { id: 'goals', label: 'Metas', icon: Target },
  { id: 'calendar', label: 'Calendário', icon: CalendarDays },
  { id: 'openfinance', label: 'Open Finance', icon: Landmark },
];

const bottomItems = [
  { id: 'notifications', label: 'Notificações', icon: Bell },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

function NavItem({
  item,
  active,
  collapsed,
  badge,
  onClick,
}: {
  item: { id: string; label: string; icon: React.ElementType };
  active: boolean;
  collapsed: boolean;
  badge?: number;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={`nav-item w-full text-left ${active ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
    >
      <div className="relative flex-shrink-0">
        <Icon size={18} />
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-brand text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>
      {!collapsed && (
        <span className="flex-1 truncate">{item.label}</span>
      )}
    </button>
  );
}

export default function Sidebar({
  activeSection,
  onSectionChange,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
  notificationCount,
  userName,
}: SidebarProps) {
  const initials = userName
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 ${collapsed ? 'justify-center px-2' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center flex-shrink-0">
          <Wallet size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <span className="text-white font-bold text-base leading-tight">FinanceFlow</span>
            <span className="block text-[10px] text-sidebar-text leading-tight">Pro</span>
          </div>
        )}
      </div>

      <div className="sidebar-divider" />

      {/* Main nav */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map(item => (
          <NavItem
            key={item.id}
            item={item}
            active={activeSection === item.id}
            collapsed={collapsed}
            onClick={() => { onSectionChange(item.id); onMobileClose(); }}
          />
        ))}
      </nav>

      <div className="sidebar-divider" />

      {/* Bottom nav */}
      <nav className="px-2 py-2 space-y-0.5">
        {bottomItems.map(item => (
          <NavItem
            key={item.id}
            item={item}
            active={activeSection === item.id}
            collapsed={collapsed}
            badge={item.id === 'notifications' ? notificationCount : undefined}
            onClick={() => { onSectionChange(item.id); onMobileClose(); }}
          />
        ))}
      </nav>

      <div className="sidebar-divider" />

      {/* User + collapse toggle */}
      <div className={`px-2 py-3 flex items-center gap-3 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
            <span className="text-sidebar-text text-xs truncate">{userName}</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active transition-colors flex-shrink-0"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="hidden md:flex flex-col h-screen sticky top-0 flex-shrink-0 overflow-hidden"
        style={{ background: '#1C1C28' }}
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed left-0 top-0 bottom-0 w-60 z-50 md:hidden flex flex-col"
              style={{ background: '#1C1C28' }}
            >
              <button
                onClick={onMobileClose}
                className="absolute top-4 right-4 text-sidebar-text hover:text-sidebar-text-active"
              >
                <X size={18} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
