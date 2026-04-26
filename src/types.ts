export interface User {
  id: string;
  nome: string;
  email: string;
  celular: string;
}

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
  recurring?: boolean;
}

export interface Income {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  received: boolean;
  recurring: boolean;
  recurringPeriod?: 'weekly' | 'monthly' | 'yearly';
}

export interface Goal {
  id: string;
  category: string;
  limitAmount: number;
  period: 'monthly' | 'yearly';
  color?: string;
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
  type: 'bill' | 'reminder' | 'system' | 'income';
}

export interface FutureTransaction {
  id: string;
  description: string;
  amount: number;
  expectedDate: string;
  received: boolean;
}

export const CATEGORIES = [
  { value: 'moradia', label: 'Moradia', color: '#4F8EF7', emoji: '🏠' },
  { value: 'alimentacao', label: 'Alimentação', color: '#8B5CF6', emoji: '🍔' },
  { value: 'transporte', label: 'Transporte', color: '#06B6D4', emoji: '🚗' },
  { value: 'saude', label: 'Saúde', color: '#22D68A', emoji: '💊' },
  { value: 'educacao', label: 'Educação', color: '#F59E0B', emoji: '📚' },
  { value: 'lazer', label: 'Lazer', color: '#F06292', emoji: '🎮' },
  { value: 'assinaturas', label: 'Assinaturas', color: '#EC4899', emoji: '📱' },
  { value: 'investimentos', label: 'Investimentos', color: '#10B981', emoji: '📈' },
  { value: 'outros', label: 'Outros', color: '#9CA3AF', emoji: '📦' },
] as const;

export const INCOME_CATEGORIES = [
  { value: 'salario', label: 'Salário', color: '#22D68A', emoji: '💼' },
  { value: 'freelance', label: 'Freelance', color: '#4F8EF7', emoji: '💻' },
  { value: 'investimento', label: 'Investimento', color: '#8B5CF6', emoji: '📈' },
  { value: 'aluguel', label: 'Aluguel', color: '#F59E0B', emoji: '🏘️' },
  { value: 'bonus', label: 'Bônus', color: '#F06292', emoji: '🎁' },
  { value: 'outros', label: 'Outros', color: '#9CA3AF', emoji: '💰' },
] as const;

export type CategoryValue = typeof CATEGORIES[number]['value'];

export function getCategoryInfo(value: string) {
  return CATEGORIES.find(c => c.value === value) ?? CATEGORIES[CATEGORIES.length - 1];
}

export function getIncomeCategoryInfo(value: string) {
  return INCOME_CATEGORIES.find(c => c.value === value) ?? INCOME_CATEGORIES[INCOME_CATEGORIES.length - 1];
}
