
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
  
  const cleanValue = formattedValue
    .replace(/\./g, '')
    .replace(',', '.');
  
  const numberValue = parseFloat(cleanValue);
  return isNaN(numberValue) ? 0 : numberValue;
};

// Formatação para input de valores monetários
export const formatInputCurrency = (value: string): string => {
  if (!value) return '';
  
  // Remove caracteres não numéricos exceto vírgula
  const cleanValue = value.replace(/[^\d,]/g, '');
  
  if (cleanValue === '') return '';
  
  // Se começa com vírgula
  if (cleanValue.startsWith(',')) {
    const decimalPart = cleanValue.slice(1).replace(/\D/g, '').slice(0, 2);
    return `0,${decimalPart.padEnd(2, '0')}`;
  }
  
  const parts = cleanValue.split(',');
  let integerPart = parts[0].replace(/\D/g, '');
  const decimalPart = parts[1] ? parts[1].replace(/\D/g, '').slice(0, 2) : '';
  
  // Remove zeros à esquerda
  integerPart = integerPart.replace(/^0+/, '') || '0';
  
  // Formata parte inteira
  const formattedInteger = parseInt(integerPart).toLocaleString('pt-BR');
  
  return decimalPart ? `${formattedInteger},${decimalPart}` : formattedInteger;
};