# SITEMAP: Odonto Facility OS
**Versão:** 1.0.0 | **Escopo:** Mapeamento de Rotas, Componentes Visuais e Estados de Câmera 3D

## 1. Módulo de Autenticação e Roteamento de Permissões
**`/login`**
*   **Componentes UI:** Formulário Glassmorphism centralizado, Fundo dinâmico com desfoque pesado (blur-3xl).
*   **Ações:** Login via credenciais OTP (One-Time Password) ou Biometria.
*   **State/Redirect:** Identificação do Nível de Acesso (Nível 1: Societário, Nível 2: RH, Nível 3: Recepção) -> Redireciona para `/os`.

## 2. Workspace Operacional (Core)
**`/os` (Root Dashboard)**
*   **Renderização de Fundo (Engine 3D):** `Canvas` persistente `z-index: 0`. Renderiza o mapa da clínica em perspectiva isométrica (Câmera Estática Global inicial: `x: 50, y: 50, z: 50, target: 0, 0, 0`).
*   **Overlay UI (`z-index: 10`):** Grade de layout `pointer-events: none` com painéis laterais em `pointer-events: auto`.
*   **Barra de Navegação Superior (Módulos de Agentes):**
    *   `Tab: Quadro Societário` -> Altera painéis laterais para KPIs financeiros.
    *   `Tab: RH` -> Altera painéis laterais para gestão de equipe.
    *   `Tab: Recepção` -> Altera painéis laterais para triagem e fila.

### 2.1. Visões Departamentais (Painéis Laterais Dinâmicos)
**`/os?view=societario` (Controle Executivo)**
*   **Painel Esquerdo (`<EventFeed>`):** Log cronológico de fechamento de planos, pagamentos aprovados e alertas de ociosidade crítica.
*   **Painel Direito (`<KPIBoard>`):** 
    *   Faturamento ao vivo (R$).
    *   Ticket Médio diário.
    *   Taxa de Conversão de Avaliações (%).
    *   Ocupação Geral da Clínica (Gráfico de anel SVG).
*   **Comportamento 3D:** Câmera no modo "Visão de Deus" (Panorâmica isométrica abrangendo todas as salas).

**`/os?view=rh` (Controle de Pessoal)**
*   **Painel Esquerdo (`<StaffList>`):** Lista de dentistas logados. Indicadores de: Em atendimento (verde), Pausa (amarelo), Fim de turno próximo (cinza).
*   **Painel Direito (`<AlertPanel>`):** Notificações do Agente de RH (ex: "Dr. X está há 4h sem pausa", "Prontuários pendentes de assinatura: 3").
*   **Comportamento 3D:** Marcadores de funcionários (`CSS2DRenderer`) ficam em destaque, pacentes recebem opacidade reduzida (0.3) no 3D.

**`/os?view=recepcao` (Controle de Fluxo)**
*   **Painel Esquerdo (`<WaitingList>`):** Lista de pacientes aguardando. Filtros por: Chegada, Pré-agendado, Urgência. Exibição de ETA (Tempo Estimado de Espera) atualizado a cada minuto.
*   **Painel Direito (`<TriageForm>`):** Formulário de input rápido para novos pacientes (Nome, Especialidade, Urgência). Botão "Despachar" que aciona a IA de roteamento.
*   **Comportamento 3D:** Foco no corredor de entrada e sofás da recepção. Avatares instanciados ganham "pulse animation" de destaque.

### 2.2. Drill-down de Consultórios (Zoom 3D e Dados Locais)
*Acionados via clique no mapa 3D ou seleção nas listas da UI.*

**`/os/sala/:id` (id: 1, 2, 3 - Clínico Geral)**
*   **Painel Flutuante Central (`<RoomModal>`):** Oculta painéis laterais. Exibe: Paciente atual, Procedimento (ex: Limpeza), Médico responsável, Timer regressivo da consulta.
*   **Comportamento 3D:** GSAP interpola a câmera para aproximação isométrica (Zoom-in) centralizada na respectiva cadeira odontológica. As paredes ao redor ficam invisíveis (`transmission: 1`).

