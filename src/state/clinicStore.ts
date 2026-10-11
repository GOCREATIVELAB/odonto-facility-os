import {
  ClinicEvent,
  ClimateIoTState,
  FinancialKPIs,
  Patient,
  Room,
  Specialty,
  StaffMember,
  ThemeMode,
  WardScenario,
} from '../types/clinic';

export const INITIAL_ROOMS: Room[] = [
  {
    id: 1,
    nome: 'Consultório 01 (Geral)',
    tipo: 'geral',
    status: 'ocupado',
    patient_id: 'p-101',
    medico_id: 'doc-01',
    procedimento_atual: 'Restauração Estética & Profilaxia',
    tempo_atendimento_atual: 740,
    timer_limite: 1800,
    is_gargalo: false,
    luz_ativa: true,
    luz_cor_hex: '#007AFF', // Blue IOS
    luz_intensidade: 0.85,
    luz_kelvin: 4500,
    temperatura: 22.0,
    iluminacao_lux: 480,
    coords_centro: { x: -4.5, y: 0, z: -2.8 },
    cctv_ativa: true,
  },
  {
    id: 2,
    nome: 'Consultório 02 (Geral)',
    tipo: 'geral',
    status: 'livre',
    patient_id: null,
    medico_id: 'doc-02',
    procedimento_atual: undefined,
    tempo_atendimento_atual: 0,
    timer_limite: 1800,
    is_gargalo: false,
    luz_ativa: true,
    luz_cor_hex: '#FFFFFF', // Neutral empty
    luz_intensidade: 0.35,
    luz_kelvin: 4000,
    temperatura: 22.5,
    iluminacao_lux: 320,
    coords_centro: { x: 0, y: 0, z: -2.8 },
    cctv_ativa: true,
  },
  {
    id: 3,
    nome: 'Consultório 03 (Endodontia)',
    tipo: 'geral',
    status: 'ocupado',
    patient_id: 'p-102',
    medico_id: 'doc-03',
    procedimento_atual: 'Tratamento Endodôntico Molar',
    tempo_atendimento_atual: 2250, // Exceeded limit -> bottleneck!
    timer_limite: 1800,
    is_gargalo: true,
    luz_ativa: true,
    luz_cor_hex: '#FF9500', // Orange bottleneck
    luz_intensidade: 1.25,
    luz_kelvin: 5000,
    temperatura: 21.8,
    iluminacao_lux: 540,
    coords_centro: { x: 4.5, y: 0, z: -2.8 },
    cctv_ativa: true,
  },
  {
    id: 4,
    nome: 'Consultório 04 (Cirurgia & Trauma)',
    tipo: 'urgencia',
    status: 'ocupado',
    patient_id: 'p-103',
    medico_id: 'doc-04',
    procedimento_atual: 'Exodontia & Sutura Cirúrgica',
    tempo_atendimento_atual: 980,
    timer_limite: 2400,
    is_gargalo: false,
    luz_ativa: true,
    luz_cor_hex: '#FF3B30', // Urgent red
    luz_intensidade: 1.15,
    luz_kelvin: 6500, // Daylight surgical
    temperatura: 20.0,
    iluminacao_lux: 680,
    coords_centro: { x: -4.5, y: 0, z: 3.2 },
    cctv_ativa: true,
  },
  {
    id: 5,
    nome: 'Consultório 05 (Ortodontia)',
    tipo: 'orto',
    status: 'ocupado',
    patient_id: 'p-104',
    medico_id: 'doc-05',
    procedimento_atual: 'Manutenção Alinhador Invisível',
    tempo_atendimento_atual: 450,
    timer_limite: 900,
    is_gargalo: false,
    luz_ativa: true,
    luz_cor_hex: '#AF52DE', // Purple ortho
    luz_intensidade: 0.85,
    luz_kelvin: 4200,
    temperatura: 22.2,
    iluminacao_lux: 440,
    coords_centro: { x: 4.5, y: 0, z: 3.2 },
    cctv_ativa: true,
  },
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'doc-01',
    nome: 'Dra. Sarah Lin',
    cargo: 'Diretora Clínica & Chefe de Atendimento',
    crm_cro: 'CRO-SP 114.920',
    especialidade: 'geral',
    status: 'atendimento',
    sala_atual_id: 1,
    tempo_turno_min: 215,
    tempo_sem_pausa_min: 140,
    prontuarios_pendentes: 1,
    alerta_fadiga: false,
    foto_iniciais: 'SL',
    avatar_color: '#3b82f6',
  },
  {
    id: 'doc-04',
    nome: 'Dr. Marcus Rodriguez',
    cargo: 'Líder Cirúrgico & Traumatologista',
    crm_cro: 'CRO-SP 142.308',
    especialidade: 'urgencia',
    status: 'atendimento',
    sala_atual_id: 4,
    tempo_turno_min: 210,
    tempo_sem_pausa_min: 190,
    prontuarios_pendentes: 0,
    alerta_fadiga: false,
    foto_iniciais: 'MR',
    avatar_color: '#ef4444',
  },
  {
    id: 'doc-02',
    nome: 'Dra. Caroline Tsao',
    cargo: 'Líder de Enfermagem & Suporte Clínico',
    crm_cro: 'COREN-SP 89.214',
    especialidade: 'geral',
    status: 'livre',
    sala_atual_id: 2,
    tempo_turno_min: 95,
    tempo_sem_pausa_min: 40,
    prontuarios_pendentes: 0,
    alerta_fadiga: false,
    foto_iniciais: 'CT',
    avatar_color: '#10b981',
  },
  {
    id: 'doc-03',
    nome: 'Dr. Renato Albuquerque',
    cargo: 'Especialista em Endodontia Microscópica',
    crm_cro: 'CRO-SP 98.712',
    especialidade: 'geral',
    status: 'atendimento',
    sala_atual_id: 3,
    tempo_turno_min: 285,
    tempo_sem_pausa_min: 265, // > 240min fatigue!
    prontuarios_pendentes: 3,
    alerta_fadiga: true,
    foto_iniciais: 'RA',
    avatar_color: '#f59e0b',
  },
  {
    id: 'doc-05',
    nome: 'Dra. Sofia Mendonça',
    cargo: 'Ortodontista & Alinhadores Invisíveis',
    crm_cro: 'CRO-SP 109.553',
    especialidade: 'orto',
    status: 'atendimento',
    sala_atual_id: 5,
    tempo_turno_min: 170,
    tempo_sem_pausa_min: 85,
    prontuarios_pendentes: 2,
    alerta_fadiga: false,
    foto_iniciais: 'SM',
    avatar_color: '#8b5cf6',
  },
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p-101',
    nome: 'Carlos Eduardo M.',
    iniciais: 'CM',
    especialidade_requisitada: 'geral',
    status: 'atendimento',
    tempo_espera: 320,
    tempo_espera_max: 900,
    coordenada_atual_3D: { x: -4.5, y: 0.4, z: -2.8 },
    target_room_id: 1,
    procedimento: 'Restauração Estética & Profilaxia',
    valor_estimado: 680,
    prioridade: 'normal',
    entrada_timestamp: Date.now() - 1040000,
  },
  {
    id: 'p-102',
    nome: 'Mariana Duarte',
    iniciais: 'MD',
    especialidade_requisitada: 'geral',
    status: 'atendimento',
    tempo_espera: 520,
    tempo_espera_max: 900,
    coordenada_atual_3D: { x: 4.5, y: 0.4, z: -2.8 },
    target_room_id: 3,
    procedimento: 'Tratamento Endodôntico Molar',
    valor_estimado: 1450,
    prioridade: 'normal',
    entrada_timestamp: Date.now() - 2680000,
  },
  {
    id: 'p-103',
    nome: 'Pedro Henrique V.',
    iniciais: 'PV',
    especialidade_requisitada: 'urgencia',
    status: 'atendimento',
    tempo_espera: 110,
    tempo_espera_max: 600,
    coordenada_atual_3D: { x: -4.5, y: 0.4, z: 3.2 },
    target_room_id: 4,
    procedimento: 'Exodontia & Sutura Cirúrgica',
    valor_estimado: 1980,
    prioridade: 'urgente',
    entrada_timestamp: Date.now() - 1040000,
  },
  {
    id: 'p-104',
    nome: 'Larissa Fontes',
    iniciais: 'LF',
    especialidade_requisitada: 'orto',
    status: 'atendimento',
    tempo_espera: 210,
    tempo_espera_max: 900,
    coordenada_atual_3D: { x: 4.5, y: 0.4, z: 3.2 },
    target_room_id: 5,
    procedimento: 'Manutenção Alinhador Invisível',
    valor_estimado: 450,
    prioridade: 'normal',
    entrada_timestamp: Date.now() - 600000,
  },
  {
    id: 'p-201',
    nome: 'Ana Carolina Lima',
    iniciais: 'AL',
    especialidade_requisitada: 'geral',
    status: 'aguardando',
    tempo_espera: 390,
    tempo_espera_max: 900,
    coordenada_atual_3D: { x: -1.4, y: 0.4, z: 2.8 },
    target_room_id: null,
    procedimento: 'Avaliação Inicial & Check-up',
    valor_estimado: 350,
    prioridade: 'normal',
    entrada_timestamp: Date.now() - 390000,
  },
  {
    id: 'p-202',
    nome: 'Rodrigo Pires',
    iniciais: 'RP',
    especialidade_requisitada: 'orto',
    status: 'aguardando',
    tempo_espera: 150,
    tempo_espera_max: 900,
    coordenada_atual_3D: { x: 0.1, y: 0.4, z: 3.6 },
    target_room_id: null,
    procedimento: 'Ajuste Braquetes Safira',
    valor_estimado: 520,
    prioridade: 'normal',
    entrada_timestamp: Date.now() - 150000,
  },
  {
    id: 'p-203',
    nome: 'Fernanda Rocha',
    iniciais: 'FR',
    especialidade_requisitada: 'urgencia',
    status: 'aguardando',
    tempo_espera: 75,
    tempo_espera_max: 600,
    coordenada_atual_3D: { x: 1.4, y: 0.4, z: 2.7 },
    target_room_id: null,
    procedimento: 'Dor Aguda / Fratura Dental',
    valor_estimado: 890,
    prioridade: 'urgente',
    entrada_timestamp: Date.now() - 75000,
  },
];

export const INITIAL_KPIS: FinancialKPIs = {
  caixa_diario: 28450,
  ticket_medio: 1240,
  ocupacao_atual: 80,
  conversao_avaliacoes: 78.5,
  consultas_concluidas: 22,
  planos_fechados: 17,
  sparkline_faturamento: [16200, 18500, 21000, 22400, 25800, 28450],
  sparkline_ocupacao: [65, 72, 85, 78, 82, 80],
};

export const INITIAL_CLIMATE: ClimateIoTState = {
  temperatura_alvo: 21.5,
  temperatura_atual: 21.7,
  umidade_relativa: 46,
  qualidade_ar_aqi: 12,
  fluxo_ar_cfm: 850,
  modo_auto: true,
  cenario_ativo: 'normal',
};

export const INITIAL_EVENTS: ClinicEvent[] = [
  {
    id: 'evt-1',
    timestamp: '12:58:14',
    tipo: 'gargalo',
    origem: 'Agente Orquestrador',
    mensagem: 'Alerta de Gargalo: Consultório 03 excedeu em 25% o tempo limite previsto (Canal Molar).',
    nivel: 'alerta',
    metadata: { roomId: 3 },
  },
  {
    id: 'evt-2',
    timestamp: '12:54:30',
    tipo: 'rh',
    origem: 'Agente RH',
    mensagem: 'Alerta de Carga: Dr. Renato Albuquerque está há 265min em procedimento sem intervalo.',
    nivel: 'alerta',
  },
  {
    id: 'evt-3',
    timestamp: '12:49:12',
    tipo: 'financeiro',
    origem: 'Agente Societário',
    mensagem: 'Faturamento aprovado: Consultório 01 concluiu tratamento ortodôntico (R$ 3.800).',
    nivel: 'sucesso',
    metadata: { valor: 3800 },
  },
  {
    id: 'evt-4',
    timestamp: '12:42:05',
    tipo: 'triagem',
    origem: 'Agente Recepção',
    mensagem: 'Paciente Mariana Duarte direcionada para Consultório 03 via algoritmo de balanceamento.',
    nivel: 'info',
    metadata: { roomId: 3 },
  },
  {
    id: 'evt-5',
    timestamp: '12:35:50',
    tipo: 'alerta',
    origem: 'Agente Recepção',
    mensagem: 'Prioridade Vermelha: Paciente Pedro Henrique V. alocado na Sala 04 (Cirurgia Urgente).',
    nivel: 'urgente',
    metadata: { roomId: 4 },
  },
];

