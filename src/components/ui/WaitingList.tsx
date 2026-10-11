import React, { useEffect, useState } from 'react';
import { clinicStore } from '../../state/clinicStore';
import { Patient, Specialty } from '../../types/clinic';
import { GlassPanel } from './GlassPanel';
import { Users, Clock, AlertCircle, ArrowUpRight, Zap, Play } from 'lucide-react';

interface WaitingListProps {
  onSelectRoom?: (roomId: number) => void;
}

export const WaitingList: React.FC<WaitingListProps> = ({ onSelectRoom }) => {
  const [patients, setPatients] = useState<Patient[]>(clinicStore.getWaitingPatients());
  const [filterSpec, setFilterSpec] = useState<'all' | Specialty>('all');

  useEffect(() => {
    const unsub = clinicStore.subscribe(() => {
      setPatients([...clinicStore.getWaitingPatients()]);
    });
    return () => unsub();
  }, []);

  const handleDispatchAI = () => {
    clinicStore.runReceptionAgentDispatch();
  };

  const filteredPatients = patients.filter((p) => {
    if (filterSpec === 'all') return true;
    return p.especialidade_requisitada === filterSpec;
  });

  return (
    <GlassPanel
      className="h-full"
      header={
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-semibold tracking-tight text-white">
                Fila de Espera Física (Lobby)
              </h2>
            </div>
            <button
              onClick={handleDispatchAI}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition-all shadow-md shadow-blue-600/30"
              title="Executar Algoritmo do Agente de Recepção"
            >
              <Zap className="w-3 h-3 text-amber-300" />
              <span>Despachar IA</span>
            </button>
          </div>

          {/* Filter Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-950/60 rounded-xl border border-white/5 text-[11px]">
            <button
              onClick={() => setFilterSpec('all')}
              className={`flex-1 py-1 rounded-lg font-medium transition-all ${
                filterSpec === 'all'
                  ? 'bg-white/15 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos ({patients.length})
            </button>
            <button
              onClick={() => setFilterSpec('geral')}
              className={`flex-1 py-1 rounded-lg font-medium transition-all ${
                filterSpec === 'geral'
                  ? 'bg-blue-500/30 text-blue-200'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Geral
            </button>
            <button
              onClick={() => setFilterSpec('urgencia')}
              className={`flex-1 py-1 rounded-lg font-medium transition-all ${
                filterSpec === 'urgencia'
                  ? 'bg-rose-500/30 text-rose-200'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Urgência
            </button>
            <button
              onClick={() => setFilterSpec('orto')}
              className={`flex-1 py-1 rounded-lg font-medium transition-all ${
                filterSpec === 'orto'
                  ? 'bg-purple-500/30 text-purple-200'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Orto
            </button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        {filteredPatients.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
            <Users className="w-8 h-8 opacity-40 text-slate-400" />
            <span>Nenhum paciente aguardando nesta categoria.</span>
          </div>
        ) : (
          filteredPatients.map((patient) => {
            const waitMin = Math.floor(patient.tempo_espera / 60);
            const waitSec = patient.tempo_espera % 60;

            return (
              <div
                key={patient.id}
                className={`p-3 rounded-2xl border transition-all text-left flex items-center justify-between gap-3 ${
                  patient.prioridade === 'urgente'
                    ? 'bg-rose-950/30 border-rose-500/40 shadow-rose-500/10'
                    : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      patient.prioridade === 'urgente'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-slate-800 text-slate-200 border border-white/10'
                    }`}
                  >
                    {patient.iniciais}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-semibold text-white truncate">
                        {patient.nome}
                      </h4>
                      {patient.prioridade === 'urgente' && (
                        <span className="text-[9px] font-bold uppercase px-1 rounded bg-rose-500/30 text-rose-300">
                          Urgente
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 truncate block">
                      {patient.procedimento}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <div className="flex items-center gap-1 text-[11px] font-medium text-slate-300 tabular-data">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{waitMin}m {waitSec}s</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold tabular-data mt-0.5">
                    R$ {patient.valor_estimado || 420}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </GlassPanel>
  );
};