**`/os/sala/4` (Urgência e Cirurgia)**
*   **Interface Exclusiva:** Painel com bordas vermelhas translúcidas. Exibe status de insumos críticos e dados do trauma/procedimento bucomaxilo. Alertas para não interrupção.

**`/os/sala/5` (Ortodontia / Revisões)**
*   **Interface Exclusiva:** Foco em contagem de atendimentos. Exibe a "Fila Rápida" específica desta sala, métrica de atendimentos/hora.

## 3. Configurações do Sistema
**`/os/settings` (Overlay Modal)**
*   `/os/settings/agents`: Parâmetros de prompt do Gemini (Ajuste de rigidez da IA para alertas de tempo).
*   `/os/settings/system`: Configuração de Websockets, conectividade Supabase e cache de rotas.

# PRD: PRODUCT REQUIREMENTS DOCUMENT
**Projeto:** Odonto Facility OS
**Versão:** 1.0.0 | **Stack Direcionado:** Svelte 5, Three.js, GSAP, Tailwind, Supabase, Cloudflare Workers, Node.js + Gemini API.

## 1. Visão Executiva e Objetivo
Plataforma de inteligência operacional de alta latência-zero para clínicas odontológicas premium. O sistema opera como um gêmeo digital (Digital Twin) onde um orquestrador de Inteligência Artificial (Gemini) processa a telemetria física (Recepção/Consultórios) e coordena agentes sub-departamentais para gerar relatórios ao vivo e prever gargalos logísticos.

## 2. Arquitetura Multi-Agentes (Core Logic)
O cérebro do sistema utiliza chamadas de sistema baseadas em eventos para o LLM, estruturadas nos seguintes sub-agentes autônomos:

### 2.1. Agente Orquestrador (Master AI)
*   **Função:** Analisar streams de dados via WebSocket do banco de dados (Supabase) em intervalos de 5 segundos.
*   **Regra de Negócio:** Se a `sala_X` excede o `tempo_previsto` em > 15%, o Orquestrador emite um payload JSON via evento para os painéis do RH e Societário.
*   **Output Técnico:** Atualização do estado global `$state` em Svelte, alterando a cor da sala no Three.js para `#FF9500` (Alerta de Gargalo).

### 2.2. Agente de Recepção (Triage & Pathfinding)
*   **Função:** Distribuição de carga lógica (*Load Balancing*).
*   **Regra de Negócio Exata:** Ao receber um input (Novo Paciente + Especialidade), a IA analisa o status (`livre`/`ocupado`/`tempo_restante`) das salas adequadas.
    *   *Se Clínico Geral:* Distribui entre Salas 1, 2 e 3 priorizando a sala com maior tempo de ociosidade atual (*Round-Robin* inteligente).
    *   *Se Urgência:* Direciona à Sala 4. Se a Sala 4 estiver ocupada, avalia gravidade e bloqueia a próxima liberação das Salas 1-3.
    *   *Se Aparelho:* Enfileira exclusivamente na Sala 5.
*   **Ação Física (3D):** Aciona a função de animação GSAP. Instancia um avatar (marcador HTML via `CSS2DRenderer`) no nó "Recepção" e o move via pathfinding predefinido até o nó da "Sala Designada".

### 2.3. Agente de RH (Monitoramento de Carga)
*   **Regra de Negócio:** Monitora a variável de tempo logado de cada profissional no sistema de gestão de prontuários.
*   **Triggers:**
    *   `turn_continuous > 240min` -> Emite alerta: "Necessária pausa de 15min para o Dr. Y".
    *   `patient_delay_complaint` -> O agente de RH cruza com a ociosidade do doutor e relata ao Sócio.

### 2.4. Agente do Quadro Societário (Business Intelligence)
*   **Regra de Negócio:** Parse de dados financeiros em tempo real. Cada evento de "Consulta Encerrada" acompanhado de "Faturamento Aprovado" na base de dados injeta uma atualização reativa no painel de KPIs.
*   **Triggers:** Calcula taxa de conversão diária (Orçamentos apresentados vs. Orçamentos aprovados) e projeta o fechamento do caixa do dia baseado em predição da IA.

