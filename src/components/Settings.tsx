import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Download, Upload, Trash2, User, Shield, Database, Wallet } from 'lucide-react';
import { isSupabaseEnabled } from '../lib/supabase';
import type { User as UserType } from '../types';

interface SettingsProps {
  user: UserType;
  onLogout: () => void;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange}
      className={`relative w-10 h-5.5 rounded-full transition-colors ${checked ? 'bg-brand' : 'bg-surface-200'}`}
      style={{ height: 22, width: 40 }}>
      <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-[18px]' : ''}`}
        style={{ width: 18, height: 18, transitionProperty: 'transform' }} />
    </button>
  );
}

export default function Settings({ user, onLogout }: SettingsProps) {
  const [notifications, setNotifications] = useState(true);

  const exportData = () => {
    const keys = ['bills', 'incomes', 'goals', 'reminders', 'futureTransactions', 'availableMoney'];
    const data: Record<string, unknown> = { exportDate: new Date().toISOString() };
    keys.forEach(k => {
      const v = localStorage.getItem(k);
      if (v) data[k] = JSON.parse(v);
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `financeflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        const keys = ['bills', 'incomes', 'goals', 'reminders', 'futureTransactions', 'availableMoney'];
        keys.forEach(k => { if (data[k] !== undefined) localStorage.setItem(k, JSON.stringify(data[k])); });
        window.location.reload();
      } catch {
        alert('Arquivo inválido. Verifique se é um backup do FinanceFlow.');
      }
    };
    reader.readAsText(file);
  };

  const clearAll = () => {
    if (confirm('Tem certeza? Esta ação remove TODOS os seus dados e não pode ser desfeita.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <motion.div className="space-y-5 max-w-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div>
        <h2 className="section-title">Configurações</h2>
        <p className="section-subtitle">Preferências e dados do app</p>
      </div>

      {/* Account */}
      <div className="card-p space-y-4">
        <h3 className="font-semibold text-ink flex items-center gap-2 text-sm">
          <User size={15} className="text-ink-muted" /> Conta
        </h3>
        <div className="flex items-center gap-4 p-3 bg-surface-50 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-brand-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {user.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold text-ink">{user.nome}</p>
            <p className="text-sm text-ink-muted">{user.email}</p>
            {user.celular && <p className="text-xs text-ink-faint">{user.celular}</p>}
          </div>
        </div>
        <button onClick={onLogout} className="btn-danger text-xs py-2">Sair da conta</button>
      </div>

      {/* Notifications */}
      <div className="card-p space-y-4">
        <h3 className="font-semibold text-ink flex items-center gap-2 text-sm">
          <Bell size={15} className="text-ink-muted" /> Notificações
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink">Alertas de vencimento</p>
            <p className="text-xs text-ink-muted">Notificações para contas próximas do vencimento</p>
          </div>
          <Toggle checked={notifications} onChange={() => setNotifications(v => !v)} />
        </div>
      </div>

      {/* Database */}
      <div className="card-p space-y-4">
        <h3 className="font-semibold text-ink flex items-center gap-2 text-sm">
          <Database size={15} className="text-ink-muted" /> Banco de Dados
        </h3>
        <div className={`flex items-center gap-3 p-3 rounded-xl border ${
          isSupabaseEnabled ? 'bg-brand-50 border-brand-200' : 'bg-surface-50 border-surface-200'
        }`}>
          <div className={`w-3 h-3 rounded-full ${isSupabaseEnabled ? 'bg-brand' : 'bg-warning'}`} />
          <div>
            <p className="text-sm font-medium text-ink">
              {isSupabaseEnabled ? 'Supabase conectado' : 'Modo local (localStorage)'}
            </p>
            <p className="text-xs text-ink-muted">
              {isSupabaseEnabled
                ? 'Dados sincronizados na nuvem'
                : 'Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env.local para sincronizar'}
            </p>
          </div>
        </div>
      </div>

      {/* Backup */}
      <div className="card-p space-y-4">
        <h3 className="font-semibold text-ink flex items-center gap-2 text-sm">
          <Shield size={15} className="text-ink-muted" /> Backup e Dados
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={exportData} className="btn-secondary text-xs py-2.5">
            <Download size={14} /> Exportar backup
          </button>
          <label className="btn-secondary text-xs py-2.5 cursor-pointer flex items-center justify-center gap-2">
            <Upload size={14} /> Importar backup
            <input type="file" accept=".json" onChange={importData} className="hidden" />
          </label>
        </div>
        <div className="divider" />
        <button onClick={clearAll} className="btn-danger text-xs py-2.5 w-full">
          <Trash2 size={14} /> Limpar todos os dados (irreversível)
        </button>
      </div>

      {/* About */}
      <div className="card-p space-y-2">
        <h3 className="font-semibold text-ink flex items-center gap-2 text-sm">
          <Wallet size={15} className="text-ink-muted" /> Sobre
        </h3>
        <p className="text-xs text-ink-muted">FinanceFlow Pro · v2.0.0</p>
        <p className="text-xs text-ink-faint">Seus dados ficam no seu dispositivo. Nenhuma informação financeira é enviada a servidores externos.</p>
      </div>
    </motion.div>
  );
}
