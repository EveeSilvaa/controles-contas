import { motion } from 'framer-motion';
import { useState } from 'react';
import { Bell, Check, Trash2, AlertCircle, Info, Calendar } from 'lucide-react';
import type { Notification } from '../App';

export interface NotificationsProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  darkMode: boolean;
  addNotification?: (notification: Omit<Notification, 'id' | 'read'>) => void;
}


export default function Notifications({ notifications, setNotifications, darkMode }: NotificationsProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(notification =>
    filter === 'all' ? true : !notification.read
  );

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'bill':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'reminder':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'bill':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      case 'reminder':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
      default:
        return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800';
    }
  };

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
            Notificações
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie suas notificações e alertas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'unread')}
            className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-baby-300 text-gray-900'
            }`}
          >
            <option value="all">Todas</option>
            <option value="unread">Não lidas</option>
          </select>

          {notifications.some(n => !n.read) && (
            <motion.button
              onClick={markAllAsRead}
              className="btn-secondary flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Check className="w-4 h-4" />
              Marcar todas como lida
            </motion.button>
          )}

          {notifications.length > 0 && (
            <motion.button
              onClick={clearAll}
              className="btn-danger flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="w-4 h-4" />
              Limpar todas
            </motion.button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-modern text-center">
          <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6 text-pink-600 dark:text-pink-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {notifications.length}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Total</p>
        </div>

        <div className="card-modern text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {notifications.filter(n => !n.read).length}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Não lidas</p>
        </div>

        <div className="card-modern text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {notifications.filter(n => n.read).length}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Lidas</p>
        </div>
      </div>

      {/* Lista de Notificações */}
      <div className="card-modern">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notificações ({filteredNotifications.length})
          </h3>
        </div>

        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  getNotificationColor(notification.type)
                } ${!notification.read ? 'ring-2 ring-pink-200 dark:ring-pink-800' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`font-semibold ${
                        notification.read 
                          ? 'text-gray-700 dark:text-gray-300' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                        {new Date(notification.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-3">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs px-3 py-1 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                        >
                          Marcar como lida
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-xs px-3 py-1 text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
                Nenhuma notificação
              </h3>
              <p className="text-gray-400 dark:text-gray-500">
                {filter === 'unread' 
                  ? 'Você não tem notificações não lidas.' 
                  : 'Você não tem notificações no momento.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}