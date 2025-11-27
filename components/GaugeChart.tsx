import React, { useMemo } from 'react';

interface GaugeChartProps {
    percentage: number;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({ percentage }) => {
    const maxScale = 125;
    // Allow visual filling up to maxScale, but text shows real percentage
    const clampedValue = Math.min(percentage, maxScale);
    const radius = 40;
    const strokeWidth = 8;
    const cx = 50;
    const cy = 50;

    // Fixed Colors Configuration
    const colors = {
        red: "#EF4444",      // Red
        yellow: "#EAB308",   // Yellow
        green: "#10B981",    // Green (Primary)
        blue: "#3B82F6"      // Blue
    };

    // Calculate fixed color based on the percentage logic
    const getColor = (val: number) => {
        if (val < 50) return colors.red;
        if (val < 100) return colors.yellow;
        if (val < 125) return colors.green;
        return colors.blue;
    };

    const currentColor = useMemo(() => getColor(percentage), [percentage]);

    // Calculate end coordinates for the progress arc
    const calculateCoords = (percent: number) => {
        const ratio = Math.min(percent / maxScale, 1);
        // angle moves from PI (left) to 0 (right)
        const angle = Math.PI * (1 - ratio); 
        return {
            x: cx + radius * Math.cos(angle),
            y: cy - radius * Math.sin(angle) // SVG y is down
        };
    };

    const end = calculateCoords(clampedValue);

    // SVG Paths
    const bgPath = "M 10 50 A 40 40 0 0 1 90 50";
    const progressPath = `M 10 50 A 40 40 0 0 1 ${end.x} ${end.y}`;

    // 100% Target Marker Coordinates
    const targetAngle = Math.PI * (1 - (100 / maxScale));
    const tickInner = radius - strokeWidth/2 - 2;
    const tickOuter = radius + strokeWidth/2 + 2;
    const tickX1 = cx + tickInner * Math.cos(targetAngle);
    const tickY1 = cy - tickInner * Math.sin(targetAngle);
    const tickX2 = cx + tickOuter * Math.cos(targetAngle);
    const tickY2 = cy - tickOuter * Math.sin(targetAngle);

    return (
        <div className="relative flex flex-col items-center justify-center w-full max-w-[240px] -mb-4">
            <svg viewBox="0 0 100 55" className="w-full h-auto overflow-visible">
                {/* Background Track */}
                <path d={bgPath} fill="none" stroke="#F1F5F9" strokeWidth={strokeWidth} strokeLinecap="round" />
                
                {/* Progress Track with Fixed Solid Color */}
                <path 
                    d={progressPath} 
                    fill="none" 
                    stroke={currentColor}
                    className="transition-all duration-1000 ease-out" 
                    strokeWidth={strokeWidth} 
                    strokeLinecap="round" 
                />
                
                {/* 100% Target Marker */}
                <line 
                    x1={tickX1} y1={tickY1} 
                    x2={tickX2} y2={tickY2} 
                    stroke="#CBD5E1" 
                    strokeWidth="1.5"
                />
                <text x={tickX2} y={tickY2 - 3} textAnchor="middle" fontSize="4" fill="#94A3B8" fontWeight="bold">100%</text>
            </svg>
            
            {/* Centered Text */}
            <div className="absolute bottom-[18px] flex flex-col items-center transform translate-y-1">
                 <span 
                    className="text-2xl font-bold leading-none tracking-tight transition-colors duration-500"
                    style={{ color: currentColor }}
                 >
                    {percentage}%
                 </span>
                 <span className="text-[9px] text-text-secondary font-bold uppercase tracking-widest mt-0.5 opacity-80">Atingimento</span>
            </div>
        </div>
    );
};