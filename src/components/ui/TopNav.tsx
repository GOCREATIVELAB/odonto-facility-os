import React, { useEffect, useState } from 'react';
import {
  Activity,
  Layers,
  Building,
  Home,
  SlidersHorizontal,
  Search,
  Bell,
  Sun,
  Moon,
  Play,
  Pause,
  Sparkles,
  BarChart3,
  Users,
  DoorOpen,
  UserPlus,
  Flame,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { clinicStore } from '../../state/clinicStore';
import { ActiveTab, CameraPreset, ThemeMode } from '../../types/clinic';

interface TopNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  cameraPreset: CameraPreset;
  onCameraPresetChange: (preset: CameraPreset) => void;
  onOpenGeminiAI: () => void;
  onSearchClick?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onTabChange,
  cameraPreset,
  onCameraPresetChange,
  onOpenGeminiAI,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [theme, setTheme] = useState<ThemeMode>(clinicStore.getTheme());
  const [isSimRunning, setIsSimRunning] = useState(clinicStore.isSimulationActive());
  const [simSpeed, setSimSpeed] = useState(clinicStore.getSimulationSpeed());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsub = clinicStore.subscribe(() => {
      setTheme(clinicStore.getTheme());
      setIsSimRunning(clinicStore.isSimulationActive());
      setSimSpeed(clinicStore.getSimulationSpeed());
    });
    return () => unsub();
  }, []);

  const handleToggleTheme = () => {
    clinicStore.toggleTheme();
  };

  const handleToggleSim = () => {
    clinicStore.toggleSimulation();
  };

  const handleSpeedChange = (speed: number) => {
    clinicStore.setSimulationSpeed(speed);
  };

  const handleQuickPatient = () => {
    clinicStore.autoGeneratePatient();
  };

  const handleEmergencyTrigger = () => {
    clinicStore.addPatient(
      'Mariana Castello',
      'urgencia',
      'Trauma Oclusal com Hemorragia Aguda',
      'urgente',
      1890
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none p-3 px-5 flex items-center justify-between gap-3">
      {/* Brand & Left Navigation */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="flex items-center gap-2.5 glass-panel rounded-2xl px-3.5 py-2">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md shadow-blue-600/30">
            <Activity className="w-4 h-4 text-white" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-white animate-pulse" />
          </div>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs font-bold tracking-tight text-slate-900 dark:text-white">
                Odonto Facility OS
              </h1>
              <span className="text-[9px] font-bold uppercase px-1 rounded bg-blue-500/20 text-blue-600 dark:text-blue-300">
                Control
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
              <span className="tabular-data font-mono">{timeStr}</span>
              <span>·</span>
              <span className="text-emerald-500 font-semibold">9ms Realtime</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Overview, Societário, RH, Recepção) */}
        <nav className="glass-panel rounded-2xl p-1 flex items-center gap-1 shadow-lg">
          <button
            onClick={() => onTabChange('clinica')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'clinica'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Visão Clínica</span>
          </button>

          <button
            onClick={() => onTabChange('societario')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'societario'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Quadro Societário</span>
          </button>

          <button
            onClick={() => onTabChange('rh')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'rh'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>RH & Equipe</span>
          </button>

          <button
            onClick={() => onTabChange('recepcao')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'recepcao'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <DoorOpen className="w-3.5 h-3.5" />
            <span>Recepção & Triagem</span>
          </button>
        </nav>
      </div>

      {/* Center Floating Pill: Camera Presets (Matching Video: Campus | Tower | Floor | Ward) */}
      <div className="glass-panel rounded-2xl p-1 flex items-center gap-1 pointer-events-auto shadow-xl">
        <button
          onClick={() => onCameraPresetChange('campus')}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
            cameraPreset === 'campus'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Campus
        </button>

        <button
          onClick={() => onCameraPresetChange('torre')}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
            cameraPreset === 'torre'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Torre
        </button>

        <button
          onClick={() => onCameraPresetChange('andar')}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
            cameraPreset === 'andar'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Andar (3D)
        </button>

        <button
          onClick={() => onCameraPresetChange('consultorios')}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
            cameraPreset === 'consultorios'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Consultórios
        </button>
      </div>

      {/* Right Section: Search, Bell, Simulation Controls, Theme, Profile */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Quick Search */}
        <div className="hidden lg:flex items-center gap-2 glass-panel rounded-2xl px-3 py-1.5 w-48 focus-within:w-60 transition-all">
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Buscar paciente, sala..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* Simulation Controls */}
        <div className="glass-panel rounded-2xl p-1 flex items-center gap-1">
          <button
            onClick={handleToggleSim}
            className={`p-1.5 rounded-xl transition-all ${
              isSimRunning
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300'
                : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300'
            }`}
            title={isSimRunning ? 'Pausar Simulação' : 'Retomar Simulação'}
          >
            {isSimRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center border-l border-slate-200 dark:border-white/10 pl-1">
            {[1, 2, 5].map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`px-1.5 py-0.5 text-[10px] rounded-lg font-bold transition-all ${
                  simSpeed === speed
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          <button
            onClick={handleQuickPatient}
            className="flex items-center gap-1 px-2 py-1 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-[11px] text-slate-700 dark:text-slate-200 transition-all"
            title="Novo Paciente na Recepção"
          >
            <UserPlus className="w-3 h-3 text-sky-500" />
            <span className="hidden xl:inline">+Paciente</span>
          </button>

          <button
            onClick={handleEmergencyTrigger}
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-300 text-[11px] font-semibold transition-all"
            title="Simular Entrada de Urgência"
          >
            <Flame className="w-3 h-3 text-rose-500" />
            <span className="hidden xl:inline">Urgência</span>
          </button>
        </div>

        {/* Master AI Gemini Button */}
        <button
          onClick={onOpenGeminiAI}
          className="glass-panel rounded-2xl px-3 py-2 flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-violet-600/20 to-blue-600/20 hover:from-violet-600/30 hover:to-blue-600/30 text-violet-700 dark:text-violet-200 border border-violet-500/40 shadow-lg shadow-violet-500/15 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Master AI</span>
        </button>

        {/* Theme Mode Toggle (Light Clinical / Dark Ops) */}
        <button
          onClick={handleToggleTheme}
          className="glass-panel rounded-2xl p-2 hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-all"
          title={theme === 'light' ? 'Modo Escuro (Controle Noturno)' : 'Modo Claro (Clínico)'}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Notification Bell */}
        <div className="relative glass-panel rounded-2xl p-2 text-slate-700 dark:text-slate-300">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        </div>

        {/* User Profile (Dra. Sarah Lin · Diretora Clínica) */}
        <div className="flex items-center gap-2 glass-panel rounded-2xl px-2.5 py-1.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
            SL
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
              Dra. Sarah Lin
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              Diretora Clínica
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
