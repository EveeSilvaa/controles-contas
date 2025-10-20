import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, Calendar, Plus, X, BarChart3, PieChart } from 'lucide-react';
import { formatCurrency, parseFormattedNumber, formatInputCurrency } from '../utils/formatters';

interface DashboardProps {
  availableMoney: number;
  totalBills: number;
  totalPaid: number;
  balance: number;
  paidBillsCount: number;
  totalBillsCount: number;
  onMoneyChange: (amount: number) => void;
  darkMode: boolean;
  addNotification: (notification: { title: string; message: string; date: string; type: 'bill' | 'reminder' | 'system' }) => void;
  futureBalance: number;
  onFutureBalanceChange: (amount: number) => void;
  futureTransactions: FutureTransaction[];
  onAddFutureTransaction: (transaction: Omit<FutureTransaction, 'id'>) => void;
  bills: Bill[];
}

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  category: string;
}

interface FutureTransaction {
  id: string;
  description: string;
  amount: number;
  expectedDate: string;
  received: boolean;
}

interface Stat {
  title: string;
  value: number;
  formattedValue: string;
  icon: React.ElementType;
  color: 'green' | 'blue' | 'red' | 'purple' | 'yellow';
  trend: 'up' | 'down' | 'neutral';
  change: string;
  isInput?: boolean;
  isFuture?: boolean;
}

interface StatCardProps {
  stat: Stat;
  index: number;
  darkMode: boolean;
  onMoneyChange?: (amount: number) => void;
  onFutureBalanceChange?: (amount: number) => void;
}

