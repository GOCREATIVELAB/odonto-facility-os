import React, { useEffect, useState } from 'react';
import { clinicStore } from '../../state/clinicStore';
import { Patient, Room } from '../../types/clinic';
import { Clock, AlertTriangle, Sparkles, User } from 'lucide-react';

interface LiveAvatarOverlayProps {
  onSelectRoom: (roomId: number) => void;
  selectedRoomId: number | null;
}

export const LiveAvatarOverlay: React.FC<LiveAvatarOverlayProps> = ({
  onSelectRoom,
  selectedRoomId,
}) => {
  const [patients, setPatients] = useState<Patient[]>(clinicStore.getPatients());
  const [rooms, setRooms] = useState<Room[]>(clinicStore.getRooms());
  const [hoveredPatientId, setHoveredPatientId] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      setPatients([...clinicStore.getPatients()]);
      setRooms([...clinicStore.getRooms()]);
    };
    const unsub = clinicStore.subscribe(update);
    return () => unsub();
  }, []);

  // Convert 3D clinical coordinates [x, y, z] to isometric 2D screen percentage
  // Isometric projection formula:
  // screenX = 50% + (x - z) * scaleX
  // screenY = 50% + (x + z) * scaleY - y * scaleHeight
  const getScreenPos = (pos: { x: number; y: number; z: number }) => {
    const scale = 3.65;
    const xOffset = (pos.x - pos.z) * scale;
    const yOffset = (pos.x + pos.z) * (scale * 0.58) - pos.y * 3.0;

    return {
      left: `calc(50% + ${xOffset}vw)`,
      top: `calc(47% + ${yOffset}vh)`,
    };
  };

  // Helper for SVG Ring color based on wait time / progress
  const getProgressColor = (patient: Patient) => {
    if (patient.prioridade === 'urgente') return '#ef4444'; // Red
    const ratio = patient.tempo_espera / (patient.tempo_espera_max || 900);
    if (ratio < 0.4) return '#22c55e'; // Green
    if (ratio < 0.8) return '#eab308'; // Yellow
    return '#f97316'; // Orange / Red
  };

  const getStrokeDashoffset = (patient: Patient) => {
    const radius = 17;
    const circumference = 2 * Math.PI * radius;
    const ratio = Math.min(1, patient.tempo_espera / (patient.tempo_espera_max || 900));
    return circumference * (1 - ratio);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Render Room Floating Indicators */}
      {rooms.map((room) => {
        const screenPos = getScreenPos(room.coords_centro);
        const isOccupied = room.status === 'ocupado';
        const isSelected = selectedRoomId === room.id;

        return (
          <div
            key={`room-tag-${room.id}`}
            style={{ left: screenPos.left, top: screenPos.top }}
            className={`absolute -translate-x-1/2 -translate-y-24 transition-transform duration-300 pointer-events-auto ${
              isSelected ? 'scale-110 z-30' : 'hover:scale-105 z-20'
            }`}
          >
            <button
              onClick={() => onSelectRoom(room.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-tight backdrop-blur-md shadow-lg transition-all border ${
                room.is_gargalo
                  ? 'bg-amber-950/80 border-amber-500/70 text-amber-200 shadow-amber-500/20 animate-pulse'
                  : room.tipo === 'urgencia' && isOccupied
                  ? 'bg-rose-950/80 border-rose-500/70 text-rose-200 shadow-rose-500/20'
                  : isOccupied
                  ? 'bg-sky-950/80 border-sky-500/60 text-sky-200 shadow-sky-500/20'
                  : 'bg-slate-900/75 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: room.luz_cor_hex }}
              />
              <span>{room.nome.split('·')[0]}</span>
              {room.is_gargalo && (
                <span className="text-[9px] bg-amber-500/30 text-amber-300 px-1 rounded uppercase tracking-wider font-bold">
                  Gargalo
                </span>
              )}
            </button>
          </div>
        );
      })}

      {/* Render Patient Avatars with Dynamic Rings */}
      {patients.map((patient) => {
        const screenPos = getScreenPos(patient.coordenada_atual_3D);
        const ringColor = getProgressColor(patient);
        const isHovered = hoveredPatientId === patient.id;
        const circumference = 2 * Math.PI * 17;

        return (
          <div
            key={patient.id}
            style={{ left: screenPos.left, top: screenPos.top }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer transition-all duration-700 z-20 group"
            onMouseEnter={() => setHoveredPatientId(patient.id)}
            onMouseLeave={() => setHoveredPatientId(null)}
            onClick={() => {
              if (patient.target_room_id) {
                onSelectRoom(patient.target_room_id);
              }
            }}
          >
            {/* 3D Drop Shadow on Floor */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-8 h-3 bg-black/60 rounded-full blur-[3px] pointer-events-none" />

            {/* Glowing outer pulse for urgent patients */}
            {patient.prioridade === 'urgente' && (
              <div className="absolute -inset-1 rounded-full bg-rose-500/30 blur-sm animate-pulse" />
            )}

            {/* Avatar Pill & SVG Countdown Ring */}
            <div className="relative w-10 h-10 rounded-full flex items-center justify-center bg-[#131722]/90 border border-white/20 shadow-xl backdrop-blur-md transition-transform group-hover:scale-110">
              <svg className="absolute inset-0 w-10 h-10 -rotate-90 pointer-events-none">
                <circle
                  cx="20"
                  cy="20"
                  r="17"
                  className="stroke-slate-800/80 fill-none"
                  strokeWidth="2.5"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="17"
                  className="fill-none transition-all duration-1000"
                  stroke={ringColor}
                  strokeWidth="2.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={getStrokeDashoffset(patient)}
                  strokeLinecap="round"
                />
              </svg>

              <span className="text-xs font-bold text-white tracking-wider z-10">
                {patient.iniciais}
              </span>

              {/* Status Mini Dot */}
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#131722] flex items-center justify-center text-[8px] font-bold ${
                  patient.status === 'atendimento'
                    ? 'bg-sky-500'
                    : patient.status === 'em_transito'
                    ? 'bg-amber-400 animate-bounce'
                    : 'bg-emerald-500'
                }`}
              />
            </div>

            {/* Floating Details Tooltip on Hover */}
            {isHovered && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-12 w-48 p-2.5 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl text-left z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-semibold text-xs text-white truncate">
                    {patient.nome}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold ${
                      patient.prioridade === 'urgente'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-sky-500/20 text-sky-300'
                    }`}
                  >
                    {patient.prioridade === 'urgente' ? 'Urgência' : patient.especialidade_requisitada}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-tight mb-1.5 truncate">
                  {patient.procedimento}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800 pt-1">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>
                      {Math.floor(patient.tempo_espera / 60)}m {patient.tempo_espera % 60}s
                    </span>
                  </div>
                  <span className="text-emerald-400 font-semibold tabular-data">
                    R$ {patient.valor_estimado || 450}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
