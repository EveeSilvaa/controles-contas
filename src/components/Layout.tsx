import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Calculator from './Calculator';
import Footer from './Footer';

interface User {
  nome: string;
  email: string;
  celular: string;
}

interface LayoutSCProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

export default function Layout({ 
  children, 
  activeSection, 
  onSectionChange, 
  darkMode, 
  setDarkMode 
}: LayoutSCProps) {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  useEffect(() => {
    setUser({
      nome: 'Usuário Financeiro',
      email: 'usuario@finance.com',
      celular: '(11) 99999-9999'
    });
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLogout = () => {
    console.log('Logout realizado');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-baby-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-400"></div>
      </div>
    );
  }

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
          ${sidebarOpen ? 'lg:ml-54' : 'lg:ml-30'}
        `}>
          <Header 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            user={user}
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