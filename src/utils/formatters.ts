
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

// Formatação simples para input - permite digitação natural
export const formatInputCurrency = (value: string): string => {
  if (!value) return '';
  
  // Remove tudo que não é número
  const numbersOnly = value.replace(/\D/g, '');
  
  if (numbersOnly === '') return '';
  
  // Se for apenas zeros, retorna "0,"
  if (parseInt(numbersOnly) === 0) return '0,';
  
  // Adiciona zeros à esquerda para garantir 2 casas decimais
  const paddedValue = numbersOnly.padStart(3, '0');
  
  // Separa parte inteira e decimal
  const integerPart = paddedValue.slice(0, -2);
  const decimalPart = paddedValue.slice(-2);
  
  // Formata parte inteira com separadores de milhar
  const formattedInteger = parseInt(integerPart).toLocaleString('pt-BR');
  
  return `${formattedInteger},${decimalPart}`;
};

// FUNÇÃO ALTERNATIVA: Para inputs que precisam de mais controle
export const handleCurrencyInput = (value: string, previousValue: string): string => {
  // Se apagou tudo, retorna vazio
  if (value === '') return '';
  
  // Se está apagando, retorna o valor anterior formatado
  if (value.length < previousValue.length) {
    return formatInputCurrency(value);
  }
  
  // Se está adicionando números
  const numbersOnly = value.replace(/\D/g, '');
  
  // Remove zeros à esquerda desnecessários
  const cleanNumbers = numbersOnly.replace(/^0+/, '') || '0';
  
  // Garante que temos pelo menos 3 dígitos para centavos
  const paddedValue = cleanNumbers.padStart(3, '0');
  
  const integerPart = paddedValue.slice(0, -2);
  const decimalPart = paddedValue.slice(-2);
  
  const formattedInteger = integerPart === '' ? '0' : parseInt(integerPart).toLocaleString('pt-BR');
  
  return `${formattedInteger},${decimalPart}`;
};