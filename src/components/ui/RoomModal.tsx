import React, { useEffect, useState } from 'react';
import { clinicStore } from '../../state/clinicStore';
import { Room, Patient, StaffMember } from '../../types/clinic';
import {
  X,
  Clock,
  User,
  Stethoscope,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Thermometer,
  Sun,
  ShieldAlert,
  Coins,
} from 'lucide-react';

interface RoomModalProps {
  roomId: number | null;
  onClose: () => void;
}

export const RoomModal: React.FC<RoomModalProps> = ({ roomId, onClose }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [doctor, setDoctor] = useState<StaffMember | null>(null);

  useEffect(() => {
    if (!roomId) {
      setRoom(null);
      return;
    }

    const update = () => {
      const r = clinicStore.getRoomById(roomId);
      if (r) {
        setRoom({ ...r });
        const p = clinicStore.getPatients().find((pt) => pt.id === r.patient_id) || null;
        setPatient(p ? { ...p } : null);
        const d = clinicStore.getStaff().find((st) => st.id === r.medico_id) || null;
        setDoctor(d ? { ...d } : null);
      }
    };

    update();
    const unsub = clinicStore.subscribe(update);
    return () => unsub();
  }, [roomId]);

  if (!roomId || !room) return null;

  const isOccupied = room.status === 'ocupado';
  const progressRatio = Math.min(1, room.tempo_atendimento_atual / room.timer_limite);
  const remainingSeconds = Math.max(0, room.timer_limite - room.tempo_atendimento_atual);

  const handleFinishConsultation = () => {
    clinicStore.completeConsultation(room.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg glass-panel rounded-3xl p-6 shadow-2xl border transition-all text-left ${
          room.tipo === 'urgencia'
            ? 'border-rose-500/50 shadow-rose-500/10'
            : room.is_gargalo
            ? 'border-amber-500/50 shadow-amber-500/10'
            : 'border-white/20'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: room.luz_cor_hex }}
              />
              <h2 className="text-lg font-bold text-white tracking-tight">
                {room.nome}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="capitalize">{room.tipo}</span>
              <span>·</span>
              <span
                className={`font-semibold ${
                  isOccupied ? 'text-sky-400' : 'text-emerald-400'
                }`}
              >
                {isOccupied ? 'Em Atendimento' : 'Consultório Disponível'}
              </span>
              {room.is_gargalo && (
                <>
                  <span>·</span>
                  <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded">
                    Gargalo Ativo (+15%)
                  </span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 flex flex-col gap-4">
          {isOccupied ? (
            <>
              {/* Patient Card */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center font-bold text-white text-sm">
                    {patient?.iniciais || 'PC'}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {patient?.nome || 'Paciente em Atendimento'}
                    </h4>
                    <p className="text-xs text-slate-300">
                      {room.procedimento_atual || 'Procedimento Clínico'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-emerald-400 tabular-data block">
                    R$ {patient?.valor_estimado || 550},00
                  </span>
                  <span className="text-[10px] text-slate-400">Orçamento Aprovado</span>
                </div>
              </div>

              {/* Doctor In Charge */}
              <div className="p-3 rounded-2xl bg-slate-900/40 border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Stethoscope className="w-4 h-4 text-purple-400" />
                  <span>
                    Dentista: <strong className="text-white">{doctor?.nome || 'Dr. Plantonista'}</strong> ({doctor?.crm_cro})
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {doctor?.tempo_sem_pausa_min || 45}m em atividade
                </span>
              </div>

              {/* Consultation Progress & Timer */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>Tempo Decorrido:</span>
                    <strong className="text-white tabular-data">
                      {Math.floor(room.tempo_atendimento_atual / 60)}m {room.tempo_atendimento_atual % 60}s
                    </strong>
                  </div>
                  <span className="text-slate-400 text-[11px]">
                    Limite: {Math.floor(room.timer_limite / 60)}m
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      room.is_gargalo
                        ? 'bg-amber-500 animate-pulse'
                        : room.tipo === 'urgencia'
                        ? 'bg-rose-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, (room.tempo_atendimento_atual / room.timer_limite) * 100)}%` }}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-dashed border-white/10 text-center flex flex-col items-center gap-2 text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 opacity-60" />
              <p className="text-xs">
                Consultório higienizado e pronto para receber o próximo paciente da fila.
              </p>
            </div>
          )}

          {/* Environmental Telemetry */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/40 border border-white/5 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-blue-400" />
              <div>
                <span className="text-[10px] text-slate-400 block">Clima IoT</span>
                <span className="font-semibold text-white">{room.temperatura.toFixed(1)} °C</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/40 border border-white/5 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[10px] text-slate-400 block">Iluminação</span>
                <span className="font-semibold text-white">{room.iluminacao_lux} Lux</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors"
          >
            Fechar Visão
          </button>

          {isOccupied && (
            <button
              onClick={handleFinishConsultation}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-semibold text-white shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Coins className="w-3.5 h-3.5 text-emerald-200" />
              <span>Concluir & Faturar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