type Listener = () => void;

class ClinicStore {
  private rooms: Room[] = [...INITIAL_ROOMS];
  private staff: StaffMember[] = [...INITIAL_STAFF];
  private patients: Patient[] = [...INITIAL_PATIENTS];
  private kpis: FinancialKPIs = { ...INITIAL_KPIS };
  private climate: ClimateIoTState = { ...INITIAL_CLIMATE };
  private events: ClinicEvent[] = [...INITIAL_EVENTS];
  private theme: ThemeMode = 'light'; // Default to pristine light clinical mode from video
  private listeners: Set<Listener> = new Set();
  
  private isSimulationRunning: boolean = true;
  private simulationSpeed: number = 1;
  private simTimer: any = null;
  private secondsCounter: number = 0;

  constructor() {
    this.startSimulation();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  getRooms(): Room[] {
    return this.rooms;
  }

  getRoomById(id: number): Room | undefined {
    return this.rooms.find((r) => r.id === id);
  }

  getStaff(): StaffMember[] {
    return this.staff;
  }

  getPatients(): Patient[] {
    return this.patients;
  }

  getWaitingPatients(): Patient[] {
    return this.patients.filter((p) => p.status === 'aguardando');
  }

  getActivePatients(): Patient[] {
    return this.patients.filter((p) => p.status === 'atendimento' || p.status === 'em_transito');
  }

  getKPIs(): FinancialKPIs {
    return this.kpis;
  }

  getClimate(): ClimateIoTState {
    return this.climate;
  }

  getEvents(): ClinicEvent[] {
    return this.events;
  }

  getTheme(): ThemeMode {
    return this.theme;
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.notify();
  }

  setTheme(theme: ThemeMode) {
    this.theme = theme;
    this.notify();
  }

  isSimulationActive(): boolean {
    return this.isSimulationRunning;
  }

  getSimulationSpeed(): number {
    return this.simulationSpeed;
  }

  setSimulationSpeed(speed: number) {
    this.simulationSpeed = speed;
    this.restartTimer();
    this.notify();
  }

  toggleSimulation() {
    this.isSimulationRunning = !this.isSimulationRunning;
    if (this.isSimulationRunning) {
      this.restartTimer();
    } else if (this.simTimer) {
      clearInterval(this.simTimer);
      this.simTimer = null;
    }
    this.notify();
  }

  private restartTimer() {
    if (this.simTimer) clearInterval(this.simTimer);
    const intervalMs = Math.max(200, 1000 / this.simulationSpeed);
    this.simTimer = setInterval(() => this.simulationTick(), intervalMs);
  }

  private startSimulation() {
    this.restartTimer();
  }

  private simulationTick() {
    if (!this.isSimulationRunning) return;
    this.secondsCounter++;

    // 1. Tick waiting patients
    this.patients.forEach((p) => {
      if (p.status === 'aguardando') {
        p.tempo_espera += 1;
      }
    });

    // 2. Tick rooms in consultation
    this.rooms.forEach((room) => {
      if (room.status === 'ocupado') {
        room.tempo_atendimento_atual += 1;

        // Bottleneck trigger
        if (room.tempo_atendimento_atual > room.timer_limite * 1.15 && !room.is_gargalo) {
          room.is_gargalo = true;
          room.luz_cor_hex = '#FF9500';
          room.luz_intensidade = 1.3;
          this.logEvent(
            'gargalo',
            'Agente Orquestrador',
            `Gargalo detectado em ${room.nome}: atendimento excedeu 15% do limite programado.`,
            'alerta',
            { roomId: room.id }
          );
        }

        // Auto-complete if finished
        if (room.tempo_atendimento_atual > room.timer_limite * 1.45 && Math.random() < 0.08) {
          this.completeConsultation(room.id, true);
        }
      }
    });

    // 3. Reception dispatch check
    if (this.secondsCounter % 5 === 0) {
      this.runReceptionAgentDispatch();
    }

    // 4. HR check
    if (this.secondsCounter % 15 === 0) {
      this.runHRAgentCheck();
    }

    // 5. Inflow: new patient
    if (this.secondsCounter % 30 === 0) {
      this.autoGeneratePatient();
    }

    // Dynamic temperature micro-fluctuation for realism
    if (this.secondsCounter % 6 === 0) {
      const delta = (Math.random() - 0.5) * 0.1;
      this.climate.temperatura_atual = Number((this.climate.temperatura_alvo + delta).toFixed(1));
    }

    // Update occupancy
    const occupiedCount = this.rooms.filter((r) => r.status === 'ocupado').length;
    this.kpis.ocupacao_atual = Math.round((occupiedCount / this.rooms.length) * 100);

    this.notify();
  }

  logEvent(
    tipo: ClinicEvent['tipo'],
    origem: ClinicEvent['origem'],
    mensagem: string,
    nivel: ClinicEvent['nivel'],
    metadata?: ClinicEvent['metadata']
  ) {
    const timeStr = new Date().toLocaleTimeString('pt-BR');
    const newEvent: ClinicEvent = {
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: timeStr,
      tipo,
      origem,
      mensagem,
      nivel,
      metadata,
    };
    this.events = [newEvent, ...this.events.slice(0, 49)];
    this.notify();
  }

  runReceptionAgentDispatch(): boolean {
    const waitingList = this.getWaitingPatients();
    if (waitingList.length === 0) return false;

    const sorted = [...waitingList].sort((a, b) => {
      if (a.prioridade === 'urgente' && b.prioridade !== 'urgente') return -1;
      if (b.prioridade === 'urgente' && a.prioridade !== 'urgente') return 1;
      return b.tempo_espera - a.tempo_espera;
    });

    for (const patient of sorted) {
      const targetRoom = this.findBestRoomForPatient(patient);
      if (targetRoom) {
        this.dispatchPatientToRoom(patient.id, targetRoom.id);
        return true;
      }
    }
    return false;
  }

  private findBestRoomForPatient(patient: Patient): Room | null {
    if (patient.especialidade_requisitada === 'urgencia' || patient.prioridade === 'urgente') {
      const room4 = this.rooms.find((r) => r.id === 4 && r.status === 'livre');
      if (room4) return room4;
      const freeGeneral = this.rooms.find((r) => [1, 2, 3].includes(r.id) && r.status === 'livre');
      return freeGeneral || null;
    }

    if (patient.especialidade_requisitada === 'orto') {
      const room5 = this.rooms.find((r) => r.id === 5 && r.status === 'livre');
      if (room5) return room5;
      return null;
    }

    const generalRooms = this.rooms.filter((r) => [1, 2, 3].includes(r.id) && r.status === 'livre');
    if (generalRooms.length === 0) return null;
    return generalRooms[0];
  }

  dispatchPatientToRoom(patientId: string, roomId: number) {
    const patient = this.patients.find((p) => p.id === patientId);
    const room = this.rooms.find((r) => r.id === roomId);
    if (!patient || !room || room.status !== 'livre') return;

    room.status = 'ocupado';
    room.patient_id = patient.id;
    room.procedimento_atual = patient.procedimento || 'Consulta Especializada';
    room.tempo_atendimento_atual = 0;
    room.is_gargalo = false;

    if (room.id === 4 || patient.especialidade_requisitada === 'urgencia') {
      room.luz_cor_hex = '#FF3B30';
      room.luz_intensidade = 1.15;
    } else if (room.id === 5 || patient.especialidade_requisitada === 'orto') {
      room.luz_cor_hex = '#AF52DE';
      room.luz_intensidade = 0.85;
    } else {
      room.luz_cor_hex = '#007AFF';
      room.luz_intensidade = 0.85;
    }

    const freeDoc = this.staff.find((s) => s.especialidade === patient.especialidade_requisitada && s.status === 'livre')
      || this.staff.find((s) => s.status === 'livre')
      || this.staff.find((s) => s.sala_atual_id === roomId);

    if (freeDoc) {
      freeDoc.status = 'atendimento';
      freeDoc.sala_atual_id = roomId;
      room.medico_id = freeDoc.id;
    }

    patient.status = 'em_transito';
    patient.target_room_id = roomId;

    this.logEvent(
      'triagem',
      'Agente Recepção',
      `Triagem IA: Paciente ${patient.nome} (${patient.iniciais}) roteado para ${room.nome}.`,
      patient.prioridade === 'urgente' ? 'urgente' : 'info',
      { roomId: room.id, patientId: patient.id }
    );

    // Animate walking along corridor
    setTimeout(() => {
      const p = this.patients.find((pt) => pt.id === patientId);
      if (p) {
        p.status = 'atendimento';
        p.coordenada_atual_3D = { ...room.coords_centro, y: 0.4 };
        this.notify();
      }
    }, 1800);

    this.notify();
  }

  completeConsultation(roomId: number, autoGenerated: boolean = false) {
    const room = this.rooms.find((r) => r.id === roomId);
    if (!room || room.status !== 'ocupado') return;

    const patient = this.patients.find((p) => p.id === room.patient_id);
    const doctor = this.staff.find((s) => s.id === room.medico_id);
    const valorCobrado = patient?.valor_estimado || Math.floor(Math.random() * 800 + 400);

    this.kpis.caixa_diario += valorCobrado;
    this.kpis.consultas_concluidas += 1;
    this.kpis.planos_fechados += 1;
    this.kpis.ticket_medio = Math.round(this.kpis.caixa_diario / this.kpis.consultas_concluidas);
    this.kpis.sparkline_faturamento = [
      ...this.kpis.sparkline_faturamento.slice(1),
      this.kpis.caixa_diario,
    ];

    // Temporary green flash
    room.luz_cor_hex = '#34C759';
    room.luz_intensidade = 1.3;

    setTimeout(() => {
      const currentRoom = this.rooms.find((r) => r.id === roomId);
      if (currentRoom && currentRoom.status === 'livre') {
        currentRoom.luz_cor_hex = '#FFFFFF';
        currentRoom.luz_intensidade = 0.35;
        this.notify();
      }
    }, 2500);

    room.status = 'livre';
    room.patient_id = null;
    room.procedimento_atual = undefined;
    room.tempo_atendimento_atual = 0;
    room.is_gargalo = false;

    if (doctor) {
      doctor.status = 'livre';
      doctor.tempo_sem_pausa_min += 30;
      doctor.tempo_turno_min += 30;
    }

    if (patient) {
      patient.status = 'concluido';
      this.patients = this.patients.filter((p) => p.id !== patient.id);
    }

    this.logEvent(
      'financeiro',
      'Agente Societário',
      `Consulta finalizada em ${room.nome}. Faturamento aprovado: R$ ${valorCobrado.toLocaleString('pt-BR')},00 (${patient?.procedimento || 'Plano Odontológico'}).`,
      'sucesso',
      { roomId: room.id, valor: valorCobrado }
    );

    this.notify();
  }

  runHRAgentCheck() {
    this.staff.forEach((member) => {
      if (member.tempo_sem_pausa_min > 240 && !member.alerta_fadiga) {
        member.alerta_fadiga = true;
        this.logEvent(
          'rh',
          'Agente RH',
          `Alerta de Fadiga: ${member.nome} está há mais de 4h (${member.tempo_sem_pausa_min}min) contínuas sem intervalo. Recomendada pausa de 15min.`,
          'alerta'
        );
      }
    });
  }

  sendDoctorToPause(doctorId: string) {
    const doc = this.staff.find((s) => s.id === doctorId);
    if (!doc) return;
    doc.status = 'pausa';
    doc.tempo_sem_pausa_min = 0;
    doc.alerta_fadiga = false;
    this.logEvent('rh', 'Agente RH', `${doc.nome} iniciou intervalo regulamentar de 15min.`, 'info');
    this.notify();
  }

  returnDoctorFromPause(doctorId: string) {
    const doc = this.staff.find((s) => s.id === doctorId);
    if (!doc) return;
    doc.status = 'livre';
    this.logEvent('rh', 'Agente RH', `${doc.nome} retornou do intervalo e está disponível.`, 'info');
    this.notify();
  }

  addPatient(nome: string, especialidade: Specialty, procedimento: string, prioridade: 'normal' | 'urgente', valor: number) {
    const initials = nome
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() || '')
      .join('');

    const offset = (this.getWaitingPatients().length % 6) * 0.7 - 1.8;
    const newPatient: Patient = {
      id: `p-${Date.now()}`,
      nome,
      iniciais: initials || 'PX',
      especialidade_requisitada: especialidade,
      status: 'aguardando',
      tempo_espera: 0,
      tempo_espera_max: prioridade === 'urgente' ? 600 : 900,
      coordenada_atual_3D: { x: offset, y: 0.4, z: 2.8 + Math.random() * 0.8 },
      target_room_id: null,
      procedimento,
      valor_estimado: valor,
      prioridade,
      entrada_timestamp: Date.now(),
    };

    this.patients.push(newPatient);

    this.logEvent(
      'triagem',
      'Agente Recepção',
      `Novo paciente registrado: ${nome} (${procedimento}). Prioridade: ${prioridade.toUpperCase()}.`,
      prioridade === 'urgente' ? 'urgente' : 'info'
    );

    setTimeout(() => {
      this.runReceptionAgentDispatch();
    }, 400);

    this.notify();
  }

  autoGeneratePatient() {
    const sampleNames = [
      'Guilherme Prado', 'Julia Nogueira', 'Gabriel Rezende', 'Isabela Moreira',
      'Lucas Albuquerque', 'Juliana Ramos', 'Felipe Fontana', 'Camila Antunes',
      'Thiago Brandão', 'Letícia Castro', 'Matheus Viana'
    ];
    const specialties: Specialty[] = ['geral', 'geral', 'orto', 'urgencia'];
    const spec = specialties[Math.floor(Math.random() * specialties.length)];
    const name = sampleNames[Math.floor(Math.random() * sampleNames.length)];

    let proc = 'Avaliação Preventiva';
    let val = 420;
    let prio: 'normal' | 'urgente' = 'normal';

    if (spec === 'urgencia') {
      proc = 'Tratamento de Dor Aguda / Trauma';
      val = 1150;
      prio = 'urgente';
    } else if (spec === 'orto') {
      proc = 'Manutenção e Troca de Arcos';
      val = 550;
    } else {
      proc = 'Profilaxia com Ultrassom & Flúor';
      val = 390;
    }

    this.addPatient(name, spec, proc, prio, val);
  }

  // Lighting & Climate Scenario Presets
  applyScenario(scenario: WardScenario) {
    this.climate.cenario_ativo = scenario;

    if (scenario === 'emergencia') {
      this.climate.temperatura_alvo = 19.5;
      this.climate.fluxo_ar_cfm = 1100;
      this.rooms.forEach((r) => {
        r.iluminacao_lux = 750;
        r.luz_kelvin = 6500;
        r.luz_intensidade = 1.0;
      });
      this.logEvent('cenario', 'Agente Orquestrador', 'Cenário de Plantão Cirúrgico & Emergência ativado em toda a unidade.', 'alerta');
    } else if (scenario === 'noturno') {
      this.climate.temperatura_alvo = 23.0;
      this.climate.fluxo_ar_cfm = 600;
      this.rooms.forEach((r) => {
        if (r.status === 'livre') {
          r.iluminacao_lux = 180;
          r.luz_kelvin = 3000;
          r.luz_intensidade = 0.2;
        }
      });
      this.logEvent('cenario', 'Agente Orquestrador', 'Modo Noturno & Economia de Energia ativado.', 'info');
    } else if (scenario === 'esterilizacao') {
      this.climate.temperatura_alvo = 18.0;
      this.climate.fluxo_ar_cfm = 1400;
      this.rooms.forEach((r) => {
        r.luz_cor_hex = '#38bdf8';
        r.luz_intensidade = 0.9;
      });
      this.logEvent('cenario', 'Agente Orquestrador', 'Protocolo de Esterilização Ultravioleta e Filtragem HEPA iniciado.', 'info');
    } else {
      // Normal
      this.climate.temperatura_alvo = 21.5;
      this.climate.fluxo_ar_cfm = 850;
      this.rooms.forEach((r) => {
        r.iluminacao_lux = 480;
        r.luz_kelvin = 4500;
        if (r.status === 'livre') {
          r.luz_cor_hex = '#FFFFFF';
          r.luz_intensidade = 0.35;
        }
      });
      this.logEvent('cenario', 'Agente Orquestrador', 'Operação Normal reestabelecida.', 'info');
    }

    this.notify();
  }

  toggleRoomLight(roomId: number) {
    const room = this.rooms.find((r) => r.id === roomId);
    if (!room) return;
    room.luz_ativa = !room.luz_ativa;
    this.notify();
  }

  setRoomLux(roomId: number, lux: number) {
    const room = this.rooms.find((r) => r.id === roomId);
    if (!room) return;
    room.iluminacao_lux = lux;
    room.luz_intensidade = Math.min(1.2, lux / 600);
    this.notify();
  }

  setTargetTemperature(temp: number) {
    this.climate.temperatura_alvo = Math.max(16, Math.min(28, Number(temp.toFixed(1))));
    this.notify();
  }

  toggleAutoClimate() {
    this.climate.modo_auto = !this.climate.modo_auto;
    this.notify();
  }

  updateRoomClimate(roomId: number, temp: number, lux: number) {
    const room = this.rooms.find((r) => r.id === roomId);
    if (!room) return;
    room.temperatura = temp;
    room.iluminacao_lux = lux;
    this.notify();
  }
}

export const clinicStore = new ClinicStore();
