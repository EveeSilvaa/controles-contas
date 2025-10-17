// src/components/Header.tsx
import { motion } from 'framer-motion';
import { Search, User, Menu, Bell, Sun, Moon, LogOut, Settings, Calculator } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  user: {
    nome: string;
    email: string;
    celular: string;
  };
  handleLogout: () => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  onCalculatorToggle: () => void;
}

export default function Header({ 
  sidebarOpen, 
  setSidebarOpen, 
  user, 
  handleLogout, 
  darkMode, 
  setDarkMode,
  onCalculatorToggle
}: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className={`
      w-full bg-white dark:bg-pink-900 shadow-sm border-b border-baby-200 dark:border-pink-700 z-30
    `}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Lado esquerdo - Botão menu */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-500 hover:text-gray-600 dark:text-pink-200 dark:hover:text-white rounded-lg hover:bg-baby-100 dark:hover:bg-pink-800 transition-colors md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Barra de pesquisa - Centralizada */}
          <div className="flex-1 max-w-2xl mx-4 md:mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Pesquisar contas, transações..."
                className="w-full pl-10 pr-4 py-2 border border-baby-300 dark:border-pink-600 rounded-lg bg-white dark:bg-pink-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Lado direito - Ícones e usuário */}
          <div className="flex items-center space-x-3">
            {/* Botão Calculadora */}
            <motion.button
              onClick={onCalculatorToggle}
              className="p-2 text-gray-500 hover:text-gray-600 dark:text-pink-200 dark:hover:text-white rounded-lg hover:bg-baby-100 dark:hover:bg-pink-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Calculadora"
            >
              <Calculator className="w-5 h-5" />
            </motion.button>

            {/* Botão dark/light mode */}
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-500 hover:text-gray-600 dark:text-pink-200 dark:hover:text-white rounded-lg hover:bg-baby-100 dark:hover:bg-pink-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={darkMode ? "Modo claro" : "Modo escuro"}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {/* Notificações */}
            <motion.button 
              className="p-2 text-gray-500 hover:text-gray-600 dark:text-pink-200 dark:hover:text-white rounded-lg hover:bg-baby-100 dark:hover:bg-pink-800 transition-colors relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Notificações"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </motion.button>

            {/* Menu do usuário */}
            <div className="relative">
              <motion.button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-baby-100 dark:hover:bg-pink-800 transition-colors min-w-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Menu do usuário"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0">
                  {user.nome.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden lg:block min-w-0">
                  <span className="text-sm font-medium text-gray-700 dark:text-white block truncate max-w-[120px]">
                    {user.nome}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-pink-200 truncate max-w-[120px]">
                    Premium
                  </span>
                </div>
              </motion.button>

              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-pink-800 rounded-xl shadow-lg border border-baby-200 dark:border-pink-700 py-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-baby-200 dark:border-pink-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.nome}</p>
                    <p className="text-sm text-gray-500 dark:text-pink-200 truncate">{user.email}</p>
                    <p className="text-xs text-gray-400 dark:text-pink-300 mt-1 truncate">{user.celular}</p>
                  </div>
                  
                  <div className="py-1">
                    <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-pink-200 hover:bg-baby-100 dark:hover:bg-pink-700 transition-colors">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">Meu Perfil</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-pink-200 hover:bg-baby-100 dark:hover:bg-pink-700 transition-colors">
                      <Settings className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">Configurações</span>
                    </button>
                  </div>
                  
                  <div className="border-t border-baby-200 dark:border-pink-700 pt-1">
                    <button
                      onClick={() => {
                        handleLogout();
                        setUserMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4 flex-shrink-0" />
                      <span>Sair da conta</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}