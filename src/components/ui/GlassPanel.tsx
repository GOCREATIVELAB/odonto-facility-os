import React, { ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  header,
}) => {
  return (
    <div
      className={`glass-panel rounded-3xl p-5 flex flex-col pointer-events-auto text-slate-100 transition-all duration-300 relative overflow-hidden ${className}`}
    >
      {header && <div className="mb-3 shrink-0">{header}</div>}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
};
