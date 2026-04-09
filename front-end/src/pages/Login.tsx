import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/admin');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            login(response.data.token, response.data.user);
            navigate('/admin');
        } catch (err) {
            setError('Credenciais inválidas. Verifique seu e-mail e senha.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#fce4ec]/30 selection:bg-rosa-200 selection:text-rosa-700 font-['Outfit']">
            {/* Decorative Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 bg-white">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#fce4ec] rounded-full blur-[120px] opacity-40" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#e3f2fd] rounded-full blur-[100px] opacity-30" />
            </div>

            <div className="w-full max-w-md px-6 animate-in fade-in zoom-in duration-500">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-12">
                    <div className="flex flex-col items-center mb-1">
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-[#4a4a4a] leading-none" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            shine.
                        </h1>
                        <span className="text-xs text-[#4a4a4a] uppercase tracking-[0.3em] font-medium mt-1">
                            glam
                        </span>
                    </div>
                    <div className="w-8 h-1 bg-rosa-400 rounded-full mt-6" />
                    <p className="text-gray-400 text-[11px] uppercase tracking-widest mt-4 font-semibold">Painel Administrativo</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] p-8 md:p-10 shadow-[0_20px_50px_rgba(252,228,236,0.3)]">
                    <h2 className="text-xl font-bold text-gray-800 mb-8 text-center italic">Bem-vinda de volta</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                                E-mail de Acesso
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-rosa-200 focus:border-rosa-400 focus:bg-white transition-all text-sm"
                                placeholder="exemplo@shineglam.com"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                                Senha Secreta
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-rosa-200 focus:border-rosa-400 focus:bg-white transition-all text-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50/50 border border-red-100 text-red-500 text-[11px] font-semibold p-4 rounded-xl text-center animate-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm shadow-lg shadow-gray-200"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Autenticando...
                                </>
                            ) : (
                                'Acessar Painel'
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-[10px] text-gray-300 uppercase tracking-widest font-medium">
                            &copy; 2026 Shine Glam &bull; Todos os direitos reservados
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
