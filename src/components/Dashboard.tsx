import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, CreditCard } from 'lucide-react';

export interface DashboardProps {
  availableMoney: number;
  totalBills: number;
  totalPaid: number;
  balance: number;
  paidBillsCount: number;
  totalBillsCount: number;
  onMoneyChange: (amount: number) => void;
  darkMode: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
}

export default function Dashboard({
  availableMoney,
  totalBills,
  totalPaid,
  balance,
  paidBillsCount,
  totalBillsCount,
  onMoneyChange,
  darkMode
}: DashboardProps) {
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
      title: 'Total de Contas',
      value: totalBills,
      formattedValue: `R$ ${totalBills.toFixed(2)}`,
      icon: CreditCard,
      color: 'blue',
      trend: 'neutral' as const,
      change: `${totalBillsCount} contas`
    },
    {
      title: 'Contas Pagas',
      value: totalPaid,
      formattedValue: `R$ ${totalPaid.toFixed(2)}`,
      icon: TrendingUp,
      color: 'green',
      trend: 'up',
      change: `${paidBillsCount} de ${totalBillsCount}`
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
          />
        ))}
      </div>

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

interface Stat {
  title: string;
  value: number;
  formattedValue: string;
  icon: React.ElementType;
  color: 'green' | 'blue' | 'red';
  trend: 'up' | 'down' | 'neutral';
  change: string;
  isInput?: boolean;
}

interface StatCardProps {
  stat: Stat;
  index: number;
  darkMode: boolean;
  onMoneyChange: (amount: number) => void;
}

function StatCard({ stat, index, onMoneyChange }: StatCardProps) {
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
          'bg-red-100 dark:bg-red-900/20'
        }`}>
          <Icon className={`w-6 h-6 ${
            stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
            stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
            'text-red-600 dark:text-red-400'
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
            onChange={(e) => onMoneyChange(parseFloat(e.target.value) || 0)}
            className="input-modern text-center font-semibold w-full"
            placeholder="0.00"
            step="0.01"
          />
        </>
      ) : (
        <p className={`text-2xl font-bold ${
          stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
          stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
          'text-red-600 dark:text-red-400'
        }`}>
          {stat.formattedValue}
        </p>
      )}
    </motion.div>
  );
}