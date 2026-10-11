import React, { useRef, useState } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KPIWidgetProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendPercent?: string;
  sparklineData: number[];
  color?: string; // hex or tailwind
}

export const KPIWidget: React.FC<KPIWidgetProps> = ({
  label,
  value,
  subValue,
  trend = 'up',
  trendPercent,
  sparklineData,
  color = '#38bdf8',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, isHovered: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, isHovered: false }));
  };

  // Build SVG path for sparkline
  const minVal = Math.min(...sparklineData);
  const maxVal = Math.max(...sparklineData);
  const range = maxVal - minVal || 1;
  const width = 80;
  const height = 32;

  const points = sparklineData
    .map((val, index) => {
      const x = (index / (sparklineData.length - 1)) * width;
      const y = height - ((val - minVal) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-2xl p-4 bg-slate-900/60 border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/20 group"
      style={{
        background: mousePos.isHovered
          ? `radial-gradient(220px circle at ${mousePos.x}px ${mousePos.y}px, rgba(56, 189, 248, 0.12), rgba(15, 23, 42, 0.65))`
          : 'rgba(15, 23, 42, 0.65)',
      }}
    >
      <div className="grid grid-cols-2 items-center gap-2">
        {/* Left Column: Label & Value */}
        <div className="flex flex-col">
          <span className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
            {label}
          </span>
          <span className="text-xl font-bold text-white tracking-tight tabular-data mt-0.5">
            {value}
          </span>
          {subValue && (
            <span className="text-[10px] text-slate-500 mt-0.5">{subValue}</span>
          )}
        </div>

        {/* Right Column: Sparkline & Trend */}
        <div className="flex flex-col items-end justify-between h-full">
          {trendPercent && (
            <div
              className={`flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                trend === 'up'
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-rose-500/15 text-rose-400'
              }`}
            >
              {trend === 'up' ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              <span>{trendPercent}</span>
            </div>
          )}

          {/* Sparkline SVG */}
          <div className="w-20 h-8 mt-2">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full overflow-visible"
            >
              <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
              {/* Highlight dot on last point */}
              {sparklineData.length > 0 && (
                <circle
                  cx={width}
                  cy={height - ((sparklineData[sparklineData.length - 1] - minVal) / range) * (height - 6) - 3}
                  r="3"
                  fill={color}
                  className="animate-ping origin-center"
                />
              )}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
