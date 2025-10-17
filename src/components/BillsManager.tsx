import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Calendar, DollarSign, Trash2, CheckCircle, Clock, FileText } from 'lucide-react';

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  category: string;
}

interface BillsManagerProps {
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
  darkMode: boolean;
  addNotification: (notification: { title: string; message: string; date: string; type: 'bill' | 'reminder' | 'system' }) => void;
}

interface BillItemProps {
  bill: Bill;
  index: number;
  onTogglePaid: (id: string) => void;
  onDelete: (id: string) => void;
}

interface AddBillFormProps {
  newBill: Omit<Bill, 'id'>;
  setNewBill: React.Dispatch<React.SetStateAction<Omit<Bill, 'id'>>>;
  onAdd: () => void;
  onClose: () => void;
  categories: { value: string; label: string }[];
}

function BillItem({ bill, index, onTogglePaid, onDelete }: BillItemProps) {
  return (
    <motion.div
      className={`card-modern border-l-4 ${
        bill.paid 
          ? 'border-l-green-500 bg-green-50 dark:bg-green-900/10' 
          : 'border-l-orange-500'
      }`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, x: -100 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${
              bill.paid 
                ? 'bg-green-100 dark:bg-green-900/20' 
                : 'bg-orange-100 dark:bg-orange-900/20'
            }`}>
              {bill.paid ? (
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              )}
            </div>
            <div>
              <h3 className={`font-semibold ${
                bill.paid 
                  ? 'text-green-700 dark:text-green-400 line-through' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {bill.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {bill.category}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <span className="flex items-center gap-1 font-semibold text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4" />
              R$ {bill.amount.toFixed(2)}
            </span>
            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              {new Date(bill.dueDate).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => onTogglePaid(bill.id)}
            className={`p-2 rounded-lg transition-colors ${
              bill.paid 
                ? 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/40' 
                : 'bg-orange-100 text-orange-600 hover:bg-orange-200 dark:bg-orange-900/20 dark:hover:bg-orange-900/40'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {bill.paid ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          </motion.button>
          
          <motion.button
            onClick={() => onDelete(bill.id)}
            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors dark:bg-red-900/20 dark:hover:bg-red-900/40"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function AddBillForm({ newBill, setNewBill, onAdd, onClose, categories }: AddBillFormProps) {
  const isFormValid = newBill.name && newBill.amount > 0 && newBill.dueDate;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="card-modern w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Adicionar Nova Conta
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span className="text-2xl text-gray-500 dark:text-gray-400">×</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome da Conta
            </label>
            <input
              type="text"
              placeholder="Ex: Aluguel, Luz, Internet..."
              value={newBill.name}
              onChange={(e) => setNewBill({...newBill, name: e.target.value})}
              className="input-modern"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria
            </label>
            <select
              value={newBill.category}
              onChange={(e) => setNewBill({...newBill, category: e.target.value})}
              className="input-modern"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Valor (R$)
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={newBill.amount || ''}
              onChange={(e) => setNewBill({...newBill, amount: parseFloat(e.target.value) || 0})}
              className="input-modern"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data de Vencimento
            </label>
            <input
              type="date"
              value={newBill.dueDate}
              onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})}
              className="input-modern"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancelar
            </button>
            <button
              onClick={onAdd}
              disabled={!isFormValid}
              className={`flex-1 btn-primary ${
                !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Adicionar
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function BillsManager({ bills, setBills, addNotification }: BillsManagerProps) {
  const [newBill, setNewBill] = useState<Omit<Bill, 'id'>>({
    name: '',
    amount: 0,
    dueDate: '',
    paid: false,
    category: 'outros'
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const addBill = () => {
    if (newBill.name && newBill.amount > 0 && newBill.dueDate) {
      const bill: Bill = {
        ...newBill,
        id: Date.now().toString(),
      };
      setBills([...bills, bill]);
      
      // Adicionar notificação
      addNotification({
        title: 'Nova Conta Adicionada',
        message: `Conta "${newBill.name}" de R$ ${newBill.amount.toFixed(2)} foi adicionada.`,
        date: new Date().toISOString(),
        type: 'bill'
      });
      
      setNewBill({
        name: '',
        amount: 0,
        dueDate: '',
        paid: false,
        category: 'outros'
      });
      setShowAddForm(false);
    }
  };

  const togglePaid = (id: string) => {
    const bill = bills.find(b => b.id === id);
    setBills(bills.map(bill => 
      bill.id === id ? { ...bill, paid: !bill.paid } : bill
    ));

    // Adicionar notificação quando marcar como paga
    if (bill && !bill.paid) {
      addNotification({
        title: 'Conta Marcada como Paga',
        message: `Conta "${bill.name}" foi marcada como paga.`,
        date: new Date().toISOString(),
        type: 'bill'
      });
    }
  };

  const deleteBill = (id: string) => {
    const bill = bills.find(b => b.id === id);
    setBills(bills.filter(bill => bill.id !== id));

    // Adicionar notificação ao deletar
    if (bill) {
      addNotification({
        title: 'Conta Removida',
        message: `Conta "${bill.name}" foi removida.`,
        date: new Date().toISOString(),
        type: 'bill'
      });
    }
  };

  const filteredBills = bills.filter(bill =>
    bill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [
    { value: 'casa', label: 'Casa' },
    { value: 'transporte', label: 'Transporte' },
    { value: 'alimentacao', label: 'Alimentação' },
    { value: 'saude', label: 'Saúde' },
    { value: 'educacao', label: 'Educação' },
    { value: 'lazer', label: 'Lazer' },
    { value: 'outros', label: 'Outros' },
  ];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gerenciar Contas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Adicione e gerencie suas contas e despesas
          </p>
        </div>

        <motion.button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          Nova Conta
        </motion.button>
      </div>

      {/* Barra de pesquisa e filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar contas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-modern pl-10 w-full"
          />
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </button>
      </div>

      {/* Lista de contas */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredBills.map((bill, index) => (
            <BillItem
              key={bill.id}
              bill={bill}
              index={index}
              onTogglePaid={togglePaid}
              onDelete={deleteBill}
            />
          ))}
        </AnimatePresence>

        {filteredBills.length === 0 && (
          <motion.div
            className="card-modern text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhuma conta encontrada
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Tente ajustar sua pesquisa' : 'Adicione sua primeira conta para começar'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Modal de adicionar conta */}
      <AnimatePresence>
        {showAddForm && (
          <AddBillForm
            newBill={newBill}
            setNewBill={setNewBill}
            onAdd={addBill}
            onClose={() => setShowAddForm(false)}
            categories={categories}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}