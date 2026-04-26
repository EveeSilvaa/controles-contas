/**
 * Database abstraction layer.
 * Uses Supabase when env vars are configured, otherwise falls back to localStorage.
 */
import { supabase, isSupabaseEnabled } from './supabase';
import type { Bill, Income, Goal, Reminder, Notification, FutureTransaction, User } from '../types';

// ── Local Storage helpers ──────────────────────────────────────────────────

function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function lsSet(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* quota exceeded */ }
}

// ── Bills ──────────────────────────────────────────────────────────────────

export async function getBills(userId: string): Promise<Bill[]> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: true });
    if (!error && data) return data as Bill[];
  }
  return lsGet<Bill[]>('bills', []);
}

export async function saveBills(bills: Bill[], userId?: string): Promise<void> {
  lsSet('bills', bills);
  if (isSupabaseEnabled && supabase && userId) {
    // Upsert all bills for this user
    await supabase.from('bills').upsert(
      bills.map(b => ({ ...b, user_id: userId }))
    );
  }
}

// ── Incomes ────────────────────────────────────────────────────────────────

export async function getIncomes(userId: string): Promise<Income[]> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from('incomes')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    if (!error && data) return data as Income[];
  }
  return lsGet<Income[]>('incomes', []);
}

export async function saveIncomes(incomes: Income[], userId?: string): Promise<void> {
  lsSet('incomes', incomes);
  if (isSupabaseEnabled && supabase && userId) {
    await supabase.from('incomes').upsert(
      incomes.map(i => ({ ...i, user_id: userId }))
    );
  }
}

// ── Goals ──────────────────────────────────────────────────────────────────

export async function getGoals(userId: string): Promise<Goal[]> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId);
    if (!error && data) return data as Goal[];
  }
  return lsGet<Goal[]>('goals', []);
}

export async function saveGoals(goals: Goal[], userId?: string): Promise<void> {
  lsSet('goals', goals);
  if (isSupabaseEnabled && supabase && userId) {
    await supabase.from('goals').upsert(
      goals.map(g => ({ ...g, user_id: userId }))
    );
  }
}

// ── Reminders ─────────────────────────────────────────────────────────────

export async function getReminders(userId: string): Promise<Reminder[]> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });
    if (!error && data) return data as Reminder[];
  }
  return lsGet<Reminder[]>('reminders', []);
}

export async function saveReminders(reminders: Reminder[], userId?: string): Promise<void> {
  lsSet('reminders', reminders);
  if (isSupabaseEnabled && supabase && userId) {
    await supabase.from('reminders').upsert(
      reminders.map(r => ({ ...r, user_id: userId }))
    );
  }
}

// ── User preferences ──────────────────────────────────────────────────────

export function getUserPrefs(): { availableMoney: number; darkMode: boolean } {
  return {
    availableMoney: parseFloat(localStorage.getItem('availableMoney') ?? '0') || 0,
    darkMode: JSON.parse(localStorage.getItem('darkMode') ?? 'false'),
  };
}

export function saveUserPrefs(prefs: { availableMoney?: number; darkMode?: boolean }) {
  if (prefs.availableMoney !== undefined)
    localStorage.setItem('availableMoney', prefs.availableMoney.toString());
  if (prefs.darkMode !== undefined)
    localStorage.setItem('darkMode', JSON.stringify(prefs.darkMode));
}

// Re-export simple localStorage wrappers for notifications & future transactions
export function getNotifications(): Notification[] {
  return lsGet<Notification[]>('notifications', []);
}
export function saveNotifications(n: Notification[]) { lsSet('notifications', n); }

export function getFutureTransactions(): FutureTransaction[] {
  return lsGet<FutureTransaction[]>('futureTransactions', []);
}
export function saveFutureTransactions(t: FutureTransaction[]) {
  lsSet('futureTransactions', t);
}

export function getSavedUser(): User | null {
  return lsGet<User | null>('financeFlowUser', null);
}
export function saveUser(u: User) { lsSet('financeFlowUser', u); }
export function clearUser() {
  localStorage.removeItem('financeFlowUser');
  localStorage.removeItem('userLoggedIn');
}
