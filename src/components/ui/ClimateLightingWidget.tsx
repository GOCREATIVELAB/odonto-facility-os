import React, { useState } from 'react';
import { clinicStore } from '../../state/clinicStore';
import { Sun, Thermometer, Sliders, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export const ClimateLightingWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [preset, setPreset] = useState<'normal' | 'cirurgia' | 'relax'>('normal');
  const [globalTemp, setGlobalTemp] = useState(22);
  const [globalLux, setGlobalLux] = useState(480);

  const applyPreset = (mode: 'normal' | 'cirurgia' | 'relax') => {
    setPreset(mode);
    const rooms = clinicStore.getRooms();
    if (mode === 'cirurgia') {
      setGlobalTemp(20);
      setGlobalLux(680);
      rooms.forEach((r) => clinicStore.updateRoomClimate(r.id, 20, 680));
    } else if (mode === 'relax') {
      setGlobalTemp(23.5);
      setGlobalLux(320);
      rooms.forEach((r) => clinicStore.updateRoomClimate(r.id, 23.5, 320));
    } else {
      setGlobalTemp(22);
      setGlobalLux(480);
      rooms.forEach((r) => clinicStore.updateRoomClimate(r.id, 22, 480));
    }
  };

  const handleTempChange = (temp: number) => {
    setGlobalTemp(temp);
    clinicStore.getRooms().forEach((r) => clinicStore.updateRoomClimate(r.id, temp, globalLux));
  };

  const handleLuxChange = (lux: number) => {
    setGlobalLux(lux);
    clinicStore.getRooms().forEach((r) => clinicStore.updateRoomClimate(r.id, globalTemp, lux));
  };

  return (
    <div className="fixed bottom-4 right-5 z-30 pointer-events-auto flex flex-col items-end">
      {isOpen ? (
        <div className="w-72 glass-panel rounded-2xl p-4 shadow-2xl border border-white/15 animate-in slide-in-from-bottom-3 duration-200 text-left flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <h3 className="text-xs font-semibold text-white">
                Controle de Clima & Iluminação IoT
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Scenario Presets */}
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mb-1">
              Cenários Clínicos
            </span>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => applyPreset('normal')}
                className={`py-1 px-1.5 rounded-lg text-[10px] font-medium transition-all ${
                  preset === 'normal'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                Padrão
              </button>
              <button
                onClick={() => applyPreset('cirurgia')}
                className={`py-1 px-1.5 rounded-lg text-[10px] font-medium transition-all ${
                  preset === 'cirurgia'
                    ? 'bg-rose-600 text-white shadow'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                Cirúrgico
              </button>
              <button
                onClick={() => applyPreset('relax')}
                className={`py-1 px-1.5 rounded-lg text-[10px] font-medium transition-all ${
                  preset === 'relax'
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                Espera / Relax
              </button>
            </div>
          </div>

          {/* Temp Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span className="flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-blue-400" />
                Temperatura
              </span>
              <span className="font-semibold tabular-data text-white">{globalTemp}°C</span>
            </div>
            <input
              type="range"
              min="18"
              max="26"
              step="0.5"
              value={globalTemp}
              onChange={(e) => handleTempChange(Number(e.target.value))}
              className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Lux Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span className="flex items-center gap-1">
                <Sun className="w-3 h-3 text-amber-400" />
                Luminosidade
              </span>
              <span className="font-semibold tabular-data text-white">{globalLux} Lux</span>
            </div>
            <input
              type="range"
              min="200"
              max="800"
              step="20"
              value={globalLux}
              onChange={(e) => handleLuxChange(Number(e.target.value))}
              className="w-full accent-amber-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="glass-panel rounded-2xl px-3.5 py-2 flex items-center gap-2 text-xs font-medium text-slate-200 hover:text-white shadow-xl hover:border-white/25 transition-all"
        >
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>{globalLux} Lux · {globalTemp}°C</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </button>
      )}
    </div>
  );
};
