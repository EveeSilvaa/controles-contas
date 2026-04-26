-- FinanceFlow Pro - Schema Supabase
-- Execute este SQL no SQL Editor do seu projeto Supabase

-- Tabela de Contas
CREATE TABLE IF NOT EXISTS bills (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  due_date DATE NOT NULL,
  paid BOOLEAN DEFAULT false,
  category TEXT NOT NULL DEFAULT 'outros',
  description TEXT,
  installments INT,
  current_installment INT,
  recurring BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Receitas
CREATE TABLE IF NOT EXISTS incomes (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  date DATE NOT NULL,
  category TEXT NOT NULL DEFAULT 'outros',
  received BOOLEAN DEFAULT false,
  recurring BOOLEAN DEFAULT false,
  recurring_period TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Metas
CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  category TEXT NOT NULL,
  limit_amount DECIMAL(12,2) NOT NULL,
  period TEXT NOT NULL DEFAULT 'monthly',
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Lembretes
CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TEXT,
  completed BOOLEAN DEFAULT false,
  bill_id TEXT REFERENCES bills(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Políticas: usuário só acessa seus próprios dados
CREATE POLICY "bills_own" ON bills FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "incomes_own" ON incomes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "goals_own" ON goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "reminders_own" ON reminders FOR ALL USING (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_bills_user ON bills(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_due_date ON bills(due_date);
CREATE INDEX IF NOT EXISTS idx_incomes_user ON incomes(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user ON reminders(user_id);
