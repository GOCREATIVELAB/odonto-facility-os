import React, { useEffect, useState } from 'react';
import { clinicStore } from '../../state/clinicStore';
import { FinancialKPIs, Room } from '../../types/clinic';
import { GlassPanel } from './GlassPanel';
import { KPIWidget } from './KPIWidget';
import { TrendingUp, PieChart, DollarSign, Target, CheckCheck } from 'lucide-react';

interface KPIBoardProps {
  onSelectRoom?: (roomId: number) => void;
}

export const KPIBoard: React.FC<KPIBoardProps> = ({ onSelectRoom }) => {
  const [kpis, setKpis] = useState<FinancialKPIs>(clinicStore.getKPIs());
  const [rooms, setRooms] = useState<Room[]>(clinicStore.getRooms());

  useEffect(() => {
    const unsub = clinicStore.subscribe(() => {
      setKpis({ ...clinicStore.getKPIs() });
      setRooms([...clinicStore.getRooms()]);
    });
    return () => unsub();
  }, []);

  const occupiedRooms = rooms.filter((r) => r.status === 'ocupado').length;
  const bottleneckCount = rooms.filter((r) => r.is_gargalo).length;

  return (
    <GlassPanel
      className="h-full"
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold tracking-tight text-white">
              Painel Societário & Performance
            </h2>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Tempo Real
          </span>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        {/* KPI 1: Caixa Diário */}
        <KPIWidget
          label="Faturamento do Dia"
          value={`R$ ${kpis.caixa_diario.toLocaleString('pt-BR')}`}
          subValue="Meta: R$ 35.000 / dia"
          trend="up"
          trendPercent="+18.4%"
          sparklineData={kpis.sparkline_faturamento}
          color="#34d399"
        />

        {/* KPI 2: Ticket Médio */}
        <KPIWidget
          label="Ticket Médio"
          value={`R$ ${kpis.ticket_medio.toLocaleString('pt-BR')}`}
          subValue="22 tratamentos realizados"
          trend="up"
          trendPercent="+6.2%"
          sparklineData={[980, 1120, 1050, 1180, 1220, kpis.ticket_medio]}
          color="#60a5fa"
        />

        {/* Clinical Occupancy Card with Circular SVG Gauge */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
              Ocupação Clínica
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-bold text-white tabular-data">
                {kpis.ocupacao_atual}%
              </span>
              <span className="text-xs text-slate-400">
                ({occupiedRooms}/{rooms.length} salas ativas)
              </span>
            </div>
            {bottleneckCount > 0 ? (
              <span className="text-[10px] font-semibold text-amber-400 mt-1">
                ⚠️ {bottleneckCount} consultório em gargalo
              </span>
            ) : (
              <span className="text-[10px] text-emerald-400 mt-1">
                ✓ Fluxo clínico equilibrado
              </span>
            )}
          </div>

          {/* Circular SVG Gauge */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-16 h-16 -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                className="stroke-slate-800 fill-none"
                strokeWidth="5"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                className="fill-none transition-all duration-700"
                stroke={kpis.ocupacao_atual > 80 ? '#f59e0b' : '#38bdf8'}
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 * (1 - kpis.ocupacao_atual / 100)}
                strokeLinecap="round"
              />
            </svg>
            <PieChart className="w-5 h-5 text-sky-400 absolute" />
          </div>
        </div>

        {/* Conversion Rate Card */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
              Conversão de Avaliações
            </span>
            <span className="text-xl font-bold text-white tabular-data mt-0.5">
              {kpis.conversao_avaliacoes}%
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              {kpis.planos_fechados} de {kpis.consultas_concluidas} orçamentos aprovados
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <CheckCheck className="w-5 h-5" />
          </div>
        </div>

        {/* AI Projection Summary */}
        <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-200/90 leading-relaxed">
          <span className="font-semibold text-blue-300 block mb-1">
            Previsão do Master AI:
          </span>
          Fechamento estimado de caixa às 19h: <strong className="text-white">R$ 41.200,00</strong>. Sugerido priorizar liberação da Sala 03 para alívio da fila de profilaxia.
        </div>
      </div>
    </GlassPanel>
  );
};
