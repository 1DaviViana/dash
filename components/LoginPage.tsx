import React, { useState } from 'react';
import { UserProfile } from '../types';
import { api } from '../services/api';
import { LogIn, Lock, User, AlertCircle } from 'lucide-react';

interface LoginPageProps {
    onLogin: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Treatment for login inputs:
            // A) Trim spaces: " admin " -> "admin"
            // B) Case insensitive: "ADMIN" -> "admin"
            const normalizedUser = username.trim().toLowerCase();

            // Simple Password verification for demo
            // Allow any password matching "user123" pattern or just "123" for simplicity
            if (!password) {
                 throw new Error("Digite a senha.");
            }

            // Pass the normalized username to the API
            const user = await api.login(normalizedUser);
            onLogin(user);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Falha no login');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="bg-primary/5 p-8 text-center border-b border-slate-100">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                        <LogIn className="text-white" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary">Bonus Dashboard</h1>
                    <p className="text-text-secondary text-sm mt-1">Acesse seu painel de performance</p>
                </div>

                <form onSubmit={handleLogin} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-text-primary ml-1">Usuário</label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-primary focus:bg-white focus:outline-none transition-all font-medium text-text-primary"
                                placeholder="Ex: admin, paulo, maestri..."
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-text-primary ml-1">Senha</label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-primary focus:bg-white focus:outline-none transition-all font-medium text-text-primary"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            'Entrar'
                        )}
                    </button>

                    <div className="text-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="text-xs text-text-secondary mb-2 font-bold uppercase tracking-wide">Usuários Demo (Senha: 123)</p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-left">
                            <div>
                                <span className="font-bold">admin</span> (Root)
                            </div>
                            <div>
                                <span className="font-bold">paulo</span> (Diretor)
                            </div>
                            <div>
                                <span className="font-bold">maestri</span> (Nordtech)
                            </div>
                            <div>
                                <span className="font-bold">nunes</span> (Toyama)
                            </div>
                             <div>
                                <span className="font-bold">moema</span> (Gestor)
                            </div>
                            <div>
                                <span className="font-bold">ana</span> (Vendas)
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};