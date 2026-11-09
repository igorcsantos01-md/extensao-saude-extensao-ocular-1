import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  BookOpen,
  RotateCcw,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { MYTHS_AND_TRUTHS_DATA, MythTruthItem } from '../data/certificate05Data';

const CATEGORIES = [
  'Todos',
  'Receitas Caseiras',
  'Automedicação',
  'Mídias Sociais',
  'Urgência Ocular',
] as const;

export const InteractiveMythsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number]>('Todos');
  const [userVotes, setUserVotes] = useState<
    Record<string, 'MITO PERIGOSO' | 'VERDADE CIENTÍFICA'>
  >({});
  const [revealAll, setRevealAll] = useState<boolean>(false);

  const filteredItems =
    selectedCategory === 'Todos'
      ? MYTHS_AND_TRUTHS_DATA
      : MYTHS_AND_TRUTHS_DATA.filter((item) => item.category === selectedCategory);

  const handleVote = (id: string, choice: 'MITO PERIGOSO' | 'VERDADE CIENTÍFICA') => {
    setUserVotes((prev) => ({ ...prev, [id]: choice }));
  };

  const handleReset = () => {
    setUserVotes({});
    setRevealAll(false);
  };

  const answeredCount = Object.keys(userVotes).length;
  const correctCount = Object.entries(userVotes).filter(([id, vote]) => {
    const item = MYTHS_AND_TRUTHS_DATA.find((x) => x.id === id);
    return item && item.verdict === vote;
  }).length;

  return (
    <section
      id="mitos-e-verdades"
      className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto border-t border-[#2E1065]/10"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div className="max-w-3xl">
          <div className="text-xs font-mono-code uppercase tracking-widest text-[#E11D48] font-semibold">
            02. Instrumento Interativo da Campanha · Coleta de Dados Populacionais
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#2E1065] mt-2 tracking-tight text-balance">
            Cards Interativos “Mito ou Verdade” na Saúde Ocular
          </h2>
          <p className="text-[#52525B] text-base mt-3 leading-relaxed">
            Reprodução fiel do instrumento digital interativo aplicado na ação extensionista de
            junho de 2024 pelo médico <strong>Dr. Lucas Gonçalves Silveira</strong>. Teste cada
            afirmação popular abaixo ou revele diretamente a fundamentação oftalmológica baseada nas
            diretrizes do Conselho Brasileiro de Oftalmologia (CBO), ANVISA e Ministério da Saúde.
          </p>
        </div>

        {/* Interactive Toolbar */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="bg-white border border-[#2E1065]/15 rounded-lg px-3.5 py-2 text-xs font-mono-code text-[#2E1065]">
            Simulador: <strong>{answeredCount}</strong>/{MYTHS_AND_TRUTHS_DATA.length} avaliados
            {answeredCount > 0 && (
              <span className="ml-2 text-[#047857]">({correctCount} acertos)</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setRevealAll((prev) => !prev)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#2E1065] text-white hover:bg-[#4C1D95] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {revealAll ? 'Modo Interativo (Quiz)' : 'Revelar Todos os Pareceres'}
          </button>
          {(answeredCount > 0 || revealAll) && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 text-xs font-medium rounded-lg border border-[#2E1065]/20 text-[#2E1065] hover:bg-[#2E1065]/5 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reiniciar
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F3F0EB] rounded-xl w-fit mb-8 border border-[#2E1065]/10">
        {CATEGORIES.map((category) => {
          const active = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-[#2E1065] text-white shadow-xs'
                  : 'text-[#52525B] hover:text-[#2E1065]'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item: MythTruthItem, idx: number) => {
          const userChoice = userVotes[item.id];
          const isRevealed = revealAll || Boolean(userChoice);
          const isCorrect = userChoice === item.verdict;
          const isMyth = item.verdict === 'MITO PERIGOSO';

          return (
            <article
              key={item.id}
              className="bg-white border border-[#2E1065]/12 rounded-2xl p-6 flex flex-col justify-between transition-all hover:border-[#2E1065]/30"
            >
              <div>
                {/* Clean unboxed metadata row */}
                <div className="flex items-center justify-between gap-2 text-xs text-[#52525B] font-mono-code">
                  <div>
                    <span>Card #{String(idx + 1).padStart(2, '0')}</span>
                    <span className="mx-1.5" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-[#2E1065] font-semibold">{item.category}</span>
                  </div>
                  <span>Severidade: {item.riskSeverity}</span>
                </div>

                {/* Statement */}
                <h3 className="font-display text-lg sm:text-xl font-semibold text-[#18181B] mt-3 leading-snug">
                  “{item.statement}”
                </h3>

                <p className="text-xs text-[#52525B] mt-2">
                  Origem mapeada: <span className="italic">{item.popularOrigin}</span>
                </p>

                {/* Interactive Vote Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <button
                    type="button"
                    onClick={() => handleVote(item.id, 'MITO PERIGOSO')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
                      userChoice === 'MITO PERIGOSO'
                        ? 'bg-[#E11D48] text-white border-[#E11D48]'
                        : 'bg-[#FAF8F5] text-[#18181B] border-[#2E1065]/15 hover:border-[#E11D48] hover:text-[#E11D48]'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    Mito Perigoso
                  </button>

                  <button
                    type="button"
                    onClick={() => handleVote(item.id, 'VERDADE CIENTÍFICA')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
                      userChoice === 'VERDADE CIENTÍFICA'
                        ? 'bg-[#047857] text-white border-[#047857]'
                        : 'bg-[#FAF8F5] text-[#18181B] border-[#2E1065]/15 hover:border-[#047857] hover:text-[#047857]'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Verdade Científica
                  </button>
                </div>
              </div>

              {/* Revealed Clinical Explanation */}
              {isRevealed ? (
                <div
                  className={`mt-5 pt-4 border-t ${
                    isMyth ? 'border-[#E11D48]/20' : 'border-[#047857]/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div
                      className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${
                        isMyth ? 'text-[#E11D48]' : 'text-[#047857]'
                      }`}
                    >
                      {isMyth ? (
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      )}
                      Parecer Oficial: {item.verdict}
                    </div>

                    {userChoice && (
                      <span
                        className={`text-xs font-mono-code font-semibold ${
                          isCorrect ? 'text-[#047857]' : 'text-[#E11D48]'
                        }`}
                      >
                        {isCorrect ? '✓ Resposta Correta' : '× Atenção ao Risco'}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-[#27272A] leading-relaxed">
                    {item.clinicalExplanation}
                  </p>

                  <div className="mt-3 pt-3 border-t border-[#2E1065]/10 text-xs text-[#52525B] space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#2E1065] shrink-0" />
                      <span>
                        <strong>Alvo Anatômico:</strong> {item.anatomicalTarget}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#2E1065] shrink-0" />
                      <span>
                        <strong>Diretriz:</strong> {item.officialGuideline}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 pt-3 border-t border-[#2E1065]/10 flex items-center justify-between text-xs text-[#52525B]">
                  <span>Selecione uma opção acima para ver a explicação clínica</span>
                  <button
                    type="button"
                    onClick={() => handleVote(item.id, item.verdict)}
                    className="text-[#4C1D95] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Ver parecer
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};
