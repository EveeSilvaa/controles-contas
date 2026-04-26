import { useState, useRef, useEffect } from 'react';
import { Search, Menu, Bell, LogOut, Settings, Calculator, ChevronDown, X } from 'lucide-react';
import type { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onSectionChange: (section: string) => void;
  onMobileMenuToggle: () => void;
  notificationCount: number;
  onCalculatorToggle: () => void;
  activeSection: string;
}

const sectionTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard:    { title: 'Dashboard',      subtitle: 'Visão geral das suas finanças' },
  bills:        { title: 'Contas',         subtitle: 'Gerencie suas despesas' },
  income:       { title: 'Receitas',       subtitle: 'Controle suas entradas' },
  analytics:    { title: 'Análises',       subtitle: 'Insights financeiros' },
  goals:        { title: 'Metas',          subtitle: 'Acompanhe seus objetivos' },
  calendar:     { title: 'Calendário',     subtitle: 'Lembretes e vencimentos' },
  openfinance:  { title: 'Open Finance',   subtitle: 'Conecte seus bancos' },
  notifications:{ title: 'Notificações',  subtitle: 'Alertas e avisos' },
  settings:     { title: 'Configurações', subtitle: 'Preferências do app' },
};

export default function Header({
  user, onLogout, onSectionChange, onMobileMenuToggle,
  notificationCount, onCalculatorToggle, activeSection,
}: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const currentSection = sectionTitles[activeSection] ?? sectionTitles.dashboard;
  const initials = user.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setUserMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  return (
    <header className="h-14 bg-surface border-b border-surface-200 flex items-center px-3 sm:px-4 gap-2 sm:gap-4 sticky top-0 z-30">

      {/* Mobile menu toggle */}
      <button onClick={onMobileMenuToggle} className="md:hidden btn-ghost !px-2">
        <Menu size={20} />
      </button>

      {/* Page title — hidden when mobile search is open */}
      {!searchOpen && (
        <div className="hidden sm:block min-w-0 flex-shrink-0">
          <h1 className="text-sm font-semibold text-ink leading-tight">{currentSection.title}</h1>
          <p className="text-xs text-ink-faint leading-tight">{currentSection.subtitle}</p>
        </div>
      )}

      {/* Mobile title — shown when search is closed */}
      {!searchOpen && (
        <div className="sm:hidden flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-ink truncate">{currentSection.title}</h1>
        </div>
      )}

      {/* Desktop search — always visible */}
      <div className="hidden sm:block flex-1 max-w-xs">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input-sm pl-8 text-xs"
          />
        </div>
      </div>

      {/* Mobile search — expands on tap */}
      {searchOpen && (
        <div className="sm:hidden flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-sm pl-8 text-xs w-full"
            />
          </div>
          <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="btn-ghost !px-2 flex-shrink-0">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Right actions */}
      <div className={`flex items-center gap-0.5 sm:gap-1 ${searchOpen ? '' : 'ml-auto'} flex-shrink-0`}>

        {/* Mobile search toggle */}
        {!searchOpen && (
          <button onClick={() => setSearchOpen(true)} className="sm:hidden btn-ghost !px-2" title="Buscar">
            <Search size={18} />
          </button>
        )}

        {/* Calculator */}
        <button onClick={onCalculatorToggle} className="btn-ghost !px-2" title="Calculadora">
          <Calculator size={18} />
        </button>

        {/* Notifications */}
        <button
          onClick={() => onSectionChange('notifications')}
          className="btn-ghost !px-2 relative"
          title="Notificações"
        >
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 bg-brand text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen(v => !v)}
            className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg hover:bg-surface-100 transition-colors min-h-[44px]"
          >
            <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
            <span className="hidden sm:block text-sm font-medium text-ink max-w-[90px] truncate">
              {user.nome.split(' ')[0]}
            </span>
            <ChevronDown size={13} className="hidden sm:block text-ink-muted flex-shrink-0" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 card shadow-modal py-1 z-50">
              <div className="px-3 py-2 border-b border-surface-100">
                <p className="text-xs font-semibold text-ink truncate">{user.nome}</p>
                <p className="text-xs text-ink-muted truncate">{user.email}</p>
              </div>
              <button
                onClick={() => { onSectionChange('settings'); setUserMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-3 text-sm text-ink hover:bg-surface-50 transition-colors"
              >
                <Settings size={14} className="text-ink-muted" />
                Configurações
              </button>
              <button
                onClick={() => { onLogout(); setUserMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-3 text-sm text-danger hover:bg-danger-light transition-colors"
              >
                <LogOut size={14} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
