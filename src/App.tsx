// src/App.tsx
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

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const [bills, setBills] = useState<Bill[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [availableMoney, setAvailableMoney] = useState<number>(5000);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedBills = localStorage.getItem('bills');
    const savedMoney = localStorage.getItem('availableMoney');
    const savedTheme = localStorage.getItem('darkMode');
    const savedReminders = localStorage.getItem('reminders');
    const savedNotifications = localStorage.getItem('notifications');

    if (savedBills) setBills(JSON.parse(savedBills));
    if (savedMoney) setAvailableMoney(parseFloat(savedMoney));
    if (savedTheme) setDarkMode(JSON.parse(savedTheme));
    if (savedReminders) setReminders(JSON.parse(savedReminders));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  // Salvar dados
  useEffect(() => {
    localStorage.setItem('bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('availableMoney', availableMoney.toString());
  }, [availableMoney]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const totalBills = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const paidBills = bills.filter(bill => bill.paid);
  const totalPaid = paidBills.reduce((sum, bill) => sum + bill.amount, 0);
  const balance = availableMoney - totalBills + totalPaid;

  // Função para adicionar notificação
  const addNotification = (notification: Omit<Notification, 'id' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <Layout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
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