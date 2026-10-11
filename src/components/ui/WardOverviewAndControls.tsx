import React, { useEffect, useState } from 'react';
import { clinicStore } from '../../state/clinicStore';
import { ClimateIoTState, Room, WardScenario } from '../../types/clinic';
import { GlassPanel } from './GlassPanel';
import {
  Sliders,
  Sun,
  Thermometer,
  Wind,
  ShieldCheck,
  CheckCircle2,
  Power,
  Flame,
  Moon,
  Sparkles,
  Droplets,
  Activity,
} from 'lucide-react';

export const WardOverviewAndControls: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(clinicStore.getRooms());
  const [climate, setClimate] = useState<ClimateIoTState>(clinicStore.getClimate());

  useEffect(() => {
    const unsub = clinicStore.subscribe(() => {
      setRooms([...clinicStore.getRooms()]);
      setClimate({ ...clinicStore.getClimate() });
    });
    return () => unsub();
  }, []);

  const handleScenario = (scenario: WardScenario) => {
    clinicStore.applyScenario(scenario);
  };

  const handleToggleLight = (roomId: number) => {
    clinicStore.toggleRoomLight(roomId);
  };

  const handleLuxSlider = (roomId: number, lux: number) => {
    clinicStore.setRoomLux(roomId, lux);
  };

  const handleTempAdjust = (delta: number) => {
    clinicStore.setTargetTemperature(climate.temperatura_alvo + delta);
  };

  return (
    <GlassPanel
      className="h-full"
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              Visão da Unidade & Automação IoT (Ward Overview)
            </h2>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
            Online
          </span>
        </div>
      }
    >
      <div className="flex flex-col gap-4 text-left">
        {/* Section 1: Ward Scenarios (Matching Video) */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Cenários Operacionais
          </span>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => handleScenario('normal')}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
                climate.cenario_ativo === 'normal'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                  : 'bg-white/70 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-blue-500'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Normal Ops</span>
            </button>

            <button
              onClick={() => handleScenario('emergencia')}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
                climate.cenario_ativo === 'emergencia'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20'
                  : 'bg-white/70 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-rose-500'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Plantão Cirúrgico</span>
            </button>

            <button
              onClick={() => handleScenario('noturno')}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
                climate.cenario_ativo === 'noturno'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                  : 'bg-white/70 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-indigo-500'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Modo Noturno</span>
            </button>

            <button
              onClick={() => handleScenario('esterilizacao')}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
                climate.cenario_ativo === 'esterilizacao'
                  ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20'
                  : 'bg-white/70 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-sky-500'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Esterilização UV</span>
            </button>
          </div>
        </div>

        {/* Section 2: Lighting Controls (Matching Video) */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              Iluminação das Salas (Lighting)
            </span>
            <span className="text-[10px] text-slate-400">4000K - 6500K</span>
          </div>

          <div className="flex flex-col gap-2">
            {rooms.map((room) => {
              const luxPercent = Math.round((room.iluminacao_lux / 750) * 100);

              return (
                <div
                  key={room.id}
                  className="p-2.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: room.luz_cor_hex }}
                      />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {room.nome}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 tabular-data">
                        {room.iluminacao_lux} Lux ({luxPercent}%)
                      </span>

                      {/* Power toggle */}
                      <button
                        onClick={() => handleToggleLight(room.id)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                          room.luz_ativa
                            ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                        }`}
                        title="Ligar/Desligar Iluminação"
                      >
                        <Power className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Lux Slider */}
                  <input
                    type="range"
                    min="150"
                    max="750"
                    step="10"
                    value={room.iluminacao_lux}
                    onChange={(e) => handleLuxSlider(room.id, Number(e.target.value))}
                    className="w-full accent-blue-600 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Climate Control & IoT Telemetry (Matching Video) */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-blue-500" />
              Climatização & Qualidade do Ar (Climate)
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              HEPA Nível H14
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 flex flex-col gap-3">
            {/* Thermostat target with +/- buttons */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Temperatura Alvo
                </span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-data font-mono mt-0.5">
                  {climate.temperatura_alvo.toFixed(1)}°C
                </span>
                <span className="text-[10px] text-slate-500">
                  Atual: {climate.temperatura_atual.toFixed(1)}°C
                </span>
              </div>

              {/* Adjust buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleTempAdjust(-0.5)}
                  className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-sm flex items-center justify-center transition-colors shadow-xs"
                >
                  -
                </button>
                <button
                  onClick={() => handleTempAdjust(0.5)}
                  className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-sm flex items-center justify-center transition-colors shadow-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* IoT Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-white/10 text-center">
              {/* Humidity */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Droplets className="w-3 h-3 text-sky-500" />
                  <span>Umidade</span>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white tabular-data mt-0.5">
                  {climate.umidade_relativa}%
                </span>
              </div>

              {/* AQI */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  <span>Ar AQI</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-data mt-0.5">
                  {climate.qualidade_ar_aqi} (Ótimo)
                </span>
              </div>

              {/* Airflow */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Wind className="w-3 h-3 text-indigo-500" />
                  <span>Vazão</span>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white tabular-data mt-0.5">
                  {climate.fluxo_ar_cfm} CFM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
};
