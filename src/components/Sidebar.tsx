import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  DollarSign, 
  PieChart, 
  Settings,
  Calendar,
  FileText,
  Bell,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  darkMode: boolean;
  onThemeToggle: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onSidebarToggle: () => void;
}

export default function Sidebar({ 
  activeSection, 
  onSectionChange, 
  darkMode, 
  sidebarOpen,
  onSidebarToggle 
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'bills', label: 'Contas', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'calendar', label: 'Calendário', icon: Calendar },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  // Função para lidar com clique nos itens do menu (fecha sidebar no mobile)
  const handleMenuClick = (sectionId: string) => {
    onSectionChange(sectionId);
    
    // Fecha sidebar automaticamente no mobile
    if (window.innerWidth < 1024) { // lg breakpoint
      onSidebarToggle();
    }
  };

  return (
    <>
      {/* Overlay para mobile  */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onSidebarToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar  Sempre visível no desktop */}
      <motion.div
        className={`fixed lg:static h-screen z-50 ${
          darkMode 
            ? 'bg-gray-900/95 border-r border-pink-500' 
            : 'bg-white/95 border-r border-baby-200'
        } shadow-xl transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
        initial={{ x: -300 }}
        animate={{ 
          x: 0,
          // No mobile: sidebar fica escondido por padrão
          // No desktop: sidebar sempre visível
          transform: window.innerWidth >= 1024 ? 'translateX(0)' : (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)')
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ 
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Header do Sidebar */}
        <div className="p-4 border-b border-baby-200 dark:border-pink-400">
          <div className="flex items-center justify-between">
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  className="flex items-center gap-3 flex-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-pink-500 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      FinanceFlow
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-pink-200">
                      Controle financeiro
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Botão de toggle do sidebar - SEMPRE VISÍVEL */}
            <motion.button
              onClick={onSidebarToggle}
              className={`p-2 rounded-lg ${
                darkMode 
                  ? 'hover:bg-pink-800 text-pink-200' 
                  : 'hover:bg-baby-100 text-gray-600'
              } transition-colors`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                      activeSection === item.id
                        ? 'bg-pink-500 text-white shadow-md'
                        : darkMode
                        ? 'text-pink-200 hover:bg-pink-800'
                        : 'text-gray-700 hover:bg-baby-100'
                    } ${!sidebarOpen ? 'justify-center' : ''}`}
                    title={!sidebarOpen ? item.label : ''}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="font-medium whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </nav>
      </motion.div>
    </>
  );
}