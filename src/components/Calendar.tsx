// src/components/Calendar.tsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import type { Reminder, Bill } from '../App';

interface CalendarProps {
  reminders: Reminder[];
  setReminders: (reminders: Reminder[]) => void;
  bills: Bill[];
  darkMode: boolean;
  addNotification: (notification: { title: string; message: string; date: string; type: 'bill' | 'reminder' | 'system' }) => void;
}

export default function Calendar({ reminders, setReminders, bills, darkMode, addNotification }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00'
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    return {
      firstDay,
      lastDay,
      daysInMonth
    };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
  const startDay = firstDay.getDay();

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const getRemindersForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return reminders.filter(reminder => reminder.date === dateStr);
  };

  const getBillsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return bills.filter(bill => bill.dueDate === dateStr && !bill.paid);
  };

  const addReminder = () => {
    if (newReminder.title.trim()) {
      const reminder: Reminder = {
        id: Date.now().toString(),
        title: newReminder.title,
        description: newReminder.description,
        date: newReminder.date,
        time: newReminder.time,
        completed: false
      };
      
      setReminders([...reminders, reminder]);
      setNewReminder({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: '12:00'
      });
      setShowAddReminder(false);

      addNotification({
        title: 'Lembrete Adicionado',
        message: `Lembrete "${newReminder.title}" foi adicionado para ${new Date(newReminder.date).toLocaleDateString()}`,
        date: new Date().toISOString(),
        type: 'reminder'
      });
    }
  };

  const toggleReminderComplete = (id: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, completed: !reminder.completed }
        : reminder
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

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
            Calendário
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie seus lembretes e contas a pagar
          </p>
        </div>

        <motion.button
          onClick={() => setShowAddReminder(true)}
          className="btn-primary flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" />
          Novo Lembrete
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <div className="lg:col-span-2">
          <div className="card-modern">
            {/* Controles do Mês */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-baby-100 dark:hover:bg-pink-800 rounded-lg transition-colors"
              >
                ‹
              </button>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-baby-100 dark:hover:bg-pink-800 rounded-lg transition-colors"
              >
                ›
              </button>
            </div>

            {/* Dias da semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Dias do mês */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startDay }, (_, i) => (
                <div key={`empty-${i}`} className="h-24 border border-transparent" />
              ))}
              
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dayReminders = getRemindersForDay(day);
                const dayBills = getBillsForDay(day);
                const isToday = new Date().getDate() === day && 
                               new Date().getMonth() === currentDate.getMonth() && 
                               new Date().getFullYear() === currentDate.getFullYear();

                return (
                  <div
                    key={day}
                    className={`h-24 border rounded-lg p-2 overflow-y-auto ${
                      isToday
                        ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/30'
                        : 'border-gray-200 dark:border-gray-700'
                    } ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isToday 
                        ? 'text-pink-600 dark:text-pink-400' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {day}
                    </div>
                    
                    {/* Lembretes */}
                    {dayReminders.slice(0, 2).map(reminder => (
                      <div
                        key={reminder.id}
                        className={`text-xs p-1 mb-1 rounded ${
                          reminder.completed
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {reminder.completed ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Circle className="w-3 h-3" />
                          )}
                          {reminder.title}
                        </div>
                      </div>
                    ))}
                    
                    {/* Contas */}
                    {dayBills.slice(0, 2).map(bill => (
                      <div
                        key={bill.id}
                        className="text-xs p-1 mb-1 rounded bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                      >
                        <div className="flex items-center gap-1">
                          <span>💰</span>
                          R$ {bill.amount}
                        </div>
                      </div>
                    ))}
                    
                {(dayReminders.length > 2 || dayBills.length > 2) && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    +{dayReminders.length + dayBills.length - 2} mais
                  </div>
                )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lista de Lembretes */}
        <div className="space-y-4">
          <div className="card-modern">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Lembretes do Mês
            </h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {reminders
                .filter(reminder => {
                  const reminderDate = new Date(reminder.date);
                  return reminderDate.getMonth() === currentDate.getMonth() && 
                         reminderDate.getFullYear() === currentDate.getFullYear();
                })
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map(reminder => (
                  <div
                    key={reminder.id}
                    className={`p-3 rounded-lg border ${
                      reminder.completed
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-baby-50 dark:bg-pink-900/20 border-baby-200 dark:border-pink-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <button
                            onClick={() => toggleReminderComplete(reminder.id)}
                            className={`p-1 rounded ${
                              reminder.completed
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                            }`}
                          >
                            {reminder.completed ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>
                          <span className={`font-medium ${
                            reminder.completed
                              ? 'text-green-800 dark:text-green-300 line-through'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {reminder.title}
                          </span>
                        </div>
                        {reminder.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {reminder.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(reminder.date).toLocaleDateString()} às {reminder.time}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              
              {reminders.filter(r => {
                const date = new Date(r.date);
                return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
              }).length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  Nenhum lembrete este mês
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Adicionar Lembrete */}
      {showAddReminder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-md rounded-2xl p-6 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Novo Lembrete
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                  className="w-full px-3 py-2 border border-baby-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder="Digite o título do lembrete"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição (opcional)
                </label>
                <textarea
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-baby-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder="Digite uma descrição..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    value={newReminder.date}
                    onChange={(e) => setNewReminder({...newReminder, date: e.target.value})}
                    className="w-full px-3 py-2 border border-baby-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                    className="w-full px-3 py-2 border border-baby-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddReminder(false)}
                className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={addReminder}
                className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Adicionar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}