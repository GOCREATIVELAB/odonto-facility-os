import React, { useEffect, useState } from 'react';
import { clinicStore } from '../../state/clinicStore';
import { StaffMember } from '../../types/clinic';
import { GlassPanel } from './GlassPanel';
import { Users, Clock, Coffee, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface StaffListProps {
  onSelectRoom?: (roomId: number) => void;
}

export const StaffList: React.FC<StaffListProps> = ({ onSelectRoom }) => {
  const [staff, setStaff] = useState<StaffMember[]>(clinicStore.getStaff());

  useEffect(() => {
    const unsub = clinicStore.subscribe(() => {
      setStaff([...clinicStore.getStaff()]);
    });
    return () => unsub();
  }, []);

  const handleTogglePause = (doc: StaffMember) => {
    if (doc.status === 'pausa') {
      clinicStore.returnDoctorFromPause(doc.id);
    } else {
      clinicStore.sendDoctorToPause(doc.id);
    }
  };

  return (
    <GlassPanel
      className="h-full"
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-semibold tracking-tight text-white">
              Corpo Clínico & Escala
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            {staff.length} profissionais
          </span>
        </div>
      }
    >
      <div className="flex flex-col gap-2.5">
        {staff.map((doc) => (
          <div
            key={doc.id}
            className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col gap-2 ${
              doc.alerta_fadiga
                ? 'bg-amber-950/30 border-amber-500/50 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900/60 border-white/10 hover:border-white/20'
            }`}
          >
            {/* Top row: Avatar initials, name, status badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-md border ${
                    doc.alerta_fadiga
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                      : 'bg-blue-600/20 border-blue-500/30 text-blue-200'
                  }`}
                >
                  {doc.foto_iniciais}
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-white leading-tight">
                    {doc.nome}
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    {doc.crm_cro} · {doc.especialidade.toUpperCase()}
                  </span>
                </div>
              </div>

              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                  doc.status === 'atendimento'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : doc.status === 'pausa'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {doc.status}
              </span>
            </div>

            {/* Metrics: Turn time, continuous time without pause */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 bg-slate-950/40 p-2 rounded-xl border border-white/5">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Turno: <strong className="text-white">{Math.floor(doc.tempo_turno_min / 60)}h {doc.tempo_turno_min % 60}m</strong></span>
              </div>

              <div className="flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-slate-500" />
                <span className={doc.tempo_sem_pausa_min > 240 ? 'text-amber-400 font-bold' : ''}>
                  Sem pausa: {doc.tempo_sem_pausa_min}m
                </span>
              </div>
            </div>

            {/* Bottom: Pending charts and pause toggle button */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Prontuários pendentes: <strong className="text-white">{doc.prontuarios_pendentes}</strong></span>
              </div>

              <button
                onClick={() => handleTogglePause(doc)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-xl transition-all ${
                  doc.status === 'pausa'
                    ? 'bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                {doc.status === 'pausa' ? 'Retornar' : 'Pausa 15m'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
};
