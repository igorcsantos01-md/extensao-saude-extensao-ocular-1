import React, { useState } from 'react';
import {
  AlertOctagon,
  Activity,
  PhoneCall,
  Droplets,
  ShieldCheck,
  Hospital,
  ArrowRight,
} from 'lucide-react';
import { CLINICAL_RISK_AGENTS, ClinicalRiskAgent } from '../data/certificate05Data';

export const ClinicalRiskAndSusSection: React.FC = () => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(CLINICAL_RISK_AGENTS[0].id);

  const activeAgent: ClinicalRiskAgent =
    CLINICAL_RISK_AGENTS.find((a) => a.id === selectedAgentId) || CLINICAL_RISK_AGENTS[0];

  return (
    <section
      id="riscos-e-urgencia"
      className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto border-t border-[#2E1065]/10"
    >
      {/* Part 1: Clinical Risk Panel */}
      <div className="mb-16">
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-mono-code uppercase tracking-widest text-[#E11D48] font-semibold">
            03. Toxicologia da Superfície Ocular · Alerta Contra Colírios Caseiros
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#2E1065] mt-2 tracking-tight text-balance">
            Painel Clínico de Toxicidade Corneal e Automedicação
          </h2>
          <p className="text-[#52525B] text-base mt-3 leading-relaxed">
            Selecione abaixo qualquer substância caseira ou classe farmacológica investigada durante
            o Projeto de Extensão Nº 05 para inspecionar o mecanismo bioquímico de agressão à
            córnea, as patologias associadas e a conduta médica preconizada.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left selector list */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            {CLINICAL_RISK_AGENTS.map((agent, index) => {
              const isSelected = agent.id === activeAgent.id;
              return (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#2E1065] text-white border-[#2E1065] shadow-sm'
                      : 'bg-white text-[#18181B] border-[#2E1065]/12 hover:border-[#2E1065]/35'
                  }`}
                >
                  <div>
                    <div
                      className={`text-xs font-mono-code ${
                        isSelected ? 'text-[#FDA4AF]' : 'text-[#E11D48]'
                      }`}
                    >
                      Agente 0{index + 1} · {agent.riskLevel}
                    </div>
                    <div className="font-semibold text-sm sm:text-base mt-0.5">{agent.name}</div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'translate-x-0.5 text-white' : 'text-[#52525B]'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right detail panel */}
          <div className="lg:col-span-7 bg-white border border-[#2E1065]/15 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#2E1065]/10">
                <span className="text-xs font-mono-code uppercase tracking-wider text-[#E11D48] font-bold flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4" />
                  {activeAgent.riskLevel}
                </span>
                <span className="text-xs font-mono-code text-[#52525B]">
                  Protocolo de Vigilância Oftalmológica
                </span>
              </div>

              <h3 className="font-display text-2xl font-semibold text-[#2E1065] mt-4">
                {activeAgent.name}
              </h3>
              <p className="text-xs text-[#52525B] mt-1">
                <strong>Crença Popular Combatida:</strong> {activeAgent.popularClaim}
              </p>

              <div className="mt-5 p-4 rounded-xl bg-[#FAF8F5] border border-[#2E1065]/10">
                <div className="text-xs font-mono-code uppercase text-[#2E1065] font-semibold">
                  Mecanismo Físico-Químico e Microbiológico
                </div>
                <div className="text-sm font-semibold text-[#18181B] mt-1">
                  {activeAgent.phOrMechanism}
                </div>
                <p className="text-sm text-[#3F3F46] mt-2 leading-relaxed">
                  {activeAgent.clinicalSummary}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                <div className="p-4 rounded-xl bg-[#FDF2F4] border border-[#E11D48]/20">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#BE123C] mb-2">
                    Lesões e Patologias Induzidas
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-[#18181B]">
                    {activeAgent.pathologies.map((patho) => (
                      <li key={patho} className="flex items-start gap-2">
                        <span className="text-[#E11D48] font-bold">•</span>
                        <span>{patho}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#F3F0EB] border border-[#2E1065]/12">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#2E1065] mb-2">
                    Estruturas Oculares Acometidas
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-[#18181B]">
                    {activeAgent.affectedStructures.map((struct) => (
                      <li key={struct} className="flex items-start gap-2">
                        <span className="text-[#2E1065] font-bold">•</span>
                        <span>{struct}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#2E1065]/10 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#047857] shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-[#27272A]">
                <strong className="text-[#047857]">Conduta Médica e Orientação Comunitária:</strong>{' '}
                {activeAgent.immediateConduct}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: SUS Ophthalmic Emergency Flow */}
      <div className="bg-[#2E1065] text-white rounded-3xl p-6 sm:p-10">
        <div className="max-w-3xl">
          <div className="text-xs font-mono-code uppercase tracking-widest text-[#FDA4AF] font-semibold">
            Eixo IV da Extensão · Divulgação dos Canais Oficiais de Saúde Pública
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-semibold mt-2 text-balance">
            Guia Comunitário de Urgência Oftalmológica no SUS e Conduta Imediata
          </h3>
          <p className="text-white/80 text-sm sm:text-base mt-2 leading-relaxed">
            Fluxograma prático distribuído nos folhetos e cartilhas digitais da campanha para
            orientar a população diante de acidentes com colírios caseiros, queimaduras químicas ou
            sinais de alarme visual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Step 1 */}
          <div className="bg-white/8 border border-white/15 rounded-2xl p-6">
            <div className="flex items-center justify-between text-xs font-mono-code text-[#FDA4AF]">
              <span>PASSO 01 · PRIMEIROS SOCORROS</span>
              <Droplets className="w-4 h-4" />
            </div>
            <h4 className="font-display text-lg font-semibold mt-3">
              Irrigação Ocular Abundante Imediata (15 a 30 min)
            </h4>
            <p className="text-sm text-white/80 mt-2 leading-relaxed">
              Lavar imediatamente o olho aberto em água corrente limpa e fria ou Soro Fisiológico
              0,9% estéril por no mínimo 15 minutos. Jamais pingar leite, óleo, limão ou outro
              colírio para tentar “neutralizar” a substância.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white/8 border border-white/15 rounded-2xl p-6">
            <div className="flex items-center justify-between text-xs font-mono-code text-[#FDA4AF]">
              <span>PASSO 02 · SINAIS DE ALARME</span>
              <Activity className="w-4 h-4" />
            </div>
            <h4 className="font-display text-lg font-semibold mt-3">
              Reconhecimento de Emergência Oftalmológica
            </h4>
            <p className="text-sm text-white/80 mt-2 leading-relaxed">
              Procurar atendimento médico imediato se houver: dor ocular intensa que não melhora,
              fotofobia (sensibilidade extrema à luz), embaçamento súbito da visão, mancha
              esbranquiçada na córnea ou secreção purulenta.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white/8 border border-white/15 rounded-2xl p-6">
            <div className="flex items-center justify-between text-xs font-mono-code text-[#FDA4AF]">
              <span>PASSO 03 · REDE PÚBLICA (SUS)</span>
              <Hospital className="w-4 h-4" />
            </div>
            <h4 className="font-display text-lg font-semibold mt-3">
              Acionamento Oficial e Portas de Urgência SUS
            </h4>
            <p className="text-sm text-white/80 mt-2 leading-relaxed">
              Em traumas químicos ou dor aguda severa, acione o <strong>SAMU 192</strong> ou{' '}
              <strong>Corpo de Bombeiros 193</strong>, ou dirija-se à <strong>UPA 24h</strong> /
              Serviço de Pronto Atendimento Oftalmológico credenciado ao SUS mais próximo.
            </p>
          </div>
        </div>

        {/* Official Public Channels Bar */}
        <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs font-mono-code text-white/90">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-[#FDA4AF]" />
            <span>
              Emergência Médica Pré-Hospitalar: <strong>SAMU 192</strong> · Bombeiros:{' '}
              <strong>193</strong> · Disque Saúde: <strong>136</strong>
            </span>
          </div>
          <div>
            Diretrizes Clínicas: <strong>Conselho Brasileiro de Oftalmologia (CBO)</strong> &amp;{' '}
            <strong>Ministério da Saúde (SUS)</strong>
          </div>
        </div>
      </div>
    </section>
  );
};
