import React, { useState, useEffect } from 'react';
import { generateClinicalAIAnalysis, AIAnalysisResult } from '../../services/geminiService';
import { clinicStore } from '../../state/clinicStore';
import {
  Sparkles,
  X,
  AlertTriangle,
  TrendingUp,
  Users,
  Zap,
  CheckCircle2,
  RefreshCw,
  Key,
  ShieldCheck,
} from 'lucide-react';

interface GeminiAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiAIModal: React.FC<GeminiAIModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [applied, setApplied] = useState(false);
  const [customKey, setCustomKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    setApplied(false);
    try {
      const res = await generateClinicalAIAnalysis(customKey.trim() || undefined);
      setAnalysis(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runAnalysis();
    }
  }, [isOpen]);

  const handleApplyAction = () => {
    clinicStore.runReceptionAgentDispatch();
    const fatigued = clinicStore.getStaff().filter((s) => s.alerta_fadiga || s.tempo_sem_pausa_min > 240);
    fatigued.forEach((d) => clinicStore.sendDoctorToPause(d.id));

    clinicStore.logEvent(
      'triagem',
      'Agente Orquestrador',
      'Otimizações do Master AI executadas: auto-rebalanceamento de leitos e pausa de equipe concluídos.',
      'sucesso'
    );
    setApplied(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl glass-panel rounded-3xl p-6 shadow-2xl border border-violet-500/30 text-left flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/30">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Master AI · Orquestrador Neural
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                  Nível Gratuito Ativo
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-violet-300">
                Modelo: Gemini 2.5 Flash · Sem necessidade de faturamento/cartão
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-slate-500 dark:text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Tier Info Badge */}
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>Uso Gratuito Habilitado:</strong> Motor operando em modo livre de custos com modelo Flash e fallback instantâneo.
            </span>
          </div>
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="text-[10px] font-bold underline hover:text-emerald-500 shrink-0 ml-2"
          >
            {showKeyInput ? 'Ocultar Chave' : 'Inserir Chave Opcional'}
          </button>
        </div>

        {showKeyInput && (
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 flex items-center gap-2">
            <Key className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="password"
              placeholder="Cole sua GEMINI_API_KEY gratuita aqui (opcional)"
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              className="flex-1 bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              onClick={runAnalysis}
              className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold"
            >
              Aplicar
            </button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-300">
            <RefreshCw className="w-6 h-6 animate-spin text-violet-500" />
            <span className="text-xs">Sintetizando telemetria clínica com a API gratuita...</span>
          </div>
        ) : analysis ? (
          <div className="flex flex-col gap-3">
            {/* Summary */}
            <div className="p-3.5 rounded-2xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-500/30 text-xs text-violet-950 dark:text-violet-100 font-medium leading-relaxed flex items-center justify-between">
              <span>{analysis.summary}</span>
            </div>

            <div className="text-[10px] font-mono text-slate-400 px-1">
              Motor ativo: <span className="text-emerald-500 font-bold">{analysis.engineUsed}</span> · Confiabilidade: {analysis.confidenceScore}%
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-amber-200 dark:border-amber-500/20 flex flex-col gap-1.5 shadow-xs">
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-300 text-xs font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Mitigação de Gargalos</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {analysis.bottleneckAction}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-emerald-200 dark:border-emerald-500/20 flex flex-col gap-1.5 shadow-xs">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-300 text-xs font-semibold">
                  <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                  <span>Maximização de Receita</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {analysis.revenueOptimization}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-purple-200 dark:border-purple-500/20 flex flex-col gap-1.5 shadow-xs">
                <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-300 text-xs font-semibold">
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span>Ergonomia & Bem-estar</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {analysis.staffWellbeing}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-sky-200 dark:border-sky-500/20 flex flex-col gap-1.5 shadow-xs">
                <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-300 text-xs font-semibold">
                  <Zap className="w-3.5 h-3.5 shrink-0" />
                  <span>Próximo Roteamento</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {analysis.recommendedDispatch}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-white/10">
          <button
            onClick={runAnalysis}
            disabled={loading}
            className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Recalcular Cenário</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={handleApplyAction}
              disabled={applied || loading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-lg shadow-violet-600/30 flex items-center gap-1.5 transition-all"
            >
              {applied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Ações Aplicadas!</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Executar Otimização</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