// Componente do Gráfico de Pizza
function PieChartComponent({ bills }: { bills: Bill[], darkMode: boolean }) {
  const categories = bills.reduce((acc, bill) => {
    const category = bill.category || 'Outros';
    if (!acc[category]) {
      acc[category] = { amount: 0, count: 0, color: getCategoryColor(category) };
    }
    acc[category].amount += bill.amount;
    acc[category].count += 1;
    return acc;
  }, {} as Record<string, { amount: number; count: number; color: string }>);

  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const categoriesArray = Object.entries(categories).map(([name, data]) => ({
    name,
    amount: data.amount,
    percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0,
    color: data.color,
    count: data.count
  })).sort((a, b) => b.amount - a.amount);

  const getCategoryColor = (category: string) => {
    const colors = {
      'casa': '#ec4899',
      'alimentacao': '#8b5cf6',
      'transporte': '#06b6d4',
      'saude': '#10b981',
      'educacao': '#f59e0b',
      'lazer': '#ef4444',
      'outros': '#6b7280'
    };
    return colors[category as keyof typeof colors] || '#6b7280';
  };

  if (bills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-400 dark:text-gray-500">
        <PieChart className="w-12 h-12 mb-2" />
        <p>Nenhuma despesa cadastrada</p>
      </div>
    );
  }

  return (
    <div className="h-48">
      <div className="grid grid-cols-2 gap-4 h-full">
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            {categoriesArray.map((category, index) => {
              const circumference = 2 * Math.PI * 40;
              const strokeDasharray = circumference;
              const strokeDashoffset = circumference - (category.percentage / 100) * circumference;
              const rotation = categoriesArray
                .slice(0, index)
                .reduce((sum, cat) => sum + (cat.percentage / 100) * 360, 0);

              return (
                <circle
                  key={category.name}
                  cx="50%"
                  cy="50%"
                  r="40"
                  fill="none"
                  stroke={category.color}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  transform={`rotate(${rotation} 50 50)`}
                  className="transition-all duration-500"
                />
              );
            })}
          </div>
        </div>

        <div className="space-y-2 overflow-y-auto max-h-40">
          {categoriesArray.map((category) => (
            <div key={category.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-gray-700 dark:text-gray-300 capitalize">
                  {category.name}
                </span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(category.amount)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {category.percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente do Histórico de Pagamentos
function PaymentHistory({ bills }: { bills: Bill[], darkMode: boolean }) {
  const recentBills = bills
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
    .slice(0, 6);

  const getStatusColor = (paid: boolean, dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);

    if (paid) return 'text-green-600 dark:text-green-400';
    if (due < today) return 'text-red-600 dark:text-red-400';
    return 'text-yellow-600 dark:text-yellow-400';
  };

  const getStatusText = (paid: boolean, dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);

    if (paid) return 'Pago';
    if (due < today) return 'Atrasado';
    return 'Pendente';
  };

  if (bills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-400 dark:text-gray-500">
        <BarChart3 className="w-12 h-12 mb-2" />
        <p>Nenhuma conta cadastrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-48 overflow-y-auto">
      {recentBills.map((bill, index) => (
        <motion.div
          key={bill.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${bill.paid ? 'bg-green-500' : new Date(bill.dueDate) < new Date() ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
            <div>
              <div className="font-medium text-gray-900 dark:text-white text-sm">
                {bill.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(bill.dueDate).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-gray-900 dark:text-white text-sm">
              {formatCurrency(bill.amount)}
            </div>
            <div className={`text-xs font-medium ${getStatusColor(bill.paid, bill.dueDate)}`}>
              {getStatusText(bill.paid, bill.dueDate)}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Modal para adicionar transação futura
function AddFutureTransactionModal({
  isOpen,
  onClose,
  onAdd,
  darkMode
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: Omit<FutureTransaction, 'id'>) => void;
  darkMode: boolean;
}) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    expectedDate: new Date().toISOString().split('T')[0],
    received: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description && formData.amount && formData.expectedDate) {
      onAdd({
        description: formData.description,
        amount: parseFormattedNumber(formData.amount),
        expectedDate: formData.expectedDate,
        received: formData.received
      });
      setFormData({
        description: '',
        amount: '',
        expectedDate: new Date().toISOString().split('T')[0],
        received: false
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-md rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Nova Transação Futura
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-modern w-full"
              placeholder="Ex: Salário, Freelance, Bônus..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Valor (R$)
            </label>
            <input
              type="text"
              value={formatInputCurrency(formData.amount)}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="input-modern w-full"
              placeholder="0,00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Esperada
            </label>
            <input
              type="date"
              value={formData.expectedDate}
              onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
              className="input-modern w-full"
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="received"
              checked={formData.received}
              onChange={(e) => setFormData({ ...formData, received: e.target.checked })}
              className="w-4 h-4 text-pink-500 rounded focus:ring-pink-400"
            />
            <label htmlFor="received" className="text-sm text-gray-700 dark:text-gray-300">
              Já recebido?
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              Adicionar
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function StatCard({ stat, index, onMoneyChange, onFutureBalanceChange }: StatCardProps) {
  const [inputValue, setInputValue] = useState(formatInputCurrency(stat.value.toString()));
  const Icon = stat.icon;
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-500'
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const numericValue = parseFormattedNumber(value);
    
    if (stat.isFuture) {
      onFutureBalanceChange?.(numericValue);
    } else {
      onMoneyChange?.(numericValue);
    }
  };


  return (
    <motion.div
      className="card-modern group"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
            stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
              stat.color === 'red' ? 'bg-red-100 dark:bg-red-900/20' :
                stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20' :
                  'bg-yellow-100 dark:bg-yellow-900/20'
          }`}>
          <Icon className={`w-6 h-6 ${stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
              stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                stat.color === 'red' ? 'text-red-600 dark:text-red-400' :
                  stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                    'text-yellow-600 dark:text-yellow-400'
            }`} />
        </div>
        <div className={`flex items-center gap-1 text-sm ${trendColors[stat.trend]}`}>
          {stat.trend === 'up' && <TrendingUp className="w-4 h-4" />}
          {stat.trend === 'down' && <TrendingDown className="w-4 h-4" />}
          <span>{stat.change}</span>
        </div>
      </div>

      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        {stat.title}
      </h3>

       {stat.isInput ? (
        <>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {formatCurrency(stat.value)}
          </p>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={() => setInputValue(formatInputCurrency(stat.value.toString()))}
            className="input-modern text-center font-semibold w-full"
            placeholder="0,00"
          />
        </>
      ) : (
        <p className={`text-2xl font-bold ${
          stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
          stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
          stat.color === 'red' ? 'text-red-600 dark:text-red-400' :
          stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
          'text-yellow-600 dark:text-yellow-400'
        }`}>
          {stat.formattedValue}
        </p>
      )}
    </motion.div>
  );
}

export default function Dashboard({
  availableMoney,
  balance,
  onMoneyChange,
  darkMode,
  addNotification,
  futureBalance,
  onFutureBalanceChange,
  futureTransactions = [],
  onAddFutureTransaction,
  bills
}: DashboardProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const totalFutureBalance = availableMoney + futureBalance;

  const stats: Stat[] = [
    {
      title: 'Saldo Disponível',
      value: availableMoney,
      formattedValue: formatCurrency(availableMoney),
      icon: Wallet,
      color: 'green',
      trend: 'up' as const,
      change: '+12%',
      isInput: true
    },
    {
      title: 'Saldo Futuro',
      value: futureBalance,
      formattedValue: formatCurrency(futureBalance),
      icon: Calendar,
      color: 'purple',
      trend: 'up' as const,
      change: 'Próximos dias',
      isInput: true,
      isFuture: true
    },
    {
      title: 'Total com Futuro',
      value: totalFutureBalance,
      formattedValue: formatCurrency(totalFutureBalance),
      icon: TrendingUp,
      color: 'blue',
      trend: 'up' as const,
      change: 'Visão completa'
    },
    {
      title: 'Saldo Final',
      value: balance,
      formattedValue: formatCurrency(balance),
      icon: balance >= 0 ? TrendingUp : TrendingDown,
      color: balance >= 0 ? 'green' : 'red',
      trend: balance >= 0 ? 'up' as const : 'down' as const,
      change: balance >= 0 ? 'Positivo' : 'Negativo'
    }
  ];

  React.useEffect(() => {
    if (balance < 0) {
      addNotification({
        title: 'Saldo Negativo',
        message: 'Seu saldo final está negativo. Revise suas despesas.',
        date: new Date().toISOString(),
        type: 'system'
      });
    }
  }, [balance, addNotification]);

  const handleAddTransaction = (transaction: Omit<FutureTransaction, 'id'>) => {
    onAddFutureTransaction(transaction);
    addNotification({
      title: 'Transação Futura Adicionada',
      message: `${transaction.description} de ${formatCurrency(transaction.amount)} foi adicionada.`,
      date: new Date().toISOString(),
      type: 'system'
    });
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard Financeiro
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visão geral das suas finanças e contas
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            stat={stat}
            index={index}
            darkMode={darkMode}
            onMoneyChange={onMoneyChange}
            onFutureBalanceChange={onFutureBalanceChange}
          />
        ))}
      </div>

      {/* Seção de Transações Futuras */}
      <motion.div
        className="card-modern"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            💫 Transações Futuras
          </h3>
          <motion.button
            className="btn-primary flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </motion.button>
        </div>

        {futureTransactions.length > 0 ? (
          <div className="space-y-3">
            {futureTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-lg border ${transaction.received
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.received
                      ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400'
                      : 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-400'
                    }`}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {transaction.description}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Previsto para {new Date(transaction.expectedDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${transaction.received
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-purple-600 dark:text-purple-400'
                    }`}>
                    {formatCurrency(transaction.amount)}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${transaction.received
                      ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300'
                      : 'bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300'
                    }`}>
                    {transaction.received ? 'Recebido' : 'Pendente'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-purple-500 dark:text-purple-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhuma transação futura
            </h4>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Adicione valores que você espera receber futuramente
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Use o campo "Saldo Futuro" acima para adicionar valores totais esperados
            </p>
          </div>
        )}
      </motion.div>

      {/* Charts Reais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="card-modern"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-pink-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Despesas por Categoria
            </h3>
          </div>
          <PieChartComponent bills={bills} darkMode={darkMode} />
        </motion.div>

        <motion.div
          className="card-modern"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-pink-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Histórico de Pagamentos
            </h3>
          </div>
          <PaymentHistory bills={bills} darkMode={darkMode} />
        </motion.div>
      </div>

      {/* Modal para adicionar transação futura */}
      <AnimatePresence>
        {showAddModal && (
          <AddFutureTransactionModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddTransaction}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}