import { motion } from 'framer-motion';
import { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Heart, Sparkles } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
  darkMode: boolean;
}

interface User {
  id: string;
  nome: string;
  email: string;
  celular: string;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    celular: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulação de processo de autenticação
    setTimeout(() => {
      const user: User = {
        id: Date.now().toString(),
        nome: formData.nome || 'Usuário Financeiro',
        email: formData.email,
        celular: formData.celular || '(11) 99999-9999'
      };

      // Salva no localStorage (em uma aplicação real, isso seria no backend)
      localStorage.setItem('financeFlowUser', JSON.stringify(user));
      localStorage.setItem('userLoggedIn', 'true');

      setLoading(false);
      onLogin(user);
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Header Fofo */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -5, 5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            className="w-20 h-20 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
          >
            <Heart className="w-10 h-10 text-pink-500" fill="currentColor" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">
            FinanceFlow
          </h1>
          <p className="text-pink-100 text-lg">
            {isLogin ? 'Bem-vindo de volta! 💖' : 'Junte-se a nós! ✨'}
          </p>
        </motion.div>

        {/* Card do Formulário */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8"
        >
          {/* Abas Login/Cadastro */}
          <div className="flex mb-8 bg-gray-100 rounded-2xl p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 ${
                isLogin 
                  ? 'bg-pink-500 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 ${
                !isLogin 
                  ? 'bg-pink-500 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome (apenas no cadastro) */}
            {!isLogin && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  Seu nome
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                  placeholder="Como quer ser chamado?"
                  required={!isLogin}
                />
              </motion.div>
            )}

            {/* Email */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4" />
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                placeholder="seu@email.com"
                required
              />
            </motion.div>

            {/* Celular (apenas no cadastro) */}
            {!isLogin && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Sparkles className="w-4 h-4" />
                  Celular (opcional)
                </label>
                <input
                  type="tel"
                  name="celular"
                  value={formData.celular}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                  placeholder="(11) 99999-9999"
                />
              </motion.div>
            )}

            {/* Senha */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4" />
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all pr-12"
                  placeholder="Sua senha secreta"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            {/* Confirmar Senha (apenas no cadastro) */}
            {!isLogin && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4" />
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                  placeholder="Digite novamente"
                  required={!isLogin}
                />
              </motion.div>
            )}

            {/* Botão de Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  {isLogin ? 'Entrando...' : 'Cadastrando...'}
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  {isLogin ? 'Entrar na Conta' : 'Criar Minha Conta'}
                </span>
              )}
            </motion.button>
          </form>

          {/* Link para alternar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-6"
          >
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-pink-500 hover:text-pink-600 font-medium"
            >
              {isLogin 
                ? '📝 Não tem conta? Cadastre-se aqui!' 
                : '🔐 Já tem conta? Faça login aqui!'}
            </button>
          </motion.div>
        </motion.div>

        {/* Footer Fofo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <p className="text-pink-100 text-sm">
            💖 Organize suas finanças com amor e facilidade
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}