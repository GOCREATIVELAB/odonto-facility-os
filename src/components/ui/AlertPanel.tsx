import React, { useEffect, useState } from 'react';
import { clinicStore } from '../../state/clinicStore';
import { StaffMember } from '../../types/clinic';
import { GlassPanel } from './GlassPanel';
import { AlertTriangle, ShieldAlert, HeartPulse, UserCheck, ArrowRight } from 'lucide-react';

export const AlertPanel: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>(clinicStore.getStaff());

  useEffect(() => {
    const unsub = clinicStore.subscribe(() => {
      setStaff([...clinicStore.getStaff()]);
    });
    return () => unsub();
  }, []);

  const fatigueDoctors = staff.filter((s) => s.alerta_fadiga || s.tempo_sem_pausa_min > 240);
  const pendingChartsCount = staff.reduce((acc, s) => acc + s.prontuarios_pendentes, 0);

  return (
    <GlassPanel
      className="h-full"
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold tracking-tight text-white">
              Painel de Alertas de RH
            </h2>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Monitoramento IA
          </span>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        {/* Fatigue Warning Banner */}
        {fatigueDoctors.length > 0 ? (
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-left flex flex-col gap-2">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Atenção: Sobrecarga Fisiológica</span>
            </div>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              {fatigueDoctors.map((d) => d.nome).join(', ')} excedeu a janela contínua de 240 minutos sem intervalo regulamentar.
            </p>
            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className="text-amber-400 font-medium">Impacto: -14% precisão cirúrgica estimada</span>
              <button
                onClick={() => {
                  fatigueDoctors.forEach((d) => clinicStore.sendDoctorToPause(d.id));
                }}
                className="px-2.5 py-1 rounded-xl bg-amber-500/30 hover:bg-amber-500/50 text-amber-100 font-medium transition-all"
              >
                Conceder Intervalo
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-left flex items-center gap-2.5">
            <HeartPulse className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-emerald-200">
              Todos os profissionais em turnos equilibrados. Nenhum alerta de fadiga crítico no momento.
            </span>
          </div>
        )}

        {/* Pending Charts Metric */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-between text-left">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
              Prontuários para Assinatura Digital
            </span>
            <span className="text-xl font-bold text-white tabular-data mt-0.5">
              {pendingChartsCount} documentos
            </span>
            <span className="text-[10px] text-slate-400">
              Conformidade CRO/CFO: 94.2%
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>

        {/* AI Correlation Insight */}
        <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-left flex flex-col gap-1.5 text-xs text-purple-200/90 leading-relaxed">
          <span className="font-semibold text-purple-300">
            Cruzamento Ociosidade x Atrasos:
          </span>
          <p>
            O Agente de RH detectou que a Sala 02 teve 45 minutos de ociosidade pela manhã, enquanto a Sala 03 acumulou atrasos de 22%.
          </p>
          <span className="text-[11px] text-purple-400 font-medium mt-1">
            Recomendação: Ativar auto-rebalanceamento dinâmico na triagem para a Dra. Beatriz.
          </span>
        </div>
      </div>
    </GlassPanel>
  );
};
