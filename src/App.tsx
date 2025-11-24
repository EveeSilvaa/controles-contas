import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import BillsManager from './components/BillsManager';
import Analytics from './components/Analytics';
import Calendar from './components/Calendar';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import Auth from './components/CadastroForm';

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  category: string;
  description?: string;
  installments?: number;
  currentInstallment?: number;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  completed: boolean;
  billId?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'bill' | 'reminder' | 'system';
}

export interface User {
  id: string;
  nome: string;
  email: string;
  celular: string;
}

export interface FutureTransaction {
  id: string;
  description: string;
  amount: number;
  expectedDate: string;
  received: boolean;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(true);

  const [bills, setBills] = useState<Bill[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [availableMoney, setAvailableMoney] = useState<number>(0);
  const [futureBalance, setFutureBalance] = useState<number>(0);
  const [futureTransactions, setFutureTransactions] = useState<FutureTransaction[]>([]);

  // Estado para controlar se estamos no client
  const [isClient, setIsClient] = useState(false);

  // Carregar dados do localStorage APENAS no client
  useEffect(() => {
    setIsClient(true);
    
    try {
      const savedUser = localStorage.getItem('financeFlowUser');
      const savedBills = localStorage.getItem('bills');
      const savedMoney = localStorage.getItem('availableMoney');
      const savedTheme = localStorage.getItem('darkMode');
      const savedReminders = localStorage.getItem('reminders');
      const savedNotifications = localStorage.getItem('notifications');
      const savedFutureBalance = localStorage.getItem('futureBalance');
      const savedFutureTransactions = localStorage.getItem('futureTransactions');
      const userLoggedIn = localStorage.getItem('userLoggedIn');

      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedBills) setBills(JSON.parse(savedBills));
      if (savedMoney) setAvailableMoney(parseFloat(savedMoney));
      if (savedTheme) setDarkMode(JSON.parse(savedTheme));
      if (savedReminders) setReminders(JSON.parse(savedReminders));
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
      if (savedFutureBalance) setFutureBalance(parseFloat(savedFutureBalance));
      if (savedFutureTransactions) setFutureTransactions(JSON.parse(savedFutureTransactions));
      
      // Se usuário estava logado, não mostrar tela de auth
      if (userLoggedIn === 'true' && savedUser) {
        setShowAuth(false);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 2000);
    }
  }, []);

  // Salvar dados
  useEffect(() => {
    if (user && isClient) {
      try {
        localStorage.setItem('bills', JSON.stringify(bills));
      } catch (error) {
        console.error('Erro ao salvar contas:', error);
      }
    }
  }, [bills, user, isClient]);

  useEffect(() => {
    if (user && isClient) {
      try {
        localStorage.setItem('availableMoney', availableMoney.toString());
      } catch (error) {
        console.error('Erro ao salvar dinheiro disponível:', error);
      }
    }
  }, [availableMoney, user, isClient]);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
      } catch (error) {
        console.error('Erro ao salvar tema:', error);
      }
    }
  }, [darkMode, isClient]);

  useEffect(() => {
    if (user && isClient) {
      try {
        localStorage.setItem('reminders', JSON.stringify(reminders));
      } catch (error) {
        console.error('Erro ao salvar lembretes:', error);
      }
    }
  }, [reminders, user, isClient]);

  useEffect(() => {
    if (user && isClient) {
      try {
        localStorage.setItem('notifications', JSON.stringify(notifications));
      } catch (error) {
        console.error('Erro ao salvar notificações:', error);
      }
    }
  }, [notifications, user, isClient]);

  useEffect(() => {
    if (user && isClient) {
      try {
        localStorage.setItem('futureBalance', futureBalance.toString());
      } catch (error) {
        console.error('Erro ao salvar saldo futuro:', error);
      }
    }
  }, [futureBalance, user, isClient]);

  useEffect(() => {
    if (user && isClient) {
      try {
        localStorage.setItem('futureTransactions', JSON.stringify(futureTransactions));
      } catch (error) {
        console.error('Erro ao salvar transações futuras:', error);
      }
    }
  }, [futureTransactions, user, isClient]);

  const totalBills = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const paidBills = bills.filter(bill => bill.paid);
  const totalPaid = paidBills.reduce((sum, bill) => sum + bill.amount, 0);
  
  // SALDO FINAL AGORA INCLUI O SALDO FUTURO
  const balance = availableMoney - totalBills + totalPaid + futureBalance;

  // Função para adicionar notificação
  const addNotification = (notification: Omit<Notification, 'id' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Função para lidar com login
  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowAuth(false);
    
    // Salvar estado de login
    if (isClient) {
      localStorage.setItem('userLoggedIn', 'true');
    }
    
    // Adiciona notificação de boas-vindas
    addNotification({
      title: 'Bem-vindo(a)! 🎉',
      message: `Que bom te ver por aqui, ${userData.nome}! Suas finanças estão esperando por você.`,
      date: new Date().toISOString(),
      type: 'system'
    });
  };

  // Função para lidar com logout
  const handleLogout = () => {
    if (isClient) {
      localStorage.removeItem('userLoggedIn');
    }
    setUser(null);
    setShowAuth(true);
  };

  // Função para adicionar transação futura
  const handleAddFutureTransaction = (transaction: Omit<FutureTransaction, 'id'>) => {
    const newTransaction: FutureTransaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setFutureTransactions(prev => [...prev, newTransaction]);
  };

  // Não renderizar nada até estar no client
  if (!isClient) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />;
  }

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  // Mostrar tela de autenticação se não houver usuário logado
  if (showAuth || !user) {
    return <Auth onLogin={handleLogin} darkMode={darkMode} />;
  }

  return (
    <Layout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      user={user}
      onLogout={handleLogout}
    >
      <AnimatePresence mode="wait">
        {activeSection === 'dashboard' && (
          <Dashboard
            availableMoney={availableMoney}
            totalBills={totalBills}
            totalPaid={totalPaid}
            balance={balance}
            paidBillsCount={paidBills.length}
            totalBillsCount={bills.length}
            onMoneyChange={setAvailableMoney}
            darkMode={darkMode}
            addNotification={addNotification}
            futureBalance={futureBalance}
            onFutureBalanceChange={setFutureBalance}
            futureTransactions={futureTransactions}
            onAddFutureTransaction={handleAddFutureTransaction}
            bills={bills}
          />
        )}

        {activeSection === 'bills' && (
          <BillsManager
            bills={bills}
            setBills={setBills}
            darkMode={darkMode}
            addNotification={addNotification}
          />
        )}

        {activeSection === 'analytics' && (
          <Analytics
            bills={bills}
            darkMode={darkMode}
          />
        )}

        {activeSection === 'calendar' && (
          <Calendar
            reminders={reminders}
            setReminders={setReminders}
            bills={bills}
            darkMode={darkMode}
            addNotification={addNotification}
          />
        )}

        {activeSection === 'notifications' && (
          <Notifications
            notifications={notifications}
            setNotifications={setNotifications}
            darkMode={darkMode}
            addNotification={addNotification}
          />
        )}

        {activeSection === 'settings' && (
          <Settings
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}