import React, { useState, useEffect } from 'react';
import { clinicStore } from '../../state/clinicStore';
import { Room } from '../../types/clinic';
import { X, Video, Camera, Maximize2, Shield, Radio, Sparkles } from 'lucide-react';

interface CCTVStreamModalProps {
  roomId: number | null;
  onClose: () => void;
}

export const CCTVStreamModal: React.FC<CCTVStreamModalProps> = ({ roomId, onClose }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [angle, setAngle] = useState<'geral' | 'cadeira' | 'entrada'>('geral');
  const [timecode, setTimecode] = useState('');

  useEffect(() => {
    if (!roomId) {
      setRoom(null);
      return;
    }
    const r = clinicStore.getRoomById(roomId);
    setRoom(r ? { ...r } : null);
  }, [roomId]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimecode(
        now.toISOString().split('T')[1].slice(0, 11) + ' · CH-0' + (roomId || 1)
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, [roomId]);

  if (!roomId || !room) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl glass-panel rounded-3xl p-5 shadow-2xl border border-white/20 text-left flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300">
              <Video className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  CCTV Live Telemetria · {room.nome}
                </h3>
                <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  REC AO VIVO
                </span>
              </div>
              <span className="text-[11px] text-slate-400 tabular-data font-mono">
                {timecode} · 1080p 60FPS · Stream H.265 AES-256
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Simulation */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shadow-inner flex items-center justify-center">
          {/* Subtle grid and surveillance lines */}
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />

          {/* Realistic Camera Simulation Visual */}
          <div className="flex flex-col items-center justify-center gap-2 z-10 text-center px-4">
            <div className="relative w-28 h-28 rounded-2xl border-2 border-dashed border-sky-400/50 p-2 flex flex-col items-center justify-center bg-sky-950/20 backdrop-blur-xs">
              <span className="text-[10px] font-mono text-sky-300 uppercase tracking-widest absolute -top-3 bg-sky-950 px-1.5 rounded border border-sky-500/40">
                AI Tracking Box
              </span>
              <div className="w-12 h-12 rounded-full border border-sky-400/60 flex items-center justify-center text-sky-200 font-bold text-xs animate-pulse">
                {room.patient_id ? 'PACIENTE' : 'LEITO LIVRE'}
              </div>
              <span className="text-[9px] text-sky-300 font-mono mt-1">
                Confiabilidade: 99.4%
              </span>
            </div>

            <p className="text-xs text-slate-300 max-w-md">
              {room.procedimento_atual
                ? `Procedimento em andamento: ${room.procedimento_atual}`
                : 'Consultório livre e esterilizado. Monitoramento passivo ativo.'}
            </p>
          </div>

          {/* Overlaid Telemetry HUD */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 font-mono text-[10px] text-emerald-400">
            <span>ISO: 400 · f/1.8 · 1/120s</span>
            <span>TEMP SALA: {room.temperatura.toFixed(1)}°C</span>
            <span>LUX: {room.iluminacao_lux} LUX</span>
            <span>STATUS: {room.status.toUpperCase()}</span>
          </div>

          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 font-mono text-[10px] text-slate-300 bg-black/60 px-2 py-1 rounded border border-white/10">
            <Radio className="w-3 h-3 text-rose-500 animate-pulse" />
            <span>ENCRYPTED STREAM</span>
          </div>

          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
            <div className="flex items-center gap-1 bg-black/70 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setAngle('geral')}
                className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                  angle === 'geral' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Visão Ampla
              </button>
              <button
                onClick={() => setAngle('cadeira')}
                className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                  angle === 'cadeira' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Cadeira & Paciente
              </button>
              <button
                onClick={() => setAngle('entrada')}
                className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                  angle === 'entrada' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Acesso / Bancada
              </button>
            </div>
          </div>
        </div>

        {/* Footer info & Actions */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-sky-400" />
            <span>Gravação em conformidade com LGPD / HIPAA Clínico</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
          >
            Fechar Visualizador
          </button>
        </div>
      </div>
    </div>
  );
};
