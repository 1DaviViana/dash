import React from 'react';
import { 
    LayoutDashboard, 
    ScrollText, 
    TrendingUp, 
    Calculator, 
    Settings,
    LogOut
} from 'lucide-react';
import { MENU_ITEMS } from '../constants';
import { UserProfile } from '../types';

const iconMap: Record<string, React.ElementType> = {
    'layout-dashboard': LayoutDashboard,
    'scroll-text': ScrollText,
    'trending-up': TrendingUp,
    'calculator': Calculator
};

interface SidebarProps {
    user: UserProfile;
    onOpenSettings: () => void;
    onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onOpenSettings, onLogout }) => {
    return (
        <aside className="hidden md:flex w-64 flex-col h-screen sticky top-0 bg-card-light border-r border-slate-100 shadow-sm z-10">
            {/* User Profile Section */}
            <div className="p-4 pb-6">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-background-light transition-colors cursor-pointer group">
                    <img 
                        src={user.avatarUrl} 
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover shadow-sm border-2 border-transparent group-hover:border-primary transition-all"
                    />
                    <div className="flex flex-col overflow-hidden">
                        <h2 className="text-text-primary font-bold text-sm truncate">{user.name}</h2>
                        <p className="text-text-secondary text-[10px] font-bold uppercase tracking-wide truncate">{user.role}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">
                {MENU_ITEMS.map((item) => {
                    const Icon = iconMap[item.icon];
                    return (
                        <a
                            key={item.label}
                            href="#"
                            className={`
                                flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                                ${item.active 
                                    ? 'bg-primary-light text-primary' 
                                    : 'text-text-secondary hover:bg-slate-50 hover:text-text-primary'}
                            `}
                        >
                            <Icon size={18} strokeWidth={item.active ? 2.5 : 2} />
                            <span>{item.label}</span>
                        </a>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-3 mt-auto border-t border-slate-50">
                <button
                    onClick={onOpenSettings}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-text-secondary hover:bg-slate-50 hover:text-text-primary transition-colors text-left"
                >
                    <Settings size={18} strokeWidth={2} />
                    <span>Configurações</span>
                </button>
                <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-text-secondary hover:bg-red-50 hover:text-red-500 transition-colors text-left"
                >
                    <LogOut size={18} strokeWidth={2} />
                    <span>Sair</span>
                </button>
            </div>
        </aside>
    );
};