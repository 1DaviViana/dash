import React, { useState } from 'react';
import { X, Database, FileSpreadsheet, Upload, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { DataSourceConfig } from '../types';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const INITIAL_SOURCES: DataSourceConfig[] = [
    {
        id: 'venda_empresa',
        name: 'Venda Empresa',
        sourceType: 'sql',
        lastUpdated: '12/05/2024 08:30',
        status: 'connected',
        details: 'ERP_PROD_DB01 (Table: Sales_KPI)'
    },
    {
        id: 'venda_ctm',
        name: 'Venda Específico (CTM)',
        sourceType: 'excel',
        lastUpdated: '10/05/2024 14:20',
        status: 'connected',
        details: 'relatorio_fechamento_maio.xlsx'
    },
    {
        id: 'margem_ctm',
        name: 'Margem Específico (CTM)',
        sourceType: 'excel',
        lastUpdated: '-',
        status: 'pending',
        details: 'Aguardando upload'
    }
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
    const [sources, setSources] = useState<DataSourceConfig[]>(INITIAL_SOURCES);
    const [activeTab, setActiveTab] = useState<'datasources' | 'general'>('datasources');

    if (!isOpen) return null;

    const handleSourceTypeChange = (id: string, type: 'excel' | 'sql') => {
        setSources(prev => prev.map(s => 
            s.id === id ? { ...s, sourceType: type, status: 'pending', details: type === 'excel' ? 'Aguardando upload' : 'Configurar conexão' } : s
        ));
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            {/* Panel */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-text-primary">Configurações</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-text-secondary transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-6 border-b border-slate-100">
                    <button 
                        onClick={() => setActiveTab('datasources')}
                        className={`py-3 mr-6 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'datasources' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
                    >
                        Fontes de Dados
                    </button>
                    <button 
                        onClick={() => setActiveTab('general')}
                        className={`py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'general' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
                    >
                        Geral
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-background-light">
                    {activeTab === 'datasources' && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 mb-6">
                                <p>Defina a origem dos dados para cada indicador. O sistema unificará as informações automaticamente.</p>
                            </div>

                            {sources.map((source) => (
                                <div key={source.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 transition-all hover:shadow-md">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-bold text-text-primary">{source.name}</h3>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <div className={`w-2 h-2 rounded-full ${source.status === 'connected' ? 'bg-primary' : source.status === 'pending' ? 'bg-yellow-400' : 'bg-red-500'}`}></div>
                                                <span className="text-xs text-text-secondary font-medium">
                                                    {source.status === 'connected' ? 'Sincronizado' : 'Pendente'} • {source.lastUpdated}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex bg-slate-100 rounded-lg p-1">
                                            <button 
                                                onClick={() => handleSourceTypeChange(source.id, 'excel')}
                                                className={`p-1.5 rounded-md transition-all ${source.sourceType === 'excel' ? 'bg-white shadow text-green-600' : 'text-slate-400 hover:text-slate-600'}`}
                                                title="Usar Excel"
                                            >
                                                <FileSpreadsheet size={16} strokeWidth={2.5} />
                                            </button>
                                            <button 
                                                onClick={() => handleSourceTypeChange(source.id, 'sql')}
                                                className={`p-1.5 rounded-md transition-all ${source.sourceType === 'sql' ? 'bg-white shadow text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                                                title="Usar Conexão SQL"
                                            >
                                                <Database size={16} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Configuration Area */}
                                    <div className="mt-3 pt-3 border-t border-slate-50">
                                        {source.sourceType === 'excel' ? (
                                            <div className="group border-2 border-dashed border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-primary-light/10 transition-colors">
                                                <Upload size={20} className="text-slate-400 group-hover:text-primary mb-2" />
                                                <span className="text-xs font-semibold text-text-secondary group-hover:text-primary">
                                                    {source.details === 'Aguardando upload' ? 'Clique para selecionar o arquivo .xlsx' : source.details}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="bg-slate-50 rounded-lg p-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Database size={14} className="text-slate-400" />
                                                    <span className="text-xs font-mono text-text-secondary truncate w-full">
                                                        {source.details === 'Configurar conexão' ? 'Nenhuma conexão ativa' : source.details}
                                                    </span>
                                                </div>
                                                <button className="w-full py-1.5 text-xs font-semibold text-primary bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                                                    Editar Query SQL
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'general' && (
                        <div className="flex flex-col items-center justify-center h-48 text-text-secondary">
                            <RefreshCw className="mb-2 opacity-50" />
                            <p className="text-sm">Configurações gerais indisponíveis na demo.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-white">
                    <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
};