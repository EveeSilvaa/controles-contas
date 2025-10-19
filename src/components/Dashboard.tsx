import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, Calendar, Plus } from 'lucide-react';

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

function StatCard({ stat, index, onMoneyChange, onFutureBalanceChange }: StatCardProps) {
  const Icon = stat.icon;
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-500'
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
        <div className={`p-3 rounded-xl ${
          stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
          stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
          stat.color === 'red' ? 'bg-red-100 dark:bg-red-900/20' :
          stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20' :
          'bg-yellow-100 dark:bg-yellow-900/20'
        }`}>
          <Icon className={`w-6 h-6 ${
            stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
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
            {stat.formattedValue}
          </p>
          <input
            type="number"
            value={stat.value}
            onChange={(e) => stat.isFuture ? onFutureBalanceChange?.(parseFloat(e.target.value) || 0) : onMoneyChange?.(parseFloat(e.target.value) || 0)}
            className="input-modern text-center font-semibold w-full"
            placeholder="0.00"
            step="0.01"
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
  futureTransactions = []
}: DashboardProps) {
  const totalFutureBalance = availableMoney + futureBalance;
  
  const stats: Stat[] = [
    {
      title: 'Saldo Disponível',
      value: availableMoney,
      formattedValue: `R$ ${availableMoney.toFixed(2)}`,
      icon: Wallet,
      color: 'green',
      trend: 'up' as const,
      change: '+12%',
      isInput: true
    },
    {
      title: 'Saldo Futuro',
      value: futureBalance,
      formattedValue: `R$ ${futureBalance.toFixed(2)}`,
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
      formattedValue: `R$ ${totalFutureBalance.toFixed(2)}`,
      icon: TrendingUp,
      color: 'blue',
      trend: 'up' as const,
      change: 'Visão completa'
    },
    {
      title: 'Saldo Final',
      value: balance,
      formattedValue: `R$ ${balance.toFixed(2)}`,
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
            onClick={() => addNotification({
              title: 'Nova Transação',
              message: 'Funcionalidade em desenvolvimento! Em breve você poderá adicionar transações futuras detalhadas.',
              date: new Date().toISOString(),
              type: 'system'
            })}
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
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  transaction.received 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.received 
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
                  <p className={`text-lg font-bold ${
                    transaction.received 
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-purple-600 dark:text-purple-400'
                  }`}>
                    R$ {transaction.amount.toFixed(2)}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    transaction.received 
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

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="card-modern h-80"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Despesas por Categoria
          </h3>
          <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500">
            Gráfico de categorias será implementado aqui
          </div>
        </motion.div>

        <motion.div
          className="card-modern h-80"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Histórico de Pagamentos
          </h3>
          <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500">
            Gráfico de histórico será implementado aqui
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}