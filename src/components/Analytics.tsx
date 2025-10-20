import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp, TrendingDown, PieChart, BarChart3, Calendar, Download } from 'lucide-react';

interface AnalyticsProps {
  bills: { amount: number; paid: boolean }[];
  darkMode: boolean;
}

export default function Analytics({ bills }: AnalyticsProps) {
  const analyticsData = {
    monthlySpending: [
      { month: 'Jan', amount: 1200 },
      { month: 'Fev', amount: 1800 },
      { month: 'Mar', amount: 1500 },
      { month: 'Abr', amount: 2200 },
      { month: 'Mai', amount: 1900 },
      { month: 'Jun', amount: 2100 },
    ],
    categories: [
      { name: 'Casa', amount: 3200, percentage: 35, color: 'bg-baby-400' },
      { name: 'Alimentação', amount: 1800, percentage: 20, color: 'bg-baby-500' },
      { name: 'Transporte', amount: 1200, percentage: 13, color: 'bg-baby-600' },
      { name: 'Saúde', amount: 800, percentage: 9, color: 'bg-purple-400' },
      { name: 'Lazer', amount: 600, percentage: 7, color: 'bg-purple-500' },
      { name: 'Outros', amount: 1400, percentage: 16, color: 'bg-gray-400' },
    ],
    spendingTrend: '+12%',
    averageBill: bills.length > 0 ? (bills.reduce((sum, bill) => sum + bill.amount, 0) / bills.length).toFixed(2) : '0',
    paidOnTime: bills.length > 0 ? Math.round((bills.filter(bill => bill.paid).length / bills.length) * 100) : 0,
  };

  const totalSpent = analyticsData.categories.reduce((sum, cat) => sum + cat.amount, 0);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Análise Financeira
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Insights detalhados sobre seus gastos e padrões
          </p>
        </div>

        <motion.button
          className="btn-primary flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="w-4 h-4" />
          Exportar Relatório
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Gasto Total"
          value={`${formatCurrency(totalSpent)}`}
          change={analyticsData.spendingTrend}
          trend="up"
          icon={TrendingUp}
          darkMode={false}
        />
        <StatCard
          title="Conta Média"
          value={`${formatCurrency(Number(analyticsData.averageBill))}`}
          change="+5%"
          trend="up"
          icon={BarChart3}
          darkMode={false}
        />
        <StatCard
          title="Pagamentos em Dia"
          value={`${analyticsData.paidOnTime}%`}
          change="+8%"
          trend="up"
          icon={Calendar}
          darkMode={false}
        />
        <StatCard
          title="Economia Mensal"
          value="R$ 1.200"
          change="+15%"
          trend="up"
          icon={TrendingDown}
          darkMode={false}
        />
      </div>

      {/* Gráficos e Visualizações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Gastos Mensais */}
        <motion.div
          className="card-modern"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Gastos Mensais
            </h3>
            <BarChart3 className="w-5 h-5 text-baby-500" />
          </div>
          <div className="space-y-4">
            {analyticsData.monthlySpending.map((item, index) => (
              <div key={item.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">
                  {item.month}
                </span>
                <div className="flex-1 mx-4">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <motion.div
                          className="bg-gradient-to-r from-baby-400 to-baby-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.amount / 2500) * 100}%` }}
                          transition={{ delay: index * 0.1 + 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white w-20 text-right">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Gráfico de Pizza - Por Categoria */}
        <motion.div
          className="card-modern"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Gastos por Categoria
            </h3>
            <PieChart className="w-5 h-5 text-baby-500" />
          </div>
          <div className="space-y-4">
            {analyticsData.categories.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${category.color}`} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <motion.div
                      className={`h-2 rounded-full ${category.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{ delay: index * 0.1 + 0.7 }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white w-16 text-right">
                    {category.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Insights e Recomendações */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="card-modern">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💡 Insights
          </h3>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-baby-400 rounded-full mt-1.5 flex-shrink-0" />
              <span>Seus gastos com casa representam 35% do total - considere renegociar</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-baby-400 rounded-full mt-1.5 flex-shrink-0" />
              <span>Economia mensal aumentou 15% em relação ao mês anterior</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-baby-400 rounded-full mt-1.5 flex-shrink-0" />
              <span>{analyticsData.paidOnTime}% das contas foram pagas em dia - excelente!</span>
            </li>
          </ul>
        </div>

        <div className="card-modern">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🎯 Metas
          </h3>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
              <span>Reduzir gastos com alimentação em 10% este mês</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-1.5 flex-shrink-0" />
              <span>Aumentar economia mensal para R$ 1.500</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
              <span>Manter 90%+ de pagamentos em dia</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  darkMode: boolean;
}

function StatCard({ title, value, change, trend, icon: Icon }: StatCardProps) {
  return (
    <motion.div
      className="card-modern group"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-baby-100 dark:bg-baby-900/20">
          <Icon className="w-5 h-5 text-baby-600 dark:text-baby-400" />
        </div>
        <div className={`flex items-center gap-1 text-sm ${
          trend === 'up' ? 'text-green-500' : 'text-red-500'
        }`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{change}</span>
        </div>
      </div>

      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        {title}
      </h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </motion.div>
  );
}