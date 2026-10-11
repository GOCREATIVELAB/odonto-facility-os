import React, { useEffect, useState } from 'react';
import { clinicStore } from '../../state/clinicStore';
import { Patient, Room, StaffMember } from '../../types/clinic';
import { GlassPanel } from './GlassPanel';
import {
  Users,
  DoorOpen,
  Video,
  Phone,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';

interface PeopleAndRoomsPanelProps {
  onSelectRoom: (roomId: number) => void;
  onSelectCCTV: (roomId: number) => void;
}

export const PeopleAndRoomsPanel: React.FC<PeopleAndRoomsPanelProps> = ({
  onSelectRoom,
  onSelectCCTV,
}) => {
  const [rooms, setRooms] = useState<Room[]>(clinicStore.getRooms());
  const [staff, setStaff] = useState<StaffMember[]>(clinicStore.getStaff());
  const [patients, setPatients] = useState<Patient[]>(clinicStore.getPatients());

  useEffect(() => {
    const unsub = clinicStore.subscribe(() => {
      setRooms([...clinicStore.getRooms()]);
      setStaff([...clinicStore.getStaff()]);
      setPatients([...clinicStore.getPatients()]);
    });
    return () => unsub();
  }, []);

  const totalPeople = staff.length + patients.length;
  const occupiedCount = rooms.filter((r) => r.status === 'ocupado').length;
  const freeCount = rooms.filter((r) => r.status === 'livre').length;

  return (
    <GlassPanel
      className="h-full"
      header={
        <div className="flex flex-col gap-3">
          {/* Header title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                Pessoas na Unidade (People on Ward)
              </h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-300">
              Ao Vivo
            </span>
          </div>

          {/* Top Demographic Counter Pills (Matching Video) */}
          <div className="grid grid-cols-4 gap-1.5 text-center">
            {/* Total */}
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 flex flex-col items-center">
              <span className="text-sm font-bold text-slate-900 dark:text-white tabular-data">
                {totalPeople}
              </span>
              <span className="text-[9px] font-medium text-slate-500 uppercase">
                Total
              </span>
            </div>

            {/* Patients */}
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/20 flex flex-col items-center">
              <span className="text-sm font-bold text-purple-600 dark:text-purple-300 tabular-data">
                {patients.length}
              </span>
              <span className="text-[9px] font-medium text-purple-500 uppercase">
                Pacientes
              </span>
            </div>

            {/* Doctors */}
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-500/20 flex flex-col items-center">
              <span className="text-sm font-bold text-blue-600 dark:text-blue-300 tabular-data">
                {staff.length}
              </span>
              <span className="text-[9px] font-medium text-blue-500 uppercase">
                Corpo Clínico
              </span>
            </div>

            {/* In Ward */}
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/20 flex flex-col items-center">
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-300 tabular-data">
                {occupiedCount + 2}
              </span>
              <span className="text-[9px] font-medium text-emerald-500 uppercase">
                Em Sala
              </span>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4 text-left">
        {/* Section 1: Staff Roster */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Equipe Médica em Turno</span>
            <span className="text-[10px] text-slate-400">CRO/COREN</span>
          </div>

          <div className="flex flex-col gap-1.5">
            {staff.map((doc) => {
              const currentRoom = rooms.find((r) => r.id === doc.sala_atual_id);

              return (
                <div
                  key={doc.id}
                  className="p-2.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 hover:border-blue-500/40 flex items-center justify-between gap-2.5 transition-all shadow-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-xs shrink-0"
                      style={{ backgroundColor: doc.avatar_color }}
                    >
                      {doc.foto_iniciais}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {doc.nome}
                        </h4>
                        {doc.alerta_fadiga && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {doc.cargo}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {currentRoom && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20">
                        {currentRoom.nome.split(' ')[0]} {currentRoom.id}
                      </span>
                    )}

                    {/* CCTV Stream Trigger Button */}
                    <button
                      onClick={() => onSelectCCTV(doc.sala_atual_id || 1)}
                      className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                      title="Abrir Câmera do Consultório"
                    >
                      <Video className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Bed & Room Status (Status dos Consultórios) */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Status dos Consultórios & Leitos</span>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
              {occupiedCount}/{rooms.length} em uso
            </span>
          </div>

          {/* Quick status summary line */}
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              {occupiedCount} Em Uso
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {freeCount} Livres
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              1 Limpeza
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            {rooms.map((room) => {
              const isOccupied = room.status === 'ocupado';
              const p = patients.find((pt) => pt.id === room.patient_id);

              return (
                <div
                  key={room.id}
                  onClick={() => onSelectRoom(room.id)}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    room.is_gargalo
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500/50 hover:border-amber-500'
                      : room.tipo === 'urgencia' && isOccupied
                      ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-500/50 hover:border-rose-500'
                      : isOccupied
                      ? 'bg-white/70 dark:bg-slate-900/60 border-slate-200/80 dark:border-white/10 hover:border-blue-500/50'
                      : 'bg-white/40 dark:bg-slate-900/30 border-dashed border-slate-200 dark:border-white/10 hover:border-emerald-500/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: room.luz_cor_hex }}
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {room.nome}
                        </h4>
                        {room.is_gargalo && (
                          <span className="text-[9px] font-bold uppercase px-1 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300">
                            Gargalo
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">
                        {isOccupied
                          ? `${p?.nome || 'Paciente'} · ${room.procedimento_atual || 'Procedimento'}`
                          : 'Higienizado & Disponível'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isOccupied && (
                      <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 tabular-data">
                        {Math.floor(room.tempo_atendimento_atual / 60)}m
                      </span>
                    )}

                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </GlassPanel>
  );
};
