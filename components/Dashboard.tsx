import React from 'react';
import { BonusData } from '../types';
import { GaugeChart } from './GaugeChart';
import { formatCurrency } from '../utils';

interface DashboardProps {
    data: BonusData;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
    const { bonusTable, components } = data;

    // Helper to determine which row matches a given percentage
    const getMatchingRowId = (percentage: number) => {
        // Rows are sorted by threshold asc. Find the last one that is <= percentage
        const reversedRows = [...bonusTable.rows].reverse();
        const match = reversedRows.find(row => row.threshold <= percentage);
        return match ? match.id : null;
    };

    return (
        <div className="flex-1 flex flex-col min-h-screen">
            <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-8">
                
                {/* Bonus Breakdown Section */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                        Composição do seu Bônus
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {components.map((item) => (
                            <div key={item.id} className="bg-card-light p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group relative overflow-hidden">
                                {/* Header: Icon and Value */}
                                <div className="flex items-center justify-between mb-3 z-10 relative">
                                    <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform duration-300">
                                        <item.icon size={18} strokeWidth={2.5} />
                                    </div>
                                    <div className="text-right">
                                        <span className={`font-bold text-lg ${item.value === 0 ? 'text-slate-400' : 'text-primary'}`}>
                                            {item.value > 0 ? '+' : ''} {formatCurrency(item.value)}
                                        </span>
                                    </div>
                                </div>

                                {/* Title Area */}
                                <div className="mb-1 min-h-[40px] z-10 relative">
                                    <h3 className="text-sm font-bold text-text-primary leading-tight mb-0.5">{item.title}</h3>
                                    <p className="text-text-secondary text-[11px] font-medium">{item.subtitle}</p>
                                </div>
                                
                                {/* Gauge Chart Area */}
                                <div className="mt-2 flex justify-center flex-1 items-end w-full">
                                    <GaugeChart percentage={item.percentage} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Adjustments Section */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-text-primary mb-4">Ajustes e Descontos</h2>
                    {data.adjustments.length > 0 ? (
                        <div className="bg-card-light rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-50 overflow-hidden">
                            {data.adjustments.map((adj) => (
                                <div key={adj.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors">
                                    <span className="text-text-primary font-medium text-sm">{adj.label}</span>
                                    <span className="text-accent-negative font-bold text-sm">
                                        - {formatCurrency(Math.abs(adj.value))}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="bg-card-light rounded-xl border border-slate-100 shadow-sm p-6 text-center text-text-secondary text-sm">
                            Nenhum ajuste ou desconto aplicado este mês.
                         </div>
                    )}
                </section>

                {/* Bonus Rules Table Section */}
                <section className="mb-20">
                    <h2 className="text-xl font-bold text-text-primary mb-4">{bonusTable.title}</h2>
                    <div className="bg-card-light rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px] text-sm text-left border-collapse">
                                <thead className="bg-slate-50 text-text-secondary font-semibold uppercase text-[10px]">
                                    <tr>
                                        {bonusTable.columns.map((col, idx) => (
                                            <th key={idx} className="px-4 py-3 whitespace-nowrap first:pl-5 last:pr-5">
                                                {col.header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {bonusTable.rows.map((row) => (
                                        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                                            {bonusTable.columns.map((col, idx) => {
                                                const value = row[col.accessor];
                                                let displayValue: React.ReactNode = value;

                                                if (col.type === 'currency' && typeof value === 'number') {
                                                    displayValue = value === 0 ? '-' : formatCurrency(value).replace('R$', '').trim();
                                                } else if (col.type === 'percentage') {
                                                    displayValue = `${value}%`;
                                                }

                                                // Highlight Logic
                                                let isHighlighted = false;
                                                const matchingComponent = components.find(c => c.tableAccessor === col.accessor);
                                                
                                                if (matchingComponent) {
                                                    const targetRowId = getMatchingRowId(matchingComponent.percentage);
                                                    if (targetRowId === row.id) {
                                                        isHighlighted = true;
                                                    }
                                                }

                                                return (
                                                    <td key={idx} className={`px-4 py-2.5 whitespace-nowrap first:pl-5 last:pr-5 font-medium relative text-xs md:text-sm
                                                        ${col.type === 'currency' ? 'text-text-secondary font-mono group-hover:text-text-primary' : 'text-text-primary'}
                                                        ${isHighlighted ? 'bg-primary/10 text-primary-dark font-bold' : ''}
                                                    `}>
                                                        {isHighlighted && (
                                                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary"></div>
                                                        )}
                                                       {col.type === 'currency' && typeof value === 'number' && value > 0 && <span className={`text-[10px] mr-1 ${isHighlighted ? 'text-primary' : 'text-slate-400'}`}>R$</span>}
                                                       {displayValue}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

            </main>

            {/* Sticky Footer Summary */}
            <footer className="sticky bottom-0 left-0 right-0 p-4 flex justify-center z-30 pointer-events-none">
                <div className="pointer-events-auto w-full max-w-4xl bg-white/95 backdrop-blur-lg border border-slate-200 shadow-xl rounded-xl p-4 md:px-6 md:py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-8">
                        
                        {/* Summary Items */}
                        <div className="flex items-center justify-between md:justify-start gap-2 md:gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-text-secondary font-medium text-xs uppercase tracking-wide">Bônus Bruto:</span>
                                <span className="text-text-primary font-bold">{formatCurrency(data.grossTotal)}</span>
                            </div>
                            <span className="text-slate-300 font-light text-lg hidden md:block">|</span>
                            <div className="flex items-center gap-2">
                                <span className="text-text-secondary font-medium text-xs uppercase tracking-wide">Ajustes:</span>
                                <span className="text-accent-negative font-bold">{formatCurrency(data.totalAdjustments)}</span>
                            </div>
                        </div>

                        <span className="text-text-secondary font-light text-xl hidden md:block">=</span>
                        <div className="h-px bg-slate-100 w-full md:hidden"></div>

                        {/* Total */}
                        <div className="flex items-center justify-between md:justify-end gap-3">
                            <span className="text-text-secondary font-bold text-base">Bônus Líquido:</span>
                            <span className="text-primary font-extrabold text-xl">{formatCurrency(data.netTotal)}</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};