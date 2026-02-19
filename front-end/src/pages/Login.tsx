import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { Loader2, Lock } from 'lucide-react';

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
        <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
            <div className="w-full max-w-md bg-white border border-slate-200 p-8 md:p-10 rounded shadow-lg shadow-slate-200/50">
                <div className="flex flex-col items-center mb-10 space-y-4">
                    <div className="h-12 w-12 bg-rose-50 rounded-full flex items-center justify-center text-slate-900 border border-rose-100">
                        <Lock size={20} strokeWidth={1.5} />
                    </div>
                    <div className="text-center space-y-1">
                        <h1 className="font-serif text-3xl font-bold text-slate-900 tracking-tight">Night Peri</h1>
                        <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-medium">Admin Access</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-sm"
                            placeholder="admin@loja.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-sm"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 rounded p-3 text-red-600 text-xs text-center font-medium">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest text-xs font-bold"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Entrando...
                            </>
                        ) : (
                            'Acessar Painel'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-slate-100 pt-6">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                        &copy; 2026 Night Peri Beauty. Restrito.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
