import React from 'react';

interface ProgressBarProps {
    percentage: number;
    colorClass?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, colorClass = "bg-primary" }) => {
    // Defined max scale as 125% per requirements
    const MAX_SCALE = 125;
    // Clamp visual calculation if needed, though we allow the indicator to show the real number
    const clampedPercentage = Math.min(percentage, MAX_SCALE);
    
    // Calculate width percentages relative to the container
    const visualWidth = (clampedPercentage / MAX_SCALE) * 100;
    const targetPosition = (100 / MAX_SCALE) * 100; // This will be 80% position

    return (
        <div className="relative pt-10 pb-2 select-none w-full">
            
            {/* Floating Value Indicator */}
            <div 
                className="absolute top-0 transition-all duration-1000 ease-out flex flex-col items-center z-20 transform -translate-x-1/2"
                style={{ left: `${visualWidth}%` }}
            >
                <div className={`${colorClass} text-white text-[11px] font-bold py-1 px-2.5 rounded-lg shadow-sm mb-1 whitespace-nowrap`}>
                    {percentage}%
                </div>
                {/* Triangle Indicator */}
                <div className={`w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-primary`}></div>
            </div>

            {/* Chart Track */}
            <div className="h-3 w-full bg-slate-100 rounded-full relative">
                
                {/* 100% Target Line (The 'Bullet' Target) */}
                <div 
                    className="absolute top-[-4px] bottom-[-4px] w-[2px] bg-slate-800 z-10 rounded-full"
                    style={{ left: `${targetPosition}%` }}
                ></div>

                {/* Actual Progress Bar */}
                <div 
                    className={`absolute top-0 left-0 h-full ${colorClass} rounded-full opacity-90 transition-all duration-1000 ease-out`}
                    style={{ width: `${visualWidth}%` }}
                />
            </div>

            {/* Axis Labels */}
            <div className="flex justify-between text-[10px] font-semibold text-text-secondary mt-2 relative h-4">
                <span className="absolute left-0">0%</span>
                
                {/* 100% Label aligned with the target line */}
                <span 
                    className="absolute transform -translate-x-1/2 text-text-primary font-bold"
                    style={{ left: `${targetPosition}%` }}
                >
                    100%
                </span>

                <span className="absolute right-0">{MAX_SCALE}%</span>
            </div>
        </div>
    );
};