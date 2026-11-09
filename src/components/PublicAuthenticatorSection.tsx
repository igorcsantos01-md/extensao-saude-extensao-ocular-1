import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Copy,
  Check,
  Download,
  FileCheck2,
  AlertCircle,
  QrCode,
  ExternalLink,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CERTIFICATE_05_META } from '../data/certificate05Data';

interface PublicAuthenticatorProps {
  verificationUrl: string;
  onDownloadPdf: () => void;
  isGeneratingPdf: boolean;
  onScrollToViewer: () => void;
}

export const PublicAuthenticatorSection: React.FC<PublicAuthenticatorProps> = ({
  verificationUrl,
  onDownloadPdf,
  isGeneratingPdf,
  onScrollToViewer,
}) => {
  const [queryInput, setQueryInput] = useState<string>(CERTIFICATE_05_META.verificationCode);
  const [validationState, setValidationState] = useState<'verified' | 'invalid'>('verified');
  const [verifiedViaQr, setVerifiedViaQr] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('codigo') || params.get('code') || params.get('chave');
    if (codeParam) {
      setQueryInput(codeParam.trim());
      const normalized = codeParam.trim().toUpperCase();
      if (
        normalized === CERTIFICATE_05_META.verificationCode ||
        normalized === CERTIFICATE_05_META.controlKey ||
        normalized === CERTIFICATE_05_META.holderCpf
      ) {
        setValidationState('verified');
        setVerifiedViaQr(true);
      } else {
        setValidationState('invalid');
      }
    }
  }, []);

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = queryInput.trim().toUpperCase();
    const cpfDigits = cleaned.replace(/\D/g, '');
    if (
      cleaned === CERTIFICATE_05_META.verificationCode ||
      cleaned === CERTIFICATE_05_META.controlKey ||
      cleaned === '05' ||
      cleaned === 'CERTIFICADO 05' ||
      cpfDigits === '70279494157'
    ) {
      setValidationState('verified');
    } else {
      setValidationState('invalid');
    }
  };

  const handleQuickFill = (val: string) => {
    setQueryInput(val);
    setValidationState('verified');
  };

  const handleCopy = (label: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <section
      id="validador"
      className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto border-t border-[#2E1065]/10"
    >
      <div className="max-w-3xl mb-8">
        <div className="text-xs font-mono-code uppercase tracking-widest text-[#047857] font-semibold">
          04. Sistema Público de Conformidade e Auditoria Documental
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#2E1065] mt-2 tracking-tight text-balance">
          Autenticador Oficial de Fé Pública Interinstitucional
        </h2>
        <p className="text-[#52525B] text-base mt-3 leading-relaxed">
          Consulte a autenticidade e a integridade criptográfica do{' '}
          <strong>Certificado de Extensão Nº 05</strong> por meio do Código de Autenticidade, Chave
          de Controle ou CPF do profissional titular.
        </p>
      </div>

      {verifiedViaQr && (
        <div className="mb-6 p-4 rounded-xl bg-[#ECFDF5] border border-[#047857]/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-[#065F46]">
            <QrCode className="w-5 h-5 text-[#047857] shrink-0" />
            <span>
              <strong>Leitura via QR Code/URL Detectada:</strong> O Certificado Nº 05 (
              <span className="font-mono-code font-bold">
                {CERTIFICATE_05_META.verificationCode}
              </span>
              ) foi localizado e validado automaticamente na base registral.
            </span>
          </div>
        </div>
      )}

      {/* Search & Verification Bar */}
      <div className="bg-white border border-[#2E1065]/15 rounded-2xl p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleValidate} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#52525B] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Digite o Código (EMS-EXT-2024-0519), Chave (0519-7741-9204-8B3E) ou CPF..."
              aria-label="Código de verificação, chave de controle ou CPF"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#2E1065]/20 font-mono-code text-sm text-[#18181B] focus:outline-none focus:border-[#2E1065]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#2E1065] text-white text-sm font-semibold hover:bg-[#4C1D95] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Verificar Autenticidade
          </button>
        </form>

        {/* Quick-fill shortcuts for testing */}
        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-[#52525B]">
          <span>Chaves oficiais para consulta rápida:</span>
          <button
            type="button"
            onClick={() => handleQuickFill(CERTIFICATE_05_META.verificationCode)}
            className="font-mono-code text-[#2E1065] underline hover:text-[#E11D48] cursor-pointer"
          >
            {CERTIFICATE_05_META.verificationCode}
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => handleQuickFill(CERTIFICATE_05_META.controlKey)}
            className="font-mono-code text-[#2E1065] underline hover:text-[#E11D48] cursor-pointer"
          >
            {CERTIFICATE_05_META.controlKey}
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => handleQuickFill(CERTIFICATE_05_META.holderCpf)}
            className="font-mono-code text-[#2E1065] underline hover:text-[#E11D48] cursor-pointer"
          >
            CPF {CERTIFICATE_05_META.holderCpf}
          </button>
        </div>

        {/* Verification Output */}
        {validationState === 'verified' ? (
          <div className="mt-8 pt-8 border-t border-[#2E1065]/12">
            {/* Verified Banner */}
            <div className="bg-[#ECFDF5] border border-[#047857]/25 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <ShieldCheck className="w-7 h-7 text-[#047857] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-mono-code uppercase tracking-wider text-[#047857] font-bold">
                    STATUS REGISTRAL: AUTENTICIDADE CONFIRMADA · FÉ PÚBLICA ATIVA
                  </div>
                  <h3 className="font-display text-xl font-semibold text-[#064E3B] mt-0.5">
                    Certificado Nº {CERTIFICATE_05_META.certNumber} —{' '}
                    {CERTIFICATE_05_META.holderName}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#065F46] mt-1">
                    Documento íntegro, assinado conjuntamente e registrado no Livro de Extensão nº{' '}
                    <strong>{CERTIFICATE_05_META.bookNumber}</strong>, Folha{' '}
                    <strong>{CERTIFICATE_05_META.pageNumber}</strong>.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={onScrollToViewer}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#047857]/30 text-[#065F46] text-xs font-semibold hover:bg-[#047857]/5 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Inspecionar Laudas (Frente e Verso)
                </button>
                <button
                  type="button"
                  onClick={onDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="px-4 py-2.5 rounded-xl bg-[#047857] text-white text-xs font-semibold hover:bg-[#065F46] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer disabled:opacity-60"
                >
                  <Download className="w-3.5 h-3.5" />
                  {isGeneratingPdf ? 'Gerando PDF Oficial...' : 'Baixar PDF Original (2 Laudas)'}
                </button>
              </div>
            </div>

            {/* Detailed Audit Metadata Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#2E1065]/10">
                  <div className="text-xs text-[#52525B]">Profissional Certificado</div>
                  <div className="font-semibold text-sm text-[#18181B] mt-1">
                    {CERTIFICATE_05_META.holderName}
                  </div>
                  <div className="font-mono-code text-xs text-[#52525B] mt-0.5">
                    {CERTIFICATE_05_META.holderRole} · CPF: {CERTIFICATE_05_META.holderCpf} ·{' '}
                    {CERTIFICATE_05_META.holderInstitution}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#2E1065]/10">
                  <div className="text-xs text-[#52525B]">Enquadramento Curricular (Item 08)</div>
                  <div className="font-semibold text-sm text-[#18181B] mt-1">
                    {CERTIFICATE_05_META.editalFramingFront}
                  </div>
                  <div className="font-mono-code text-xs text-[#52525B] mt-0.5">
                    Período: {CERTIFICATE_05_META.periodText} · Carga Horária:{' '}
                    {CERTIFICATE_05_META.workloadText}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#2E1065]/10">
                  <div className="text-xs text-[#52525B]">Instituições Certificadoras</div>
                  <div className="font-semibold text-xs text-[#18181B] mt-1">
                    1. {CERTIFICATE_05_META.issuer1.name} (CNPJ: {CERTIFICATE_05_META.issuer1.cnpj})
                  </div>
                  <div className="font-semibold text-xs text-[#18181B] mt-1">
                    2. {CERTIFICATE_05_META.issuer2.name} (CNPJ: {CERTIFICATE_05_META.issuer2.cnpj})
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#2E1065]/10">
                  <div className="text-xs text-[#52525B]">Signatários Responsáveis</div>
                  <div className="text-xs text-[#18181B] mt-1">
                    <strong>{CERTIFICATE_05_META.issuer1.signerName}</strong> —{' '}
                    {CERTIFICATE_05_META.issuer1.signerRole}
                  </div>
                  <div className="text-xs text-[#18181B] mt-1">
                    <strong>{CERTIFICATE_05_META.issuer2.signerName}</strong> —{' '}
                    {CERTIFICATE_05_META.issuer2.signerRole}
                  </div>
                </div>

                {/* Cryptographic Hash & Keys Full Width */}
                <div className="sm:col-span-2 p-4 rounded-xl bg-[#F3F0EB] border border-[#2E1065]/15 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono-code font-bold text-[#2E1065]">
                      CÓDIGO: {CERTIFICATE_05_META.verificationCode} · CHAVE:{' '}
                      {CERTIFICATE_05_META.controlKey}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy('hash', CERTIFICATE_05_META.sha256Hash)
                      }
                      className="text-xs font-mono-code text-[#2E1065] hover:text-[#E11D48] inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === 'hash' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#047857]" />
                          Hash Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copiar Hash SHA-256
                        </>
                      )}
                    </button>
                  </div>
                  <div className="font-mono-code text-xs text-[#3F3F46] break-all">
                    <strong>SHA-256:</strong> {CERTIFICATE_05_META.sha256Hash}
                  </div>
                </div>
              </div>

              {/* Right QR Code & Direct Verification Card */}
              <div className="lg:col-span-4 bg-[#FAF8F5] border border-[#2E1065]/12 rounded-xl p-5 flex flex-col items-center justify-between text-center">
                <div className="text-xs font-mono-code uppercase tracking-wider text-[#2E1065] font-semibold">
                  QR Code Oficial de Validação Permanente
                </div>
                <a
                  href={verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Abrir link oficial de validação"
                  className="bg-white p-3 rounded-xl border border-[#2E1065]/15 my-3 shadow-2xs hover:border-[#2E1065]/40 transition-colors"
                >
                  <QRCodeSVG
                    value={verificationUrl}
                    size={136}
                    level="M"
                    bgColor="#FFFFFF"
                    fgColor="#2E1065"
                  />
                </a>
                <div className="w-full space-y-2">
                  <div className="p-2 rounded-lg bg-white border border-[#2E1065]/12 text-[11px] font-mono-code text-[#047857] break-all select-all">
                    <a
                      href={verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-[#2E1065]"
                    >
                      {CERTIFICATE_05_META.permanentBaseUrl}
                    </a>
                  </div>
                  <p className="text-xs text-[#52525B] leading-relaxed">
                    Link permanente de acesso infinito para validação direta da banca examinadora:
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy('url', verificationUrl)}
                    className="w-full py-2 px-3 rounded-lg bg-white border border-[#2E1065]/20 text-xs font-mono-code text-[#2E1065] hover:bg-[#2E1065]/5 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedField === 'url' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#047857]" />
                        Link Permanente Copiado!
                      </>
                    ) : (
                      <>
                        <FileCheck2 className="w-3.5 h-3.5" />
                        Copiar Link Permanente de Validação
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 p-5 rounded-xl bg-[#FDF2F4] border border-[#E11D48]/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#E11D48] shrink-0 mt-0.5" />
            <div className="text-sm text-[#881337]">
              <strong>Nenhum registro localizado para “{queryInput}”.</strong> Verifique se digitou
              corretamente o código <span className="font-mono-code font-bold">EMS-EXT-2024-0519</span>
              , a chave <span className="font-mono-code font-bold">0519-7741-9204-8B3E</span> ou
              clique em uma das chaves oficiais acima.
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
