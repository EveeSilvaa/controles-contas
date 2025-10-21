// src/components/Calculator.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';
import { formatNumber, parseFormattedNumber } from '../utils/formatters';

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

function handleCalculatorInput(display: string, num: string): string {
  // Remove formatação para trabalhar com o número
  const cleanDisplay = display.replace(/\./g, '');
  
  // Se o display é "0,00", substitui pelo novo número
  if (cleanDisplay === '0,00') {
    return num + ',00';
  }
  
  // Separa parte inteira e decimal
  const [integerPart, decimalPart = ''] = cleanDisplay.split(',');
  
  // Se já tem 2 casas decimais, não adiciona mais
  if (decimalPart.length >= 2) {
    return display;
  }
  
  // Se não tem parte decimal, adiciona o número à parte inteira
  if (!cleanDisplay.includes(',')) {
    const newInteger = integerPart + num;
    return formatNumber(parseFloat(newInteger));
  }
  
  // Se tem vírgula mas menos de 2 decimais, adiciona à parte decimal
  const newDecimal = (decimalPart + num).slice(0, 2);
  const newValue = parseFloat(integerPart + '.' + newDecimal.padEnd(2, '0'));
  return formatNumber(newValue);
}

export default function Calculator({ isOpen, onClose, darkMode }: CalculatorProps) {
  const [display, setDisplay] = useState('0,00');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputNumber = (num: string) => {
  if (waitingForNewValue) {
    setDisplay(num === '0' ? '0,00' : num + ',00');
    setWaitingForNewValue(false);
  } else {
    // Usa a nova função de formatação
    const newValue = handleCalculatorInput(display, num);
    setDisplay(newValue);
  }
};

  const inputDecimal = () => {
  if (waitingForNewValue) {
    setDisplay('0,00');
    setWaitingForNewValue(false);
  } else if (!display.includes(',')) {
    // Se não tem vírgula, adiciona mantendo os zeros decimais
    const integerPart = display.replace(/\./g, '');
    setDisplay(integerPart + ',00');
  }
};
  const clear = () => {
    setDisplay('0,00');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFormattedNumber(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let newValue: number;

      switch (operation) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '×':
          newValue = currentValue * inputValue;
          break;
        case '÷':
          newValue = currentValue / inputValue;
          break;
        default:
          newValue = inputValue;
      }

      setDisplay(formatNumber(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    const inputValue = parseFormattedNumber(display);

    if (previousValue !== null && operation) {
      let newValue: number;

      switch (operation) {
        case '+':
          newValue = previousValue + inputValue;
          break;
        case '-':
          newValue = previousValue - inputValue;
          break;
        case '×':
          newValue = previousValue * inputValue;
          break;
        case '÷':
          newValue = previousValue / inputValue;
          break;
        default:
          newValue = inputValue;
      }

      setDisplay(formatNumber(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const buttons = [
    { label: 'C', action: clear, className: 'bg-red-400 hover:bg-red-500 text-white' },
    {
      label: '±', action: () => {
        const currentValue = parseFormattedNumber(display);
        setDisplay(formatNumber(-currentValue));
      }, className: 'bg-gray-400 hover:bg-gray-500 text-white'
    },
    {
      label: '%', action: () => {
        const currentValue = parseFormattedNumber(display);
        setDisplay(formatNumber(currentValue / 100));
      }, className: 'bg-gray-400 hover:bg-gray-500 text-white'
    },
    { label: '÷', action: () => performOperation('÷'), className: 'bg-pink-500 hover:bg-pink-600 text-white' },

    { label: '7', action: () => inputNumber('7'), className: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500' },
    { label: '8', action: () => inputNumber('8'), className: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500' },
    { label: '9', action: () => inputNumber('9'), className: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500' },
    { label: '×', action: () => performOperation('×'), className: 'bg-pink-500 hover:bg-pink-600 text-white' },

    { label: '4', action: () => inputNumber('4'), className: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500' },
    { label: '5', action: () => inputNumber('5'), className: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500' },
    { label: '6', action: () => inputNumber('6'), className: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500' },
    { label: '-', action: () => performOperation('-'), className: 'bg-pink-500 hover:bg-pink-600 text-white' },

    { label: '1', action: () => inputNumber('1'), className: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500' },
    { label: '2', action: () => inputNumber('2'), className: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500' },
    { label: '3', action: () => inputNumber('3'), className: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500' },
    { label: '+', action: () => performOperation('+'), className: 'bg-pink-500 hover:bg-pink-600 text-white' },

    { label: '0', action: () => inputNumber('0'), className: 'col-span-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500' },
    { label: ',', action: inputDecimal, className: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500' },
    { label: '=', action: calculate, className: 'bg-pink-500 hover:bg-pink-600 text-white' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Calculadora */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed bottom-4 right-4 w-80 z-50 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-baby-200'
              }`}>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Calculadora
              </h3>
              <button
                onClick={onClose}
                className={`p-1 rounded-lg ${darkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-baby-100 text-gray-600'
                  }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Display */}
            <div className={`p-4 text-right ${darkMode ? 'bg-gray-900' : 'bg-baby-50'
              }`}>
              <div className={`text-3xl font-mono font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                {display}
              </div>
              {previousValue !== null && operation && (
                <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                  {formatNumber(previousValue)} {operation}
                </div>
              )}
            </div>

            {/* Teclado */}
            <div className="p-4">
              <div className="grid grid-cols-4 gap-3">
                {buttons.map((button) => (
                  <button
                    key={button.label}
                    onClick={button.action}
                    className={`h-14 rounded-xl font-semibold text-lg transition-all duration-200 active:scale-95 ${button.className} ${darkMode && !button.className.includes('bg-')
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : ''
                      }`}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
