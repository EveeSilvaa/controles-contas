import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Calculator from './Calculator';
import Footer from './Footer';

interface User {
  id: string;
  nome: string;
  email: string;
  celular: string;
}

interface LayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  user?: User;
  onLogout?: () => void;
}

export default function Layout({ 
  children, 
  activeSection, 
  onSectionChange, 
  darkMode, 
  setDarkMode,
  user,
  onLogout
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Fechar sidebar no mobile quando redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const defaultUser: User = {
    id: '1',
    nome: 'Usuário Financeiro',
    email: 'usuario@finance.com',
    celular: '(11) 99999-9999'
  };

  const currentUser = user || defaultUser;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      console.log('Logout realizado');
    }
  };

  return (
    <>
      <div className="flex h-screen bg-baby-50 dark:bg-gray-900 overflow-hidden">
        <Sidebar 
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          darkMode={darkMode}
          onThemeToggle={() => setDarkMode(!darkMode)}
          sidebarOpen={sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          setSidebarOpen={setSidebarOpen}
        />
        
        {/* Conteúdo principal */}
        <div className={`
          flex-1 flex flex-col transition-all duration-300 min-w-0
          ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}
        `}>
          <Header 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            user={currentUser}
            handleLogout={handleLogout}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onCalculatorToggle={() => setCalculatorOpen(!calculatorOpen)}
          />
          <Footer />
          
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-br from-baby-50 via-white to-pink-50 dark:from-gray-900 dark:via-pink-900/20 dark:to-gray-800">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>

        {/* Calculadora Flutuante */}
        <Calculator 
          isOpen={calculatorOpen}
          onClose={() => setCalculatorOpen(false)}
          darkMode={darkMode}
        />
      </div>
    </>
  );
}