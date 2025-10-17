
export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full transform translate-y-[85%] hover:translate-y-0 transition-transform duration-500 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-40"> 
      {/* Direitos autorais */}
      <div className="text-center text-pink-500 text-xs bg-gradient-to-t from-pink-300 to-pink-200 dark:from-violet-600/10 dark:to-violet-700/10 py-2 px-4">
        © {new Date().getFullYear()} FinanceFlow. Todos os direitos reservados. 
      </div>
    </footer>
  );
}