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
        <div className="flex items-center justify-center min-h-screen bg-zinc-950 px-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl shadow-black/50">
                <div className="flex flex-col items-center mb-8 space-y-4">
                    <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                        <Lock size={24} />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-white tracking-tight">Painel Administrativo</h1>
                        <p className="text-zinc-400 text-sm mt-1">Entre com suas credenciais de acesso</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                            placeholder="admin@loja.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Entrando...
                            </>
                        ) : (
                            'Acessar Painel'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-zinc-500">
                        &copy; 2026 SupleStore Admin. Uso restrito.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
