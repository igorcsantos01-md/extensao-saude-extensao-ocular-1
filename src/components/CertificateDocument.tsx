import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CERTIFICATE_05_META } from '../data/certificate05Data';
import { EditableCertificateFields } from '../utils/generateVectorCertificatePdf';

interface CertificateFrontProps {
  fields: EditableCertificateFields;
  isEditable?: boolean;
  onUpdateField?: <K extends keyof EditableCertificateFields>(
    key: K,
    value: EditableCertificateFields[K]
  ) => void;
  qrSvgRef?: React.RefObject<SVGSVGElement | null>;
  pageRef?: React.RefObject<HTMLDivElement | null>;
}

export const CertificateFrontPage: React.FC<CertificateFrontProps> = ({
  fields,
  isEditable = false,
  onUpdateField,
  qrSvgRef,
  pageRef,
}) => {
  const editableClass = isEditable
    ? 'outline-1 outline-dashed outline-[#4C1D95]/50 bg-[#4C1D95]/5 px-1 rounded-xs focus:outline-2 focus:outline-[#E11D48] focus:bg-white cursor-text'
    : '';

  return (
    <div
      ref={pageRef}
      className="cert-a4-page select-text shadow-2xl"
      style={{
        width: '1122px',
        height: '793px',
        backgroundColor: '#FAF9F6',
        color: '#1C252C',
      }}
    >
      {/* Outer Frame (#0F4C3A) */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: '18px',
          border: '2px solid #0F4C3A',
        }}
      />
      {/* Inner Frame (#1B365D) */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: '24px',
          border: '1px solid #1B365D',
        }}
      />

      {/* Corner Ornaments */}
      <div className="absolute top-[21px] left-[21px] w-3 h-3 border-t-2 border-l-2 border-[#0F4C3A] pointer-events-none" />
      <div className="absolute top-[21px] right-[21px] w-3 h-3 border-t-2 border-r-2 border-[#0F4C3A] pointer-events-none" />
      <div className="absolute bottom-[21px] left-[21px] w-3 h-3 border-b-2 border-l-2 border-[#0F4C3A] pointer-events-none" />
      <div className="absolute bottom-[21px] right-[21px] w-3 h-3 border-b-2 border-r-2 border-[#0F4C3A] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col justify-between px-[54px] pt-[38px] pb-[30px] select-text">
        {/* TOP HEADER */}
        <div>
          <div className="grid grid-cols-12 items-center gap-2 pb-3 border-b border-[#0F4C3A]/20">
            {/* Left Institution: Editora Mente e Saude */}
            <div className="col-span-4 flex items-center gap-3">
              <img
                src="/assets/cert/logo_editora.png"
                alt="Logo Editora Mente e Saúde"
                className="w-[66px] h-[66px] object-contain shrink-0 pointer-events-none"
              />
              <div className="leading-tight select-text">
                <div className="font-sans-ui font-bold text-[15px] tracking-tight text-[#0F4C3A]">
                  EDITORA MENTE E SAÚDE
                </div>
                <div className="font-mono-code font-semibold text-[10.5px] text-[#1C252C] mt-0.5">
                  CNPJ: {CERTIFICATE_05_META.issuer1.cnpj}
                </div>
                <div className="font-sans-ui font-medium text-[10px] text-[#156B4E] mt-0.5">
                  Conselho Editorial e Extensão Científica
                </div>
              </div>
            </div>

            {/* Center Program Header */}
            <div className="col-span-4 text-center px-1 select-text">
              <div className="font-sans-ui font-bold text-[10.5px] tracking-[0.06em] uppercase text-[#1C252C] leading-[1.35]">
                PROGRAMA INTERINSTITUCIONAL DE EXTENSÃO, COMUNICAÇÃO CIENTÍFICA
                <br />E EDUCAÇÃO EM SAÚDE
              </div>
              <div className="font-mono-code font-semibold text-[10px] text-[#1C252C] mt-1.5 tracking-tight">
                Certificado Nº {CERTIFICATE_05_META.certNumber} · Livro de Extensão nº{' '}
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdateField?.('bookNumber', e.currentTarget.textContent || fields.bookNumber)
                  }
                  className={editableClass}
                >
                  {fields.bookNumber}
                </span>{' '}
                · Cód.{' '}
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdateField?.(
                      'verificationCode',
                      e.currentTarget.textContent || fields.verificationCode
                    )
                  }
                  className={editableClass}
                >
                  {fields.verificationCode}
                </span>
              </div>
            </div>

            {/* Right Institution: Centro Profissionalizante Maria Dalva de Araujo */}
            <div className="col-span-4 flex items-center justify-end gap-3 text-right select-text">
              <div className="leading-tight">
                <div className="font-sans-ui font-bold text-[14px] tracking-tight text-[#1B365D]">
                  CENTRO PROFISSIONALIZANTE
                  <br />
                  MARIA DALVA DE ARAÚJO
                </div>
                <div className="font-mono-code font-semibold text-[10.5px] text-[#1C252C] mt-0.5">
                  CNPJ: {CERTIFICATE_05_META.issuer2.cnpj}
                </div>
              </div>
              <img
                src="/assets/cert/logo_centro.png"
                alt="Logo Centro Profissionalizante Maria Dalva de Araújo"
                className="w-[66px] h-[66px] object-contain shrink-0 pointer-events-none"
              />
            </div>
          </div>

          {/* MAIN CERTIFICATE TITLE */}
          <div className="text-center mt-5 select-text">
            <h1 className="font-cert-serif font-bold text-[33px] tracking-[0.06em] text-[#0F4C3A] uppercase leading-none">
              CERTIFICADO DE ATIVIDADE DE EXTENSÃO
            </h1>
            <p className="font-sans-ui text-[13.5px] text-[#2C353D] mt-3 max-w-[920px] mx-auto leading-[1.45]">
              A <strong className="font-semibold text-[#1C252C]">Editora Mente e Saúde</strong> (CNPJ:{' '}
              {CERTIFICATE_05_META.issuer1.cnpj}), em parceria institucional com o{' '}
              <strong className="font-semibold text-[#1C252C]">
                Centro Profissionalizante Maria Dalva de Araújo
              </strong>{' '}
              (CNPJ: {CERTIFICATE_05_META.issuer2.cnpj}), certifica para os devidos fins de comprovação
              curricular e acadêmica que
            </p>
          </div>

          {/* HOLDER HIGHLIGHT BOX */}
          <div className="mt-3.5 mx-auto max-w-[940px] bg-[#F3F1EA] border border-[#D5CFC2] py-3 px-6 text-center select-text">
            <div
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdateField?.('holderName', e.currentTarget.textContent || fields.holderName)
              }
              className={`font-cert-serif font-bold text-[28px] tracking-[0.04em] text-[#14233C] leading-tight ${editableClass}`}
            >
              {fields.holderName}
            </div>
            <div className="font-sans-ui font-bold text-[13.5px] text-[#2C353D] mt-0.5">
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdateField?.('holderRole', e.currentTarget.textContent || fields.holderRole)
                }
                className={editableClass}
              >
                {fields.holderRole}
              </span>{' '}
              | CPF:{' '}
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdateField?.('holderCpf', e.currentTarget.textContent || fields.holderCpf)
                }
                className={editableClass}
              >
                {fields.holderCpf}
              </span>{' '}
              |{' '}
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdateField?.(
                    'holderInstitution',
                    e.currentTarget.textContent || fields.holderInstitution
                  )
                }
                className={editableClass}
              >
                {fields.holderInstitution}
              </span>
            </div>
          </div>

          {/* BODY PARAGRAPHS */}
          <div className="mt-4 mx-auto max-w-[940px] font-sans-ui text-[13.6px] text-[#1C252C] leading-[1.55] text-justify space-y-2.5 select-text">
            <p>
              participou de forma efetiva da{' '}
              <strong className="font-bold text-[#0F172A]">Atividade de Extensão</strong> intitulada{' '}
              <strong className="font-bold text-[#0F172A]">
                “
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdateField?.(
                      'projectTitle',
                      e.currentTarget.textContent || fields.projectTitle
                    )
                  }
                  className={editableClass}
                >
                  {fields.projectTitle}
                </span>
                ”
              </strong>
              , desenvolvida na modalidade de{' '}
              <strong
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdateField?.(
                    'editalFramingFront',
                    e.currentTarget.textContent || fields.editalFramingFront
                  )
                }
                className={`font-bold text-[#0F172A] ${editableClass}`}
              >
                {fields.editalFramingFront}
              </strong>
              , realizada no período de{' '}
              <strong
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdateField?.('periodText', e.currentTarget.textContent || fields.periodText)
                }
                className={`font-bold text-[#0F172A] ${editableClass}`}
              >
                {fields.periodText}
              </strong>
              , contabilizando carga horária total de{' '}
              <strong
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdateField?.('workloadText', e.currentTarget.textContent || fields.workloadText)
                }
                className={`font-bold text-[#0F172A] ${editableClass}`}
              >
                {fields.workloadText}
              </strong>
              .
            </p>
            <p>
              No âmbito desta ação extensionista, o profissional atuou na curadoria médico-científica em
              página virtual de saúde e aplicação de cards e enquetes digitais interativas de “Mito ou
              Verdade” para{' '}
              <strong className="font-bold text-[#0F172A]">coleta de dados populacionais</strong> sobre
              automedicação ocular, elaboração e distribuição comunitária gratuita de materiais
              educativos (folhetos e mini e-book de prevenção à cegueira evitável),{' '}
              <strong className="font-bold text-[#0F172A]">
                comunicação científica para combate à desinformação (fake news)
              </strong>{' '}
              sobre colírios e receitas caseiras perigosas, e{' '}
              <strong className="font-bold text-[#0F172A]">
                divulgação dos canais oficiais de urgência oftalmológica do SUS
              </strong>
              .
            </p>
          </div>

          {/* LOCATION & ISSUE DATE */}
          <div className="text-center mt-3.5 select-text">
            <span
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdateField?.(
                  'issueLocationAndDate',
                  e.currentTarget.textContent || fields.issueLocationAndDate
                )
              }
              className={`font-cert-italic italic font-semibold text-[18px] text-[#1C252C] ${editableClass}`}
            >
              {fields.issueLocationAndDate}
            </span>
          </div>
        </div>

        {/* BOTTOM SIGNATURES, SEAL & QR AUTHENTICATION */}
        <div className="select-text">
          <div className="grid grid-cols-12 items-end gap-3 pt-1">
            {/* Left Signature: Barbara Lima dos Santos */}
            <div className="col-span-4 text-center px-2">
              <div className="h-[54px] flex items-end justify-center mb-0.5">
                <img
                  src="/assets/cert/sig_barbara.png"
                  alt="Assinatura Bárbara Lima dos Santos"
                  className="max-h-[52px] w-auto object-contain pointer-events-none"
                />
              </div>
              <div className="border-t border-[#1C252C]/70 pt-1.5">
                <div className="font-sans-ui font-bold text-[11.5px] text-[#1C252C] tracking-wide">
                  {CERTIFICATE_05_META.issuer1.signerName}
                </div>
                <div className="font-sans-ui text-[10px] text-[#334155] mt-0.5">
                  {CERTIFICATE_05_META.issuer1.signerRole}
                </div>
                <div className="font-mono-code font-bold text-[9px] text-[#1C252C] mt-0.5">
                  Editora Mente e Saúde (CNPJ: {CERTIFICATE_05_META.issuer1.cnpj})
                </div>
              </div>
            </div>

            {/* Center Official Seal + QR Code Box */}
            <div className="col-span-4 flex items-center justify-center gap-2.5">
              {/* Official Gold Seal */}
              <div className="w-[82px] h-[82px] rounded-full border-2 border-[#C59B27] bg-[#FDFBF3] flex flex-col items-center justify-center p-1 shadow-xs shrink-0 relative">
                <div className="absolute inset-[3px] rounded-full border border-dashed border-[#C59B27]/80 pointer-events-none" />
                <div className="text-[7px] text-[#B08618] tracking-widest leading-none">★ ★ ★</div>
                <div className="font-sans-ui font-bold text-[7.5px] text-[#785908] uppercase tracking-wider mt-1 leading-tight text-center">
                  SELO OFICIAL
                  <br />
                  FÉ PÚBLICA
                </div>
                <div className="font-mono-code font-bold text-[6.3px] text-[#8E6B0D] mt-1 tracking-tighter">
                  {fields.verificationCode}
                </div>
                <div className="text-[7px] text-[#B08618] tracking-widest leading-none mt-0.5">
                  ★ ★ ★
                </div>
              </div>

              {/* QR & Manual Verification Box */}
              <div className="bg-white border border-[#CBD5E1] rounded px-2.5 py-2 flex items-center gap-2.5 shadow-2xs">
                <a
                  href={fields.permanentVerificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Clique para abrir o autenticador público oficial"
                  className="shrink-0 bg-white p-0.5 hover:opacity-90 transition-opacity"
                >
                  <QRCodeSVG
                    ref={qrSvgRef}
                    value={fields.permanentVerificationUrl}
                    size={72}
                    level="M"
                    bgColor="#FFFFFF"
                    fgColor="#111827"
                  />
                </a>
                <div className="text-left leading-[1.28]">
                  <div className="font-sans-ui font-bold text-[8.5px] text-[#0F4C3A] uppercase tracking-wider">
                    AUTENTICAÇÃO PÚBLICA MANUAL
                  </div>
                  <div className="font-mono-code text-[8.8px] text-[#1C252C] mt-0.5">
                    <strong>Cód.:</strong> {fields.verificationCode}
                  </div>
                  <div className="font-mono-code text-[8.8px] text-[#1C252C]">
                    <strong>Chave:</strong> {fields.controlKey}
                  </div>
                  <div className="font-sans-ui font-bold text-[8px] text-[#1C252C] mt-0.5">
                    Endereço p/ Verificação Online:
                  </div>
                  <a
                    href={fields.permanentVerificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono-code text-[7.5px] text-[#0F4C3A] underline hover:text-[#E11D48] break-all max-w-[148px] block"
                  >
                    {fields.permanentBaseUrl}
                  </a>
                </div>
              </div>
            </div>

            {/* Right Signature: James Araujo de Santana */}
            <div className="col-span-4 text-center px-2">
              <div className="h-[54px] flex items-end justify-center mb-0.5">
                <img
                  src="/assets/cert/sig_james.png"
                  alt="Assinatura James Araújo de Santana"
                  className="max-h-[52px] w-auto object-contain pointer-events-none"
                />
              </div>
              <div className="border-t border-[#1C252C]/70 pt-1.5">
                <div className="font-sans-ui font-bold text-[11.5px] text-[#1C252C] tracking-wide">
                  {CERTIFICATE_05_META.issuer2.signerName}
                </div>
                <div className="font-sans-ui text-[10px] text-[#334155] mt-0.5">
                  {CERTIFICATE_05_META.issuer2.signerRole}
                </div>
                <div className="font-mono-code font-bold text-[8.5px] text-[#1C252C] mt-0.5 leading-tight">
                  Centro Profissionalizante Maria Dalva de Araújo (CNPJ:{' '}
                  {CERTIFICATE_05_META.issuer2.cnpj})
                </div>
              </div>
            </div>
          </div>

          {/* Footer Verification Line with Permanent Clickable Link */}
          <div className="mt-2.5 pt-1.5 border-t border-[#CBD5E1]/70 text-center font-mono-code text-[9px] text-[#1E293B]">
            Verifique via QR Code ou acesse{' '}
            <a
              href={fields.permanentVerificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#0F4C3A] underline hover:text-[#E11D48]"
            >
              {fields.permanentBaseUrl}
            </a>{' '}
            informando o Código <span className="font-bold">{fields.verificationCode}</span> ou
            Chave <span className="font-bold">{fields.controlKey}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CertificateBackProps {
  fields: EditableCertificateFields;
  isEditable?: boolean;
  onUpdateField?: <K extends keyof EditableCertificateFields>(
    key: K,
    value: EditableCertificateFields[K]
  ) => void;
  pageRef?: React.RefObject<HTMLDivElement | null>;
}

export const CertificateBackPage: React.FC<CertificateBackProps> = ({
  fields,
  isEditable = false,
  onUpdateField,
  pageRef,
}) => {
  const editableClass = isEditable
    ? 'outline-1 outline-dashed outline-[#4C1D95]/50 bg-[#4C1D95]/5 px-1 rounded-xs focus:outline-2 focus:outline-[#E11D48] focus:bg-white cursor-text'
    : '';

  return (
    <div
      ref={pageRef}
      className="cert-a4-page select-text shadow-2xl"
      style={{
        width: '1122px',
        height: '793px',
        backgroundColor: '#FAF9F6',
        color: '#1C252C',
      }}
    >
      {/* Outer Frame (#0F4C3A) */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: '18px',
          border: '2px solid #0F4C3A',
        }}
      />
      {/* Inner Frame (#1B365D) */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: '24px',
          border: '1px solid #1B365D',
        }}
      />

      <div className="relative z-10 h-full flex flex-col justify-between px-[50px] pt-[34px] pb-[28px] select-text">
        <div>
          {/* TOP HEADER */}
          <div className="flex items-center gap-3.5 pb-2.5 border-b border-[#0F4C3A]/25">
            <div className="flex items-center gap-2 shrink-0">
              <img
                src="/assets/cert/logo_editora.png"
                alt="Editora Mente e Saúde"
                className="w-[42px] h-[42px] object-contain pointer-events-none"
              />
              <img
                src="/assets/cert/logo_centro.png"
                alt="Centro Profissionalizante Maria Dalva de Araújo"
                className="w-[42px] h-[42px] object-contain pointer-events-none"
              />
            </div>
            <div>
              <h2 className="font-cert-serif font-bold text-[20px] tracking-[0.03em] text-[#0F4C3A] uppercase leading-tight">
                MEMORIAL DESCRITIVO E REGISTRO ACADÊMICO DE ATIVIDADE DE EXTENSÃO
              </h2>
              <p className="font-sans-ui text-[11.5px] text-[#334155] mt-0.5">
                Verso Oficial do Certificado Nº {CERTIFICATE_05_META.certNumber} · Fé Pública
                Interinstitucional e Validação Curricular
              </p>
            </div>
          </div>

          {/* BOXES 1 & 2 */}
          <div className="grid grid-cols-12 gap-3.5 mt-3">
            {/* Box 1: Holder Data */}
            <div className="col-span-6 bg-[#F5F4EF] border border-[#D5CFC2] rounded-xs p-3">
              <div className="font-sans-ui font-bold text-[10px] tracking-wider uppercase text-[#0F4C3A] mb-1.5">
                1. DADOS DE IDENTIFICAÇÃO DO PROFISSIONAL EXTENSIONISTA
              </div>
              <div className="font-sans-ui text-[11.5px] text-[#1C252C] space-y-0.5 leading-[1.38]">
                <div>
                  Titular Certificado:{' '}
                  <strong
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdateField?.('holderName', e.currentTarget.textContent || fields.holderName)
                    }
                    className={`font-bold ${editableClass}`}
                  >
                    {fields.holderName}
                  </strong>
                </div>
                <div>
                  CPF Registrado:{' '}
                  <strong
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdateField?.('holderCpf', e.currentTarget.textContent || fields.holderCpf)
                    }
                    className={`font-mono-code font-bold ${editableClass}`}
                  >
                    {fields.holderCpf}
                  </strong>
                </div>
                <div>
                  Qualificação Profissional:{' '}
                  <strong className="font-bold">{fields.holderRole}</strong>
                </div>
                <div>
                  Instituição de Origem:{' '}
                  <strong className="font-bold">{fields.holderInstitution}</strong>
                </div>
              </div>
            </div>

            {/* Box 2: Curricular Framing */}
            <div className="col-span-6 bg-[#F5F4EF] border border-[#D5CFC2] rounded-xs p-3 flex flex-col justify-between">
              <div>
                <div className="font-sans-ui font-bold text-[10px] tracking-wider uppercase text-[#1B365D] mb-1.5">
                  2. ENQUADRAMENTO CURRICULAR E PONTUAÇÃO
                </div>
                <div className="font-sans-ui font-bold text-[12px] text-[#1C252C] leading-[1.38]">
                  {fields.editalFramingBack}
                </div>
              </div>
              <div className="font-mono-code font-bold text-[11.5px] text-[#0F4C3A] pt-2 border-t border-[#D5CFC2]/70 mt-2">
                Período: {fields.periodText} &nbsp;|&nbsp; Total: {fields.workloadShort}
              </div>
            </div>
          </div>

          {/* BOX 3: MATRIX OF PRACTICAL ACTIVITIES (10 HOURS) */}
          <div className="mt-3 border border-[#CBD5E1] rounded-xs bg-white overflow-hidden">
            <div className="bg-[#EEF2F0] px-3.5 py-1.5 border-b border-[#CBD5E1]">
              <span className="font-sans-ui font-bold text-[10.5px] tracking-wider uppercase text-[#0F4C3A]">
                3. MATRIZ DE ATIVIDADES PRÁTICAS E METODOLOGIA EXTENSIONISTA (10 HORAS)
              </span>
            </div>
            <div className="divide-y divide-[#E2E8F0]">
              {fields.axes.map((axis) => (
                <div
                  key={axis.id}
                  className="grid grid-cols-12 items-center px-3.5 py-2 gap-3 text-[11px]"
                >
                  <div className="col-span-4 pr-2">
                    <div className="font-sans-ui font-bold text-[#1C252C] leading-tight">
                      {axis.axisTitle}
                    </div>
                    <div className="font-sans-ui text-[9.8px] text-[#64748B] mt-0.5 leading-tight">
                      {axis.axisSubtitle}
                    </div>
                  </div>
                  <div className="col-span-7 font-sans-ui text-[#334155] text-[10.8px] leading-[1.35]">
                    {axis.description}
                  </div>
                  <div className="col-span-1 text-right font-mono-code font-bold text-[11px] text-[#0F4C3A] whitespace-nowrap">
                    {axis.workload}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOX 4: PUBLIC FAITH REGISTRATION & PERMANENT VERIFICATION KEYS */}
          <div className="mt-3 bg-[#FBF8EC] border border-[#E2D5B5] rounded-xs p-3 flex items-center justify-between gap-4">
            <div className="space-y-1 text-[10.5px] leading-[1.38] text-[#1C252C] flex-1">
              <div className="font-sans-ui font-bold text-[10px] tracking-wider uppercase text-[#855B0A]">
                4. REGISTRO OFICIAL DE FÉ PÚBLICA, ENDEREÇO WEB E CHAVES DE VERIFICAÇÃO DE AUTENTICIDADE
              </div>
              <p className="font-sans-ui text-[10.8px]">
                Certificado registrado sob o <strong>nº {CERTIFICATE_05_META.certNumber}</strong> no{' '}
                <strong>Livro de Extensão nº {fields.bookNumber}</strong>,{' '}
                <strong>Folha {fields.pageNumber}</strong>, expedido pela{' '}
                <strong>Editora Mente e Saúde</strong> (CNPJ: {CERTIFICATE_05_META.issuer1.cnpj}) e{' '}
                <strong>Centro Profissionalizante Maria Dalva de Araújo</strong> (CNPJ:{' '}
                {CERTIFICATE_05_META.issuer2.cnpj}).
              </p>
              <div className="font-mono-code text-[9.8px] text-[#1E293B] pt-0.5">
                <strong>CÓDIGO DE AUTENTICIDADE:</strong> {fields.verificationCode} &nbsp;|&nbsp;{' '}
                <strong>CHAVE DE CONTROLE / DÍGITO:</strong> {fields.controlKey}
              </div>
              <div className="font-mono-code text-[9.5px] text-[#0F4C3A]">
                <strong className="text-[#1E293B]">
                  ENDEREÇO PARA VERIFICAÇÃO MANUAL (SEM QR CODE):
                </strong>{' '}
                <a
                  href={fields.permanentVerificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#E11D48] font-semibold"
                >
                  {fields.permanentVerificationUrl}
                </a>
              </div>
              <div className="font-mono-code text-[9.2px] text-[#475569]">
                <strong className="text-[#1E293B]">HASH SHA-256:</strong> {fields.sha256Hash}
              </div>
            </div>

            <a
              href={fields.permanentVerificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Clique para abrir o autenticador público oficial"
              className="bg-white p-1.5 border border-[#D5CFC2] rounded-xs shrink-0 hover:opacity-90 transition-opacity"
            >
              <QRCodeSVG
                value={fields.permanentVerificationUrl}
                size={84}
                level="M"
                bgColor="#FFFFFF"
                fgColor="#111827"
              />
            </a>
          </div>
        </div>

        {/* BOTTOM SIGNATURES ROW ON BACK PAGE */}
        <div className="grid grid-cols-12 items-end gap-4 pt-1">
          <div className="col-span-4 text-center">
            <div className="h-[42px] flex items-end justify-center">
              <img
                src="/assets/cert/sig_barbara.png"
                alt="Assinatura Bárbara Lima dos Santos"
                className="max-h-[40px] w-auto object-contain pointer-events-none"
              />
            </div>
            <div className="border-t border-[#1C252C]/70 pt-1">
              <div className="font-sans-ui font-bold text-[10.5px] text-[#1C252C]">
                {CERTIFICATE_05_META.issuer1.signerName}
              </div>
              <div className="font-mono-code text-[8.8px] text-[#334155]">
                Editora Mente e Saúde (CNPJ: {CERTIFICATE_05_META.issuer1.cnpj})
              </div>
            </div>
          </div>

          <div className="col-span-4 text-center pb-0.5">
            <div className="font-cert-italic italic font-semibold text-[15px] text-[#1C252C]">
              {fields.issueLocationAndDate}
            </div>
            <div className="font-sans-ui text-[9.5px] text-[#334155] mt-0.5">
              Documento Oficial de 2 Laudas (Frente e Verso) · Válido em Todo o Território Nacional
            </div>
            <div className="font-mono-code text-[8.8px] text-[#475569] mt-0.5">
              Registro: {fields.verificationCode} · Chave: {fields.controlKey} ·{' '}
              <a
                href={fields.permanentVerificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0F4C3A] underline hover:text-[#E11D48]"
              >
                {fields.permanentBaseUrl}
              </a>
            </div>
          </div>

          <div className="col-span-4 text-center">
            <div className="h-[42px] flex items-end justify-center">
              <img
                src="/assets/cert/sig_james.png"
                alt="Assinatura James Araújo de Santana"
                className="max-h-[40px] w-auto object-contain pointer-events-none"
              />
            </div>
            <div className="border-t border-[#1C252C]/70 pt-1">
              <div className="font-sans-ui font-bold text-[10.5px] text-[#1C252C]">
                {CERTIFICATE_05_META.issuer2.signerName}
              </div>
              <div className="font-mono-code text-[8.8px] text-[#334155]">
                {CERTIFICATE_05_META.issuer2.shortName} (CNPJ: {CERTIFICATE_05_META.issuer2.cnpj})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
