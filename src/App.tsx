/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  FileText,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  Layers,
  Award,
  Printer,
  Edit3,
  Copy,
  Check,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import {
  CERTIFICATE_05_META,
  CAMPAIGN_IMPACT_METRICS,
} from './data/certificate05Data';
import {
  CertificateFrontPage,
  CertificateBackPage,
} from './components/CertificateDocument';
import { InteractiveMythsSection } from './components/InteractiveMythsSection';
import { ClinicalRiskAndSusSection } from './components/ClinicalRiskAndSusSection';
import { PublicAuthenticatorSection } from './components/PublicAuthenticatorSection';
import {
  EditableCertificateFields,
  getDefaultEditableCertificateFields,
  generateVectorCertificatePdf,
} from './utils/generateVectorCertificatePdf';

export default function App() {
  const [activePageFilter, setActivePageFilter] = useState<'both' | 'front' | 'back'>('both');
  const [viewerScale, setViewerScale] = useState<number>(0.92);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [copiedFullText, setCopiedFullText] = useState<boolean>(false);
  const [editableFields, setEditableFields] = useState<EditableCertificateFields>(
    getDefaultEditableCertificateFields
  );

  const qrSvgRef = useRef<SVGSVGElement | null>(null);
  const viewerContainerRef = useRef<HTMLDivElement | null>(null);

  const handleUpdateField = <K extends keyof EditableCertificateFields>(
    key: K,
    value: EditableCertificateFields[K]
  ) => {
    setEditableFields((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetEditableFields = () => {
    setEditableFields(getDefaultEditableCertificateFields());
    setIsEditMode(false);
  };

  // Responsive auto-fit scale for the A4 viewer on resize
  useEffect(() => {
    const updateScale = () => {
      if (!viewerContainerRef.current) return;
      const availableWidth = viewerContainerRef.current.clientWidth - 48;
      if (availableWidth < 1122) {
        const computed = Math.max(0.45, Math.min(0.96, availableWidth / 1122));
        setViewerScale(Number(computed.toFixed(2)));
      } else {
        setViewerScale(0.95);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      await generateVectorCertificatePdf(editableFields, qrSvgRef.current);
      setDownloadSuccessToast(true);
      setTimeout(() => setDownloadSuccessToast(false), 5000);
    } catch (error) {
      console.error('Erro ao gerar o PDF vetorial:', error);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCopyCertificateFullText = () => {
    const fullText = [
      `PROGRAMA INTERINSTITUCIONAL DE EXTENSÃO, COMUNICAÇÃO CIENTÍFICA E EDUCAÇÃO EM SAÚDE`,
      `Certificado Nº 05 · Livro de Extensão nº ${editableFields.bookNumber} · Cód. ${editableFields.verificationCode}`,
      ``,
      `CERTIFICADO DE ATIVIDADE DE EXTENSÃO`,
      `A Editora Mente e Saúde (CNPJ: ${CERTIFICATE_05_META.issuer1.cnpj}), em parceria institucional com o Centro Profissionalizante Maria Dalva de Araújo (CNPJ: ${CERTIFICATE_05_META.issuer2.cnpj}), certifica para os devidos fins de comprovação curricular e acadêmica que`,
      `${editableFields.holderName}`,
      `${editableFields.holderRole} | CPF: ${editableFields.holderCpf} | ${editableFields.holderInstitution}`,
      ``,
      `participou de forma efetiva da Atividade de Extensão intitulada "${editableFields.projectTitle}", desenvolvida na modalidade de ${editableFields.editalFramingFront}, realizada no período de ${editableFields.periodText}, contabilizando carga horária total de ${editableFields.workloadText}.`,
      ``,
      `Local e Data: ${editableFields.issueLocationAndDate}`,
      `Código de Autenticidade: ${editableFields.verificationCode} | Chave de Controle: ${editableFields.controlKey}`,
      `Hash SHA-256: ${editableFields.sha256Hash}`,
      `Link Permanente de Validação Pública: ${editableFields.permanentVerificationUrl}`,
      `Site Oficial: ${editableFields.permanentBaseUrl}`,
    ].join('\n');

    navigator.clipboard.writeText(fullText);
    setCopiedFullText(true);
    setTimeout(() => setCopiedFullText(false), 2500);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] flex flex-col">
      {/* TOP BAR CONTRACT: 1 row, 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#2E1065]/12 px-4 sm:px-8 py-3.5">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#topo"
            className="font-display text-base sm:text-lg font-bold tracking-tight text-[#2E1065] whitespace-nowrap shrink-0"
          >
            Saúde Ocular · Extensão Nº 05
          </a>

          {/* Zone 2: 4 concise single-line navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#52525B]">
            <a
              href="#certificado-pdf"
              className="hover:text-[#2E1065] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Certificado PDF
            </a>
            <a
              href="#mitos-e-verdades"
              className="hover:text-[#2E1065] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Mitos e Verdades
            </a>
            <a
              href="#riscos-e-urgencia"
              className="hover:text-[#2E1065] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Riscos e Urgência SUS
            </a>
            <a
              href="#validador"
              className="hover:text-[#2E1065] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Validador Público
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#E11D48] rounded-xl hover:bg-[#BE123C] transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60 shadow-xs"
            >
              <Download className="w-4 h-4 shrink-0" />
              {isGeneratingPdf ? 'Gerando PDF Vetorial...' : 'Baixar PDF Editável/Acessível'}
            </button>
          </div>
        </div>
      </header>

      {/* Download Toast Feedback */}
      {downloadSuccessToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#047857] text-white px-5 py-3.5 rounded-xl shadow-lg flex items-center gap-3 text-xs sm:text-sm font-medium max-w-md">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div>
            <strong>PDF Vetorial Acessível Baixado!</strong> O arquivo possui texto 100%
            selecionável/copiável e links clicáveis apontando para{' '}
            <span className="underline font-mono-code">{editableFields.permanentBaseUrl}</span>.
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main id="topo" className="flex-1">
        {/* HERO SECTION */}
        <section className="pt-10 pb-14 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Editorial Presentation */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono-code text-[#52525B] flex flex-wrap items-center gap-2">
                  <span className="text-[#E11D48] font-bold">CERTIFICADO OFICIAL Nº 05</span>
                  <span aria-hidden="true">·</span>
                  <span>Cód. {editableFields.verificationCode}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    Livro {editableFields.bookNumber}, Folha {editableFields.pageNumber}
                  </span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-semibold text-[#2E1065] mt-3 leading-[1.15] tracking-tight text-balance">
                  Projeto de Extensão “Mitos e Verdades na Saúde Ocular”: Combate à Desinformação
                  nas Redes Sociais e Alerta contra Colírios Caseiros
                </h1>

                <p className="text-[#3F3F46] text-base sm:text-lg mt-4 leading-relaxed max-w-2xl">
                  Acervo público, memorial metodológico e plataforma de autenticação criptográfica
                  da ação extensionista conduzida pelo médico{' '}
                  <strong className="text-[#18181B]">Dr. Lucas Gonçalves Silveira</strong> em
                  parceria interinstitucional entre a{' '}
                  <strong className="text-[#18181B]">Editora Mente e Saúde</strong> e o{' '}
                  <strong className="text-[#18181B]">
                    Centro Profissionalizante Maria Dalva de Araújo
                  </strong>
                  .
                </p>
              </div>

              <div className="mt-7 pt-6 border-t border-[#2E1065]/12 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="px-5 py-3 rounded-xl bg-[#2E1065] text-white text-sm font-semibold hover:bg-[#4C1D95] transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer disabled:opacity-60"
                >
                  <Download className="w-4 h-4" />
                  {isGeneratingPdf
                    ? 'Gerando PDF Vetorial...'
                    : 'Baixar PDF Vetorial (Texto Copiável + Link Ativo)'}
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('certificado-pdf')}
                  className="px-5 py-3 rounded-xl bg-white border border-[#2E1065]/20 text-[#2E1065] text-sm font-semibold hover:bg-[#2E1065]/5 transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  Visualizar / Copiar do Certificado
                </button>
                <a
                  href={editableFields.permanentVerificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl text-[#047857] text-sm font-semibold hover:bg-[#047857]/8 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Link de Validação Permanente
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right Institutional Dossier Summary Card */}
            <div className="lg:col-span-5 bg-white border border-[#2E1065]/15 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#2E1065]/10">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/assets/cert/logo_editora.png"
                      alt="Editora Mente e Saúde"
                      className="w-9 h-9 object-contain"
                    />
                    <img
                      src="/assets/cert/logo_centro.png"
                      alt="Centro Maria Dalva de Araújo"
                      className="w-9 h-9 object-contain"
                    />
                  </div>
                  <span className="font-mono-code text-xs font-bold text-[#047857]">
                    ✓ PDF VETORIAL &amp; ACESSÍVEL
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <div className="text-xs text-[#52525B]">Profissional Titular Certificado</div>
                    <div className="font-display text-lg font-semibold text-[#2E1065]">
                      {editableFields.holderName}
                    </div>
                    <div className="font-mono-code text-xs text-[#3F3F46]">
                      {editableFields.holderRole} · CPF: {editableFields.holderCpf} ·{' '}
                      {editableFields.holderInstitution}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#2E1065]/10">
                    <div className="text-xs text-[#52525B]">
                      Link Oficial de Validação Permanente (No Certificado e QR Code)
                    </div>
                    <a
                      href={editableFields.permanentVerificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono-code font-semibold text-[#047857] text-xs underline hover:text-[#2E1065] break-all block mt-0.5"
                    >
                      {editableFields.permanentBaseUrl}
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#2E1065]/10 font-mono-code text-xs">
                    <div>
                      <span className="text-[#52525B] block font-sans-ui">Período:</span>
                      <strong className="text-[#18181B]">12 a 14/06/2024</strong>
                    </div>
                    <div>
                      <span className="text-[#52525B] block font-sans-ui">Carga Horária:</span>
                      <strong className="text-[#2E1065]">{editableFields.workloadText}</strong>
                    </div>
                    <div>
                      <span className="text-[#52525B] block font-sans-ui">Código Oficial:</span>
                      <strong className="text-[#E11D48]">{editableFields.verificationCode}</strong>
                    </div>
                    <div>
                      <span className="text-[#52525B] block font-sans-ui">Chave de Controle:</span>
                      <strong className="text-[#18181B]">{editableFields.controlKey}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-[#2E1065]/10 flex items-center justify-between text-xs text-[#52525B]">
                <span>Emissão: {editableFields.issueLocationAndDate}</span>
                <span className="font-mono-code font-semibold text-[#2E1065]">
                  Texto 100% Copiável
                </span>
              </div>
            </div>
          </div>

          {/* 4-Column Quantitative Impact Strip Below Hero Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[#2E1065]/10">
            {CAMPAIGN_IMPACT_METRICS.map((metric) => (
              <div
                key={metric.label}
                className="bg-white border border-[#2E1065]/12 rounded-xl p-5"
              >
                <div className="text-xs text-[#52525B] font-medium">{metric.label}</div>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="font-display text-2xl sm:text-3xl font-bold text-[#2E1065] font-mono-code">
                    {metric.value}
                  </span>
                  <span className="text-xs font-mono-code text-[#E11D48] font-semibold">
                    {metric.unit}
                  </span>
                </div>
                <p className="text-xs text-[#52525B] mt-2 leading-relaxed">{metric.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 1: ACCESSIBLE & EDITABLE PDF-STYLE CERTIFICATE VIEWER (FRENTE E VERSO) */}
        <section
          id="certificado-pdf"
          className="py-14 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto border-t border-[#2E1065]/10"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
            <div>
              <div className="text-xs font-mono-code uppercase tracking-widest text-[#2E1065] font-semibold">
                01. PDF Vetorial Acessível &amp; Editável · Texto 100% Selecionável e Link Infinito
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#2E1065] mt-1.5">
                Certificado Nº 05 (Frente e Verso) — Padrão Editável com Link Ativo
              </h2>
              <p className="text-sm text-[#52525B] mt-1 max-w-3xl">
                Selecione e copie qualquer texto diretamente nas laudas abaixo ou no arquivo{' '}
                <strong>.PDF vetorial baixado</strong>. Os links e QR Codes apontam permanentemente
                para{' '}
                <a
                  href={editableFields.permanentVerificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono-code text-[#047857] underline font-semibold hover:text-[#2E1065]"
                >
                  {editableFields.permanentBaseUrl}
                </a>
                .
              </p>
            </div>

            {/* PDF Viewer Controls Bar */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {/* Page Selector Segmented Control */}
              <div className="flex items-center gap-1 p-1 bg-[#F3F0EB] border border-[#2E1065]/12 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActivePageFilter('both')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    activePageFilter === 'both'
                      ? 'bg-[#2E1065] text-white'
                      : 'text-[#52525B] hover:text-[#2E1065]'
                  }`}
                >
                  Frente + Verso (2 Laudas)
                </button>
                <button
                  type="button"
                  onClick={() => setActivePageFilter('front')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    activePageFilter === 'front'
                      ? 'bg-[#2E1065] text-white'
                      : 'text-[#52525B] hover:text-[#2E1065]'
                  }`}
                >
                  Lauda 1 (Frente)
                </button>
                <button
                  type="button"
                  onClick={() => setActivePageFilter('back')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    activePageFilter === 'back'
                      ? 'bg-[#2E1065] text-white'
                      : 'text-[#52525B] hover:text-[#2E1065]'
                  }`}
                >
                  Lauda 2 (Verso)
                </button>
              </div>

              {/* Edit Mode Toggle */}
              <button
                type="button"
                onClick={() => setIsEditMode((prev) => !prev)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isEditMode
                    ? 'bg-[#047857] text-white border-[#047857]'
                    : 'bg-white text-[#2E1065] border-[#2E1065]/20 hover:bg-[#2E1065]/5'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                {isEditMode ? 'Concluir Edição' : 'Editar Texto'}
              </button>

              {isEditMode && (
                <button
                  type="button"
                  onClick={handleResetEditableFields}
                  title="Restaurar texto original"
                  className="px-3 py-2 rounded-xl text-xs font-medium bg-white border border-[#2E1065]/20 text-[#52525B] hover:text-[#E11D48] inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restaurar
                </button>
              )}

              {/* Copy Full Text Button */}
              <button
                type="button"
                onClick={handleCopyCertificateFullText}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-[#2E1065]/20 text-[#2E1065] hover:bg-[#2E1065]/5 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                {copiedFullText ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#047857]" />
                    Texto Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar Dados
                  </>
                )}
              </button>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-white border border-[#2E1065]/15 rounded-xl px-2 py-1">
                <button
                  type="button"
                  onClick={() =>
                    setViewerScale((s) => Math.max(0.5, Number((s - 0.08).toFixed(2))))
                  }
                  title="Reduzir Zoom"
                  className="p-1.5 text-[#2E1065] hover:bg-[#FAF8F5] rounded-lg cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="font-mono-code text-xs font-semibold text-[#2E1065] px-1.5">
                  {Math.round(viewerScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setViewerScale((s) => Math.min(1.15, Number((s + 0.08).toFixed(2))))
                  }
                  title="Aumentar Zoom"
                  className="p-1.5 text-[#2E1065] hover:bg-[#FAF8F5] rounded-lg cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewerScale(1)}
                  title="Tamanho Real 100%"
                  className="p-1.5 text-[#2E1065] hover:bg-[#FAF8F5] rounded-lg cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Download Vector PDF CTA */}
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="px-4 py-2.5 rounded-xl bg-[#E11D48] text-white text-xs font-semibold hover:bg-[#BE123C] transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer disabled:opacity-60"
              >
                <Download className="w-4 h-4" />
                {isGeneratingPdf ? 'Exportando...' : 'Download PDF Vetorial Editável'}
              </button>
            </div>
          </div>

          {isEditMode && (
            <div className="mb-4 p-3.5 rounded-xl bg-[#ECFDF5] border border-[#047857]/30 text-xs text-[#065F46] flex items-center justify-between gap-4">
              <span>
                <strong>Modo de Edição Ativo:</strong> Clique diretamente sobre qualquer texto
                destacado no certificado abaixo para editar. Todas as alterações serão salvas no PDF
                vetorial exportado sem perda de formatação.
              </span>
            </div>
          )}

          {/* PDF Reader Frame */}
          <div
            ref={viewerContainerRef}
            className="bg-[#1E1B2E] border border-[#2E1065]/30 rounded-2xl p-4 sm:p-8 overflow-x-auto shadow-inner"
          >
            {/* Reader Top Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-white/10 text-xs font-mono-code text-white/80">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#FDA4AF]" />
                <span>
                  Certificado_Extensao_05_{editableFields.verificationCode}
                  _Lucas_Goncalves_Silveira.pdf (Vetorial · Texto Selecionável · Links Clicáveis)
                </span>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href={editableFields.permanentVerificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6EE7B7] hover:underline inline-flex items-center gap-1"
                >
                  <span>{editableFields.permanentBaseUrl}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="text-white hover:text-[#FDA4AF] inline-flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir PDF Nativo
                </button>
              </div>
            </div>

            {/* Certificate Pages Container with Native CSS Zoom for Accurate Text Selection & Link Clicking */}
            <div className="flex flex-col items-center gap-8">
              {(activePageFilter === 'both' || activePageFilter === 'front') && (
                <div className="flex flex-col items-center">
                  <div className="text-xs font-mono-code text-white/70 mb-2">
                    LAUDA 01 / 02 — FRENTE DO CERTIFICADO (TEXTO SELECIONÁVEL / COPIÁVEL E LINK
                    PERMANENTE ATIVO)
                  </div>
                  <div
                    style={{
                      zoom: viewerScale,
                    }}
                    className="rounded-xs shadow-2xl"
                  >
                    <CertificateFrontPage
                      fields={editableFields}
                      isEditable={isEditMode}
                      onUpdateField={handleUpdateField}
                      qrSvgRef={qrSvgRef}
                    />
                  </div>
                </div>
              )}

              {(activePageFilter === 'both' || activePageFilter === 'back') && (
                <div className="flex flex-col items-center">
                  <div className="text-xs font-mono-code text-white/70 mb-2">
                    LAUDA 02 / 02 — VERSO: MEMORIAL DESCRITIVO E REGISTRO ACADÊMICO (ITEM 08)
                  </div>
                  <div
                    style={{
                      zoom: viewerScale,
                    }}
                    className="rounded-xs shadow-2xl"
                  >
                    <CertificateBackPage
                      fields={editableFields}
                      isEditable={isEditMode}
                      onUpdateField={handleUpdateField}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE MYTHS VS TRUTHS CARDS */}
        <InteractiveMythsSection />

        {/* SECTION 3: CLINICAL RISK PANEL & SUS EMERGENCY FLOW */}
        <ClinicalRiskAndSusSection />

        {/* SECTION 4: PUBLIC AUTHENTICATOR & CRYPTOGRAPHIC REGISTRY */}
        <PublicAuthenticatorSection
          verificationUrl={editableFields.permanentVerificationUrl}
          onDownloadPdf={handleDownloadPdf}
          isGeneratingPdf={isGeneratingPdf}
          onScrollToViewer={() => scrollToSection('certificado-pdf')}
        />
      </main>

      {/* HIDDEN QR & PRINT AREA FOR BROWSER NATIVE VECTOR PRINT (CTRL+P) */}
      <div
        aria-hidden="true"
        className="print-area"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '0px',
          width: '1122px',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <div className="print-page-break">
          <CertificateFrontPage
            fields={editableFields}
            qrSvgRef={activePageFilter === 'back' ? qrSvgRef : undefined}
          />
        </div>
        <div>
          <CertificateBackPage fields={editableFields} />
        </div>
      </div>

      {/* INSTITUTIONAL FOOTER */}
      <footer className="bg-[#1E1B2E] text-white/80 py-10 px-4 sm:px-6 lg:px-8 border-t border-[#2E1065]/20 mt-12">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-white font-display font-semibold text-base">
              <Award className="w-4 h-4 text-[#FDA4AF]" />
              <span>
                Programa Interinstitucional de Extensão, Comunicação Científica e Educação em Saúde
              </span>
            </div>
            <p className="text-xs text-white/70">
              {CERTIFICATE_05_META.issuer1.name} (CNPJ: {CERTIFICATE_05_META.issuer1.cnpj}) ·{' '}
              {CERTIFICATE_05_META.issuer2.name} (CNPJ: {CERTIFICATE_05_META.issuer2.cnpj})
            </p>
            <p className="text-xs font-mono-code text-white/60">
              Certificado Nº 05 · Cód. {editableFields.verificationCode} · Chave{' '}
              {editableFields.controlKey} · Link Permanente:{' '}
              <a
                href={editableFields.permanentVerificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6EE7B7] underline"
              >
                {editableFields.permanentBaseUrl}
              </a>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => scrollToSection('certificado-pdf')}
              className="px-3.5 py-2 rounded-lg bg-white/10 text-white text-xs font-medium hover:bg-white/15 transition-colors cursor-pointer"
            >
              Ver Certificado A4
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 rounded-lg bg-[#E11D48] text-white text-xs font-semibold hover:bg-[#BE123C] transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <Download className="w-3.5 h-3.5" />
              Baixar PDF Vetorial Editável
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
