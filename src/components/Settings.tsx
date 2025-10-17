// src/components/Settings.tsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Sun, Moon, Bell, Download, Upload, Trash2, User, Shield, HelpCircle } from 'lucide-react';

interface SettingsProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

export default function Settings({ darkMode, setDarkMode }: SettingsProps) {
  const [activeTab, setActiveTab] = useState('appearance');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);

  const exportData = () => {
    const data = {
      bills: localStorage.getItem('bills'),
      reminders: localStorage.getItem('reminders'),
      settings: localStorage.getItem('darkMode'),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financeflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          
          if (data.bills) localStorage.setItem('bills', data.bills);
          if (data.reminders) localStorage.setItem('reminders', data.reminders);
          if (data.settings) localStorage.setItem('darkMode', data.settings);
          
          alert('Dados importados com sucesso! A página será recarregada.');
          window.location.reload();
        } catch {
          alert('Erro ao importar dados. Verifique se o arquivo é válido.');
        }
      };
      reader.readAsText(file);
    }
  };

  const clearAllData = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      localStorage.clear();
      alert('Todos os dados foram removidos. A página será recarregada.');
      window.location.reload();
    }
  };

  const tabs = [
    { id: 'appearance', label: 'Aparência', icon: Sun },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'backup', label: 'Backup', icon: Download },
    { id: 'account', label: 'Conta', icon: User },
    { id: 'privacy', label: 'Privacidade', icon: Shield },
    { id: 'help', label: 'Ajuda', icon: HelpCircle },
  ];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Configurações
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Personalize sua experiência no FinanceFlow
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Menu lateral */}
        <div className="lg:col-span-1">
          <div className="card-modern space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-pink-500 text-white shadow-md'
                      : darkMode
                      ? 'text-pink-200 hover:bg-pink-800'
                      : 'text-gray-700 hover:bg-baby-100'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="lg:col-span-3">
          <div className="card-modern">
            {/* Aparência */}
            {activeTab === 'appearance' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Aparência
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-baby-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                        {darkMode ? (
                          <Moon className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                        ) : (
                          <Sun className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Modo Escuro
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Alterne entre tema claro e escuro
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={() => setDarkMode(!darkMode)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-500"></div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notificações */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Notificações
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-baby-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Notificações Push
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receba notificações de contas próximas do vencimento
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationsEnabled}
                        onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-500"></div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Backup */}
            {activeTab === 'backup' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Backup e Restauração
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-baby-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Backup Automático
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Faça backup automático dos seus dados
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoBackup}
                        onChange={() => setAutoBackup(!autoBackup)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-500"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.button
                      onClick={exportData}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download className="w-4 h-4" />
                      Exportar Dados
                    </motion.button>

                    <label className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Importar Dados
                      <input
                        type="file"
                        accept=".json"
                        onChange={importData}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="border-t border-baby-200 dark:border-gray-700 pt-4">
                    <motion.button
                      onClick={clearAllData}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors w-full"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Limpar Todos os Dados
                    </motion.button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                      Esta ação não pode ser desfeita
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Outras abas... */}
            {activeTab === 'account' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Configurações da Conta
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Gerencie suas informações de conta e preferências.
                </p>
              </motion.div>
            )}

            {activeTab === 'privacy' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Privacidade e Segurança
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Configure suas preferências de privacidade.
                </p>
              </motion.div>
            )}

            {activeTab === 'help' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Ajuda e Suporte
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Encontre ajuda e suporte para usar o FinanceFlow.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}