import { useState } from 'react';
import { formatInputCurrency, parseFormattedNumber } from '../utils/formatters';

export const useCurrencyInput = (initialValue: number = 0) => {
  const [displayValue, setDisplayValue] = useState(formatInputCurrency(initialValue.toString()));
  const [numericValue, setNumericValue] = useState(initialValue);

  const handleChange = (value: string) => {
    const formatted = formatInputCurrency(value);
    setDisplayValue(formatted);
    
    const numeric = parseFormattedNumber(formatted);
    setNumericValue(numeric);
  };

  const setValue = (value: number) => {
    setDisplayValue(formatInputCurrency(value.toString()));
    setNumericValue(value);
  };

  return {
    displayValue,
    numericValue,
    handleChange,
    setValue
  };
};