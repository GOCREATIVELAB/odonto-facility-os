import React, { useEffect, useState } from 'react';
import { clinicStore } from '../../state/clinicStore';
import { ClinicEvent } from '../../types/clinic';
import { GlassPanel } from './GlassPanel';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRightCircle,
  Coins,
  Cpu,
} from 'lucide-react';

interface EventFeedProps {
  onSelectRoom?: (roomId: number) => void;
}

export const EventFeed: React.FC<EventFeedProps> = ({ onSelectRoom }) => {
  const [events, setEvents] = useState<ClinicEvent[]>(clinicStore.getEvents());

  useEffect(() => {
    const unsub = clinicStore.subscribe(() => {
      setEvents([...clinicStore.getEvents()]);
    });
    return () => unsub();
  }, []);

  const getEventIcon = (event: ClinicEvent) => {
    switch (event.tipo) {
      case 'gargalo':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />;
      case 'financeiro':
        return <Coins className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />;
      case 'triagem':
        return <ArrowRightCircle className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />;
      case 'rh':
        return <Bell className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />;
      case 'alerta':
        return <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />;
    }
  };

  return (
    <GlassPanel
      className="h-full"
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-semibold tracking-tight text-white">
              Feed de Telemetria & IA
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-medium tabular-data">
            {events.length} logs
          </span>
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        {events.map((evt) => (
          <div
            key={evt.id}
            onClick={() => {
              if (evt.metadata?.roomId && onSelectRoom) {
                onSelectRoom(evt.metadata.roomId);
              }
            }}
            className={`p-3 rounded-2xl border transition-all text-left flex gap-2.5 ${
              evt.metadata?.roomId ? 'cursor-pointer hover:scale-[1.01]' : ''
            } ${
              evt.nivel === 'urgente'
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-100 hover:border-rose-400/60'
                : evt.nivel === 'alerta'
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-100 hover:border-amber-400/60'
                : evt.nivel === 'sucesso'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                : 'bg-slate-900/50 border-white/5 text-slate-200 hover:border-white/10'
            }`}
          >
            {getEventIcon(evt)}

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {evt.origem}
                </span>
                <span className="text-[10px] text-slate-500 tabular-data">
                  {evt.timestamp}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-200 line-clamp-3">
                {evt.mensagem}
              </p>
              {evt.metadata?.valor && (
                <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-emerald-400 tabular-data">
                  <span>+ R$ {evt.metadata.valor.toLocaleString('pt-BR')},00</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
};
