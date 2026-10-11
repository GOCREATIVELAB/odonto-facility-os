import React, { useState } from 'react';
import { clinicStore } from '../../state/clinicStore';
import { Specialty } from '../../types/clinic';
import { GlassPanel } from './GlassPanel';
import { UserPlus, Sparkles, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';

export const TriageForm: React.FC = () => {
  const [nome, setNome] = useState('');
  const [especialidade, setEspecialidade] = useState<Specialty>('geral');
  const [isUrgente, setIsUrgente] = useState(false);
  const [procedimento, setProcedimento] = useState('Consulta Clínica & Profilaxia');
  const [valor, setValor] = useState(480);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    clinicStore.addPatient(
      nome.trim(),
      especialidade,
      procedimento,
      isUrgente ? 'urgente' : 'normal',
      Number(valor) || 450
    );

    setFeedback(`Paciente ${nome.trim()} cadastrado! IA iniciando roteamento 3D.`);
    setNome('');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSpecSelect = (spec: Specialty) => {
    setEspecialidade(spec);
    if (spec === 'urgencia') {
      setIsUrgente(true);
      setProcedimento('Dor Aguda / Exodontia Emergencial');
      setValor(1250);
    } else if (spec === 'orto') {
      setIsUrgente(false);
      setProcedimento('Manutenção & Colagem de Braquetes');
      setValor(580);
    } else {
      setIsUrgente(false);
      setProcedimento('Consulta Clínica & Profilaxia');
      setValor(480);
    }
  };

  return (
    <GlassPanel
      className="h-full"
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-semibold tracking-tight text-white">
              Triagem Rápida & Admissão
            </h2>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Check-in Inteligente
          </span>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
        {/* Name input */}
        <div>
          <label className="text-[11px] font-medium text-slate-300 mb-1 block">
            Nome Completo do Paciente
          </label>
          <input
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Amanda Vasconcelos"
            className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Specialty Selection */}
        <div>
          <label className="text-[11px] font-medium text-slate-300 mb-1 block">
            Especialidade Requisitada
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleSpecSelect('geral')}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition-all ${
                especialidade === 'geral'
                  ? 'bg-blue-600/30 border-blue-500 text-blue-200'
                  : 'bg-slate-900/50 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Clínico Geral
            </button>
            <button
              type="button"
              onClick={() => handleSpecSelect('urgencia')}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition-all ${
                especialidade === 'urgencia'
                  ? 'bg-rose-600/30 border-rose-500 text-rose-200'
                  : 'bg-slate-900/50 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Urgência
            </button>
            <button
              type="button"
              onClick={() => handleSpecSelect('orto')}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition-all ${
                especialidade === 'orto'
                  ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                  : 'bg-slate-900/50 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Ortodontia
            </button>
          </div>
        </div>

        {/* Urgency Toggle */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/50 border border-white/5">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-3.5 h-3.5 ${isUrgente ? 'text-rose-400' : 'text-slate-500'}`} />
            <span className="text-xs text-slate-300 font-medium">Prioridade Alta / Trauma</span>
          </div>
          <button
            type="button"
            onClick={() => setIsUrgente(!isUrgente)}
            className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
              isUrgente ? 'bg-rose-600' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                isUrgente ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Procedure & Cost */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-medium text-slate-300 mb-1 block">
              Procedimento
            </label>
            <input
              type="text"
              value={procedimento}
              onChange={(e) => setProcedimento(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950/70 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-300 mb-1 block">
              Valor Estimado (R$)
            </label>
            <input
              type="number"
              value={valor}
              onChange={(e) => setValor(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950/70 border border-white/10 text-white text-xs tabular-data focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {feedback && (
          <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        <button
          type="submit"
          className="mt-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-200" />
          <span>Cadastrar & Rotear via IA</span>
        </button>
      </form>
    </GlassPanel>
  );
};
