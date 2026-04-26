import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import BillsManager from './components/BillsManager';
import IncomeManager from './components/Income';
import Analytics from './components/Analytics';
import Goals from './components/Goals';
import Calendar from './components/Calendar';
import OpenFinance from './components/OpenFinance';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import Auth from './components/CadastroForm';

import type { Bill, Income, Goal, Reminder, Notification, FutureTransaction, User } from './types';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);

  const [bills, setBills] = useState<Bill[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [futureTransactions, setFutureTransactions] = useState<FutureTransaction[]>([]);
  const [availableMoney, setAvailableMoney] = useState<number>(0);

  // ── Load from localStorage ─────────────────────────────────────────────
  useEffect(() => {
    setIsClient(true);
    try {
      const ls = (key: string) => {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : null;
      };

      const savedUser = ls('financeFlowUser');
      const loggedIn = localStorage.getItem('userLoggedIn') === 'true';

      if (savedUser && loggedIn) setUser(savedUser);

      setBills(ls('bills') ?? []);
      setIncomes(ls('incomes') ?? []);
      setGoals(ls('goals') ?? []);
      setReminders(ls('reminders') ?? []);
      setNotifications(ls('notifications') ?? []);
      setFutureTransactions(ls('futureTransactions') ?? []);
      setAvailableMoney(parseFloat(localStorage.getItem('availableMoney') ?? '0') || 0);
    } catch (e) {
      console.error('Error loading from localStorage:', e);
    } finally {
      setTimeout(() => setIsLoading(false), 1800);
    }
  }, []);

  // ── Persist to localStorage ────────────────────────────────────────────
  useEffect(() => { if (isClient) localStorage.setItem('bills', JSON.stringify(bills)); }, [bills, isClient]);
  useEffect(() => { if (isClient) localStorage.setItem('incomes', JSON.stringify(incomes)); }, [incomes, isClient]);
  useEffect(() => { if (isClient) localStorage.setItem('goals', JSON.stringify(goals)); }, [goals, isClient]);
  useEffect(() => { if (isClient) localStorage.setItem('reminders', JSON.stringify(reminders)); }, [reminders, isClient]);
  useEffect(() => { if (isClient) localStorage.setItem('notifications', JSON.stringify(notifications)); }, [notifications, isClient]);
  useEffect(() => { if (isClient) localStorage.setItem('futureTransactions', JSON.stringify(futureTransactions)); }, [futureTransactions, isClient]);
  useEffect(() => { if (isClient) localStorage.setItem('availableMoney', availableMoney.toString()); }, [availableMoney, isClient]);

  // ── Helpers ────────────────────────────────────────────────────────────
  const addNotification = useCallback((n: Omit<Notification, 'id' | 'read'>) => {
    const newN: Notification = { ...n, id: Date.now().toString(), read: false };
    setNotifications(prev => [newN, ...prev.slice(0, 99)]);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('financeFlowUser', JSON.stringify(userData));
    localStorage.setItem('userLoggedIn', 'true');
    addNotification({
      title: `Bem-vindo(a), ${userData.nome.split(' ')[0]}!`,
      message: 'Suas finanças estão esperando por você.',
      date: new Date().toISOString(),
      type: 'system',
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    setUser(null);
    setActiveSection('dashboard');
  };

  const handleAddFutureTransaction = (t: Omit<FutureTransaction, 'id'>) =>
    setFutureTransactions(prev => [...prev, { ...t, id: Date.now().toString() }]);

  const handleDeleteFutureTransaction = (id: string) =>
    setFutureTransactions(prev => prev.filter(t => t.id !== id));

  // ── Render guards ──────────────────────────────────────────────────────
  if (!isClient) return <div className="min-h-screen bg-surface-50" />;
  if (isLoading) return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  if (!user) return <Auth onLogin={handleLogin} />;

  return (
    <Layout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      user={user}
      onLogout={handleLogout}
      notifications={notifications}
    >
      <AnimatePresence mode="wait">
        {activeSection === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Dashboard
              availableMoney={availableMoney}
              onMoneyChange={setAvailableMoney}
              bills={bills}
              incomes={incomes}
              futureTransactions={futureTransactions}
              onAddFutureTransaction={handleAddFutureTransaction}
              onDeleteFutureTransaction={handleDeleteFutureTransaction}
              addNotification={addNotification}
            />
          </motion.div>
        )}

        {activeSection === 'bills' && (
          <motion.div key="bills" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <BillsManager bills={bills} setBills={setBills} addNotification={addNotification} />
          </motion.div>
        )}

        {activeSection === 'income' && (
          <motion.div key="income" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <IncomeManager incomes={incomes} setIncomes={setIncomes} addNotification={addNotification} />
          </motion.div>
        )}

        {activeSection === 'analytics' && (
          <motion.div key="analytics" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Analytics bills={bills} incomes={incomes} />
          </motion.div>
        )}

        {activeSection === 'goals' && (
          <motion.div key="goals" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Goals goals={goals} setGoals={setGoals} bills={bills} />
          </motion.div>
        )}

        {activeSection === 'calendar' && (
          <motion.div key="calendar" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Calendar
              reminders={reminders}
              setReminders={setReminders}
              bills={bills}
              darkMode={false}
              addNotification={addNotification}
            />
          </motion.div>
        )}

        {activeSection === 'openfinance' && (
          <motion.div key="openfinance" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <OpenFinance />
          </motion.div>
        )}

        {activeSection === 'notifications' && (
          <motion.div key="notifications" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Notifications
              notifications={notifications}
              setNotifications={setNotifications}
              addNotification={addNotification}
            />
          </motion.div>
        )}

        {activeSection === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Settings user={user} onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