## 3. Requisitos Estruturais do Engine 3D e Animação
*   **Motor:** Three.js encapsulado via Threlte (ou Svelte Cubed). O modelo 3D (exportado do Blender em `.GLB` com compressão Draco) deve ter instâncias separadas para as paredes das salas (para permitir mudança dinâmica de cor/material emissivo).
*   **Sistema de Avatares:** Os pacientes não são malhas 3D para otimização de performance. Eles DEVEM ser renderizados usando `CSS2DObject` anexados a nós vazios (`Group`) no Three.js. Isso garante texto nítido para nomes e contadores de tempo, sempre encarando a câmera (*billboarding*).
*   **Interpolação GSAP:** O deslocamento do avatar não é instantâneo. Utilizar `gsap.to()` iterando sobre coordenadas extraídas de uma curva de bezier invisível (caminho dos corredores) para simular caminhada. Duração calculada pela distância, ex: `duration: distance * 0.5`.

## 4. Requisitos de Estado e Reatividade (Frontend)
*   **Svelte 5 Runes:** O estado de toda a clínica deve residir em um arquivo `$state` central (ex: `clinicState.svelte.ts`). 
*   Variáveis obrigatórias: `patientsInLobby[]`, `roomsStatus{ 1: {}, 2: {}, ... }`, `activeAlerts[]`.
*   A alteração de qualquer destas propriedades deve refletir instantaneamente nas tags HTML de vidro (UI) e nos materiais WebGL do canvas sem necessidade de reload.

## 5. Requisitos de Infraestrutura
*   **Deploy UI:** O painel SvelteKit deverá ser exportado via adapter-auto ou static e hospedado na Vercel ou Cloudflare Pages.
*   **Data Layer:** O backend opera via Supabase Realtime (WebSockets) garantindo que quando a secretária do plano térreo atualizar um status, a tela do CEO no andar de cima pisque em menos de 500ms.

# DESIGN SYSTEM: Odonto UI (Especificações Técnicas)
**Conceito Base:** Glassmorphism de Alta Densidade de Dados. O design absorve os princípios de fluidez de navegação do universo Apple e a paleta utilitária rica em dados de plataformas como Linear e Stripe. Não há sombras pesadas sólidas, apenas difusão de luz e desfoques (blur).

## 1. Tokens Fundamentais

### 1.1. Tipografia (Importada do Google Fonts ou Local)
*   **Font Family Principal:** `Inter` (Fallback: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`).
*   **Configuração Obrigatória CSS:** 
    ```css
    .tabular-data {
      font-feature-settings: "tnum" on, "lnum" on;
      font-variant-numeric: tabular-nums;
    }
    ```
*   **Escala:**
    *   H1 (Títulos de Módulos): 24px, Peso 600, Tracking -0.02em.
    *   H2 (Nomes de Pacientes/Médicos): 16px, Peso 500.
    *   Body (Eventos de texto): 14px, Peso 400, Cor `rgba(255,255,255, 0.7)`.
    *   Caption (Timers, ETA): 12px, Peso 500, Maiúsculas, Tracking +0.05em.

### 1.2. Paleta de Cores e Materiais 3D

**Interface Glassmorph (Modo Único - Foco em contraste para Telas Grandes):**
*   **Base do Fundo (`--bg-glass`):** `rgba(250, 250, 252, 0.65)` para fundos claros ou `rgba(18, 18, 20, 0.55)` para fundos escuros (Dark Mode é recomendado para salas de controle).
*   **Desfoque (`--backdrop-filter`):** `blur(32px) saturate(150%)`.
*   **Borda Translúcida (`--border-glass`):** `1px solid rgba(255, 255, 255, 0.15)` e `box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1)`.

**Semântica de Lógica e Iluminação 3D (Luzes de Teto das Salas):**
O `MeshPhysicalMaterial` das salas 3D deve utilizar a propriedade `emissive` lincada a estas HEX:
*   `#FFFFFF` (Neutro): Consultório vazio. *Intensidade: 0.2*
*   `#007AFF` (Azul IOS - Operação Normal): Sala Clínico Geral (1, 2, 3) com paciente. *Intensidade: 0.8*
*   `#FF3B30` (Vermelho - Urgência): Sala 4 ocupada. *Intensidade: 1.0 (Pulsante sutil)*
*   `#AF52DE` (Roxo - Ortodontia): Sala 5 ocupada. *Intensidade: 0.8*
*   `#FF9500` (Laranja - Alerta de Gargalo): Qualquer sala que excedeu o tempo de atendimento em 15%. *Intensidade: 1.2 (Animação Flash de 2s via GSAP)*
*   `#34C759` (Verde - Sucesso Financeiro): Feedback temporário quando uma nova venda de plano/tratamento é confirmada naquela sala.

## 2. Especificação de Componentes UI

### 2.1. `<GlassPanel />`
Container principal de toda a UI.
*   **CSS Estrutural:** 
    `border-radius: 24px; padding: 24px; display: flex; flex-direction: column; gap: 16px;`
*   Deve ter `pointer-events: auto` e um elemento invisível interno atuando como *scroll container* ocultando barras de rolagem nativas (`::-webkit-scrollbar { display: none; }`).

### 2.2. `<KPIWidget />`
Bloco financeiro para a visão do Sócio.
*   **Layout:** Grid 2 colunas. Coluna esquerda com Label (ex: "Faturamento Atual") em cinza claro e Valor (ex: "R$ 14.500") em branco. Coluna direita com mini-gráfico vetorial (Sparkline) demonstrando a inclinação em relação ao dia anterior.
*   **Interação:** Ao passar o mouse (Hover), a borda sutilmente ilumina na posição do cursor via radial-gradient rastreado por Javascript.

### 2.3. `<LiveAvatar />` (Componente Three.js HTML)
O marcador posicionado sobre o mapa 3D.
*   **Estrutura:** Uma div arredondada de `40px x 40px`.
*   **Design:** Fundo em `rgba(20,20,20,0.8)` com texto da inicial em branco (`16px bold`).
*   **Borda Dinâmica (SVG Ring):** Uma borda circular em SVG atuando como timer de progresso. A cor da borda muda de Verde -> Amarelo -> Vermelho conforme o ETA (Estimated Time of Arrival / Espera) se esgota.
*   **Shadow Drop 3D:** Abaixo do avatar flutuante, projetar uma sombra no piso 3D (`MeshBasicMaterial` preto transparente mapeado no eixo Y=0.01).

## 3. Motion System (Especificações GSAP)

### 3.1. Câmera Coreography (Troca de Abas)
Quando o Sócio clica na aba "Urgência (Sala 4)":
```javascript
gsap.to(camera.position, {
  x: coords_sala4.x + 20, 
  y: coords_sala4.y + 40, 
  z: coords_sala4.z + 20,
  duration: 1.6,
  ease: "power3.inOut"
});

3.2. Micro-interações na UI
 * Montagem Inicial (Page Load): Todos os <GlassPanel> surgem com y: 40, opacity: 0 evoluindo para y: 0, opacity: 1 em um stagger de 0.1s utilizando ease: "expo.out".
 * Atualização de Números (KPIs): Quando o faturamento sobe, o texto anterior rola para cima (y: -20, opacity: 0) e o novo número surge de baixo (y: 20 -> 0) para evitar cortes secos, mantendo a percepção de fluxo orgânico de dados contínuos.

1. Sitemap: Estrutura de Navegação e Módulos do Sistema
Por se tratar de um sistema operacional de monitoramento em tempo real (dashboard centralizado), o Sitemap reflete a hierarquia das camadas da interface de usuário (UI Glassmorph) sobrepostas ao modelo 3D, além dos painéis de controle secundários e fluxos de dados.
[ / ] (Root) - Tela de Autenticação
 * Login seguro para Sócios, RH e Recepção.
 * Recuperação de credenciais e 2FA (Autenticação em Dois Fatores).
[ /os ] - Dashboard Principal (Workspace de Operações 3D)
 * Camada de Fundo (Canvas 3D):
   * Renderização da clínica isométrica (Recepção, Corredores, Salas 01 a 05).
   * Alternância de Câmeras (Visão Geral, Visão por Setor, Rastreamento de Avatar).
 * Painel Esquerdo (Eventos e Triagem - Glassmorph):
   * [ /os/eventos ]: Feed ao vivo (Entradas, Saídas, Chamadas de Urgência).
   * [ /os/fila ]: Status da recepção em tempo real (Avatares aguardando, ETAs).
 * Painel Direito (KPIs e Controles - Glassmorph):
   * [ /os/indicadores ]: Taxa de ocupação geral, ociosidade, tempo médio de espera.
   * [ /os/clima-luz ]: Controles físicos simulados (ou integrados via IoT) das salas.
 * Barra Superior (Navegação de Módulos da IA):
   * [ /os/societario ]: Visão financeira ao vivo, fechamento de planos, ticket médio do dia.
   * [ /os/rh ]: Escala de dentistas ativos, alertas de fadiga/pausa, controle de turnos.
   * [ /os/recepcao-hub ]: Central de roteamento manual (override da IA, se necessário) e cadastro rápido.
[ /consultorios ] - Visão Detalhada por Sala (Drill-down)
 * [ /consultorios/geral-1-2-3 ]: Status das cadeiras, procedimento atual (limpeza, avaliação), tempo decorrido vs. tempo estimado.
 * [ /consultorios/urgencia-4 ]: Monitoramento de alta prioridade, status do cirurgião, alertas de insumos complexos.
 * [ /consultorios/orto-5 ]: Fila de alta rotatividade, contagem de revisões concluídas.
[ /config ] - Configurações e IA
 * [ /config/agentes ]: Parâmetros de comportamento da IA Orquestradora (regras de roteamento, tolerância de atrasos).
 * [ /config/mapa ]: Ajustes de posicionamento de marcadores 3D e zonas de colisão.
 * [ /config/equipe ]: Gestão de perfis e especialidades médicas do corpo clínico.
2. PRD (Product Requirements Document)
Título do Produto: Odonto Facility OS
Visão Geral: Um gêmeo digital 3D operado por agentes autônomos de Inteligência Artificial para monitoramento, roteamento e análise financeira/operacional em tempo real de uma clínica odontológica de alto fluxo.
Público-Alvo e Atores (Usuários):
 * Quadro Societário (Sócios): Foco em conversão financeira, taxa de ociosidade e identificação de gargalos logísticos.
 * RH / Gestão Clínica: Foco no bem-estar e performance da equipe médica, controle de pausas e distribuição de carga.
 * Recepção: Foco na triagem ágil, organização da fila de espera física e roteamento preciso de pacientes.
Arquitetura do Sistema e Stack Tecnológico:
 * Frontend (UI/UX): Svelte 5 (Runes para reatividade nativa e otimizada), Tailwind CSS para a interface translúcida.
 * Engine 3D: Three.js (via Svelte Cubed ou Threlte) e CSS2DRenderer para integração de elementos HTML estritos sobre o canvas.
 * Animação: GSAP e ScrollTrigger/MotionPath para transições de câmeras e roteamento fluido de avatares pelo mapa.
 * Inteligência Artificial: Gemini (Flash/Pro) como orquestrador neural.
 * Backend / Infraestrutura: WebSockets (Supabase ou Node.js) para sincronização da telemetria com latência zero. Cloudflare Pages/Workers para entrega global rápida na edge.
Requisitos Funcionais (Core Features):
 * Agente de Triage Inteligente: A IA da Recepção deve identificar a especialidade do paciente e enviá-lo para a fila correta (Salas 1-3, 4 ou 5) garantindo balanceamento de carga.
 * Renderização Espacial em Tempo Real: O sistema deve instanciar um "Avatar" (CSS2D) no mapa 3D imediatamente após o cadastro na recepção.
 * Pathfinding Dinâmico: Os avatares devem se mover visualmente da recepção até os consultórios calculando rotas que reflitam a planta baixa da clínica real.
 * Monitoramento de Gargalos (Timers Ativos): Cada consulta iniciada ativa um cronômetro na IA. Se o procedimento estourar em 15% a média de tempo prevista, um alerta visual (amarelo) deve ser renderizado no painel 3D e enviado ao Agente Societário.
 * Painel Societário de Alta Fidelidade: Atualização imediata do "Ticket Médio" e "Novos Planos Contratados" assim que a Recepção finaliza um faturamento.
Requisitos Não-Funcionais:
 * Performance Gráfica: O simulador 3D deve manter estáveis 60 FPS em monitores Desktop/Web, com texturas otimizadas e iluminação dinâmica que não sobrecarregue GPUs de escritório.
 * Latência: A atualização entre um clique na Recepção física e o reflexo no sistema 3D dos Sócios deve ser inferior a 500ms.
3. Design System
Nome: Odonto UI (Baseado em princípios minimalistas de alta densidade de dados)
Conceito Visual: Uma fusão de estética corporativa premium e precisão clínica. A linguagem visual absorve inspirações de plataformas como Apple, Stripe, Linear e Notion, garantindo foco no dado, tipografia legível e componentes que parecem flutuar (Glassmorphism) sobre a operação tridimensional. Todo o protótipo e ativos vetoriais nascem no Figma e Illustrator.
1. Tipografia e Escala:
 * Fonte Primária: Inter ou SF Pro Display. Escolhida pela extrema legibilidade em números pequenos e painéis densos.
 * Pesos: Medium (500) para rótulos e cabeçalhos, Regular (400) para dados em tempo real, Semi-bold (600) para KPIs financeiros e alertas críticos.
 * Números Tabulares: O CSS deve impor font-variant-numeric: tabular-nums; nos timers e valores financeiros para evitar saltos visuais na tela durante atualizações a cada segundo.
2. Paleta de Cores e Semântica 3D/UI:
 * Superfícies (Glassmorphism):
   * Light Mode: Fundo em rgba(255, 255, 255, 0.5) com backdrop-filter: blur(24px) saturate(120%). Bordas em rgba(255,255,255, 0.4).
   * Dark Mode (Noturno/Fechamento): Fundo em rgba(20, 20, 22, 0.65) com bordas em rgba(255,255,255, 0.1).
 * Semântica de Operação (Luzes do Mapa 3D e Badges UI):
   * #FFFFFF (Branco Puro / Cinza Claro): Consultório Vazio / Livre.
   * #007AFF (Azul IOS): Atendimento Clínico Geral Normal (Salas 01, 02 e 03).
   * #FF3B30 (Vermelho Alerta): Urgência/Cirurgia Ativa (Sala 04).
   * #AF52DE (Roxo Premium): Ortodontia / Fluxo Rápido (Sala 05).
   * #FF9500 (Laranja/Amarelo): Gargalo Detectado / Atraso na sala.
   * #34C759 (Verde): Conversão / Novo plano fechado.
3. Componentes Fundamentais (Svelte Components):
 * <GlassPanel/>: Container base para todas as janelas sobrepostas. Recebe propriedades dinâmicas de largura e opacidade.
 * <LiveAvatar/>: Renderizado via CSS2DRenderer. Um círculo contendo a inicial do paciente, com um anel de progresso SVG em volta indicando o tempo de espera.
 * <KPIWidget/>: Bloco numérico usado pelo Agente Societário. Apresenta o valor atual e um mini-gráfico sparkline em verde ou vermelho indicando a tendência da última hora.
 * <EventFeed/>: Lista de scroll suave (possivelmente implementada com a biblioteca Lenis para fluidez) que exibe as notificações de texto da IA de RH e Recepção.
4. Motion e Micro-interações (GSAP):
 * Easing Padrão: power3.inOut ou expo.out para transições de UI e de câmera que remetam a interfaces nativas de luxo.
 * Transição de Câmera: Ao clicar no aviso de atraso da "Sala 04", o GSAP não corta a tela; ele interpola o vetor da câmera em 1.2 segundos diretamente para um ângulo isométrico próximo sobre a sala de cirurgia, simultaneamente esmaecendo os painéis não essenciais.
