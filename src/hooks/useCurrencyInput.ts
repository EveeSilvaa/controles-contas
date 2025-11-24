import { useState, useEffect } from 'react';
import { formatInputCurrency, parseFormattedNumber } from '../utils/formatters';

export const useCurrencyInput = (initialValue: number = 0) => {
  const [isClient, setIsClient] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const [numericValue, setNumericValue] = useState(initialValue);

  useEffect(() => {
    setIsClient(true);
    setDisplayValue(formatInputCurrency(initialValue.toString()));
  }, [initialValue]);

  const handleChange = (value: string) => {
    if (!isClient) return;
    
    try {
      const formatted = formatInputCurrency(value);
      setDisplayValue(formatted);
      
      const numeric = parseFormattedNumber(formatted);
      setNumericValue(numeric);
    } catch (error) {
      console.error('Erro ao processar valor:', error);
    }
  };

  const setValue = (value: number) => {
    if (!isClient) return;
    
    try {
      setDisplayValue(formatInputCurrency(value.toString()));
      setNumericValue(value);
    } catch (error) {
      console.error('Erro ao definir valor:', error);
    }
  };

  return {
    displayValue: isClient ? displayValue : '0',
    numericValue,
    handleChange,
    setValue
  };
};