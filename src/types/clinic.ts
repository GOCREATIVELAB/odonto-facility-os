export type Specialty = 'geral' | 'urgencia' | 'orto' | 'cirurgia';
export type RoomType = 'geral' | 'urgencia' | 'orto' | 'cirurgia' | 'triagem';
export type PatientStatus = 'aguardando' | 'em_transito' | 'atendimento' | 'concluido';
export type StaffStatus = 'atendimento' | 'livre' | 'pausa' | 'fim_turno';
export type ActiveTab = 'clinica' | 'societario' | 'rh' | 'recepcao';
export type CameraPreset = 'campus' | 'torre' | 'andar' | 'consultorios';
export type WardScenario = 'normal' | 'emergencia' | 'noturno' | 'esterilizacao';
export type ThemeMode = 'light' | 'dark';

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface Patient {
  id: string;
  nome: string;
  iniciais: string;
  avatar_url?: string;
  especialidade_requisitada: Specialty;
  status: PatientStatus;
  tempo_espera: number; // in seconds
  tempo_espera_max: number; // e.g. 900s
  coordenada_atual_3D: Position3D;
  target_room_id?: number | null;
  procedimento?: string;
  valor_estimado?: number;
  prioridade?: 'normal' | 'urgente';
  entrada_timestamp: number;
}

export interface Room {
  id: number;
  nome: string;
  tipo: RoomType;
  status: 'livre' | 'ocupado' | 'higienizacao' | 'manutencao';
  patient_id?: string | null;
  medico_id?: string | null;
  procedimento_atual?: string;
  tempo_atendimento_atual: number; // seconds
  timer_limite: number; // seconds
  is_gargalo: boolean;
  luz_ativa: boolean;
  luz_cor_hex: string;
  luz_intensidade: number; // 0 to 1
  luz_kelvin: number; // 3000 to 6500
  temperatura: number; // Celsius
  iluminacao_lux: number;
  coords_centro: Position3D;
  cctv_ativa: boolean;
}

export interface StaffMember {
  id: string;
  nome: string;
  cargo: string;
  crm_cro: string;
  especialidade: Specialty;
  status: StaffStatus;
  sala_atual_id?: number | null;
  tempo_turno_min: number;
  tempo_sem_pausa_min: number;
  prontuarios_pendentes: number;
  alerta_fadiga: boolean;
  foto_iniciais: string;
  avatar_color: string;
}

export interface FinancialKPIs {
  caixa_diario: number;
  ticket_medio: number;
  ocupacao_atual: number; // percentage 0-100
  conversao_avaliacoes: number;
  consultas_concluidas: number;
  planos_fechados: number;
  sparkline_faturamento: number[];
  sparkline_ocupacao: number[];
}

export interface ClinicEvent {
  id: string;
  timestamp: string;
  tipo: 'triagem' | 'movimento' | 'gargalo' | 'rh' | 'financeiro' | 'alerta' | 'cenario';
  origem: 'Agente Orquestrador' | 'Agente Recepção' | 'Agente RH' | 'Agente Societário' | 'Sistema';
  mensagem: string;
  nivel: 'info' | 'alerta' | 'sucesso' | 'urgente';
  metadata?: {
    roomId?: number;
    patientId?: string;
    valor?: number;
  };
}

export interface ClimateIoTState {
  temperatura_alvo: number;
  temperatura_atual: number;
  umidade_relativa: number;
  qualidade_ar_aqi: number;
  fluxo_ar_cfm: number;
  modo_auto: boolean;
  cenario_ativo: WardScenario;
}
