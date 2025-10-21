// formatters.ts
// Formata números no padrão brasileiro: 1.269,60
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Formata números sem o símbolo R$: 1.269,60
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Converte string formatada para número: "1.269,60" → 1269.60
export const parseFormattedNumber = (formattedValue: string): number => {
  if (!formattedValue || formattedValue === '') return 0;
  
  // Remove todos os pontos e substitui vírgula por ponto
  const cleanValue = formattedValue
    .replace(/\./g, '')
    .replace(',', '.');
  
  const numberValue = parseFloat(cleanValue);
  return isNaN(numberValue) ? 0 : numberValue;
};

// CORREÇÃO: Formatação para input 
export const formatInputCurrency = (value: string): string => {
  if (!value) return '';
  
  // Remove tudo que não é número, exceto vírgula
  const cleanValue = value.replace(/[^\d,]/g, '');
  
  // Se não há nada, retorna vazio
  if (cleanValue === '') return '';
  
  // Se começa com vírgula, adiciona 0 antes
  if (cleanValue.startsWith(',')) {
    const decimalPart = cleanValue.slice(1).replace(/\D/g, '').slice(0, 2);
    return `0,${decimalPart}`;
  }
  
  // Separa parte inteira e decimal
  const parts = cleanValue.split(',');
  let integerPart = parts[0].replace(/\D/g, '');
  let decimalPart = parts[1] ? parts[1].replace(/\D/g, '').slice(0, 2) : '';
  
  // Se integerPart está vazio após limpeza, retorna 0,
  if (integerPart === '') {
    return `0,${decimalPart.padEnd(2, '0')}`;
  }
  
  // Remove zeros à esquerda, exceto se for o único dígito
  integerPart = integerPart.replace(/^0+/, '') || '0';
  
  // Formata a parte inteira com separadores de milhar
  const formattedInteger = parseInt(integerPart).toLocaleString('pt-BR');
  
  // Retorna formatado com a parte decimal
  return decimalPart ? `${formattedInteger},${decimalPart}` : formattedInteger;
};

// CORREÇÃO: Função para input numérico na calculadora
export const handleCalculatorInput = (currentValue: string, newDigit: string): string => {
  // Se está em estado de waitingForNewValue, inicia novo número
  if (currentValue === '0,00' || currentValue === '0') {
    return newDigit === '0' ? '0,00' : `${newDigit},00`;
  }
  
  const hasComma = currentValue.includes(',');
  
  if (!hasComma) {
    // Se não tem vírgula ainda, adiciona o dígito à parte inteira
    const newInteger = currentValue.replace(/\./g, '') + newDigit;
    const numericValue = parseInt(newInteger, 10);
    return formatNumber(numericValue);
  }
  
  // Se já tem vírgula, processa parte decimal
  const [integerPart, decimalPart] = currentValue.split(',');
  const cleanInteger = integerPart.replace(/\./g, '');
  
  if (decimalPart === '00' || decimalPart === '0') {
    // Substitui os zeros decimais
    return `${cleanInteger},${newDigit}0`;
  } else if (decimalPart.length < 2) {
    // Adiciona ao decimal existente
    const newDecimal = decimalPart + newDigit;
    return `${cleanInteger},${newDecimal.padEnd(2, '0')}`;
  } else {
    // Já tem 2 decimais, não adiciona mais
    return currentValue;
  }
};