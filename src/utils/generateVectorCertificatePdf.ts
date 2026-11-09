import { jsPDF } from 'jspdf';
import { CERTIFICATE_05_META, CertificateAxis } from '../data/certificate05Data';

export interface EditableCertificateFields {
  holderName: string;
  holderRole: string;
  holderCpf: string;
  holderInstitution: string;
  projectTitle: string;
  editalFramingFront: string;
  editalFramingBack: string;
  periodText: string;
  workloadText: string;
  workloadShort: string;
  issueLocationAndDate: string;
  verificationCode: string;
  controlKey: string;
  bookNumber: string;
  pageNumber: string;
  sha256Hash: string;
  permanentBaseUrl: string;
  permanentVerificationUrl: string;
  axes: CertificateAxis[];
}

export const getDefaultEditableCertificateFields = (): EditableCertificateFields => ({
  holderName: CERTIFICATE_05_META.holderName,
  holderRole: CERTIFICATE_05_META.holderRole,
  holderCpf: CERTIFICATE_05_META.holderCpf,
  holderInstitution: CERTIFICATE_05_META.holderInstitution,
  projectTitle: CERTIFICATE_05_META.projectTitle,
  editalFramingFront: CERTIFICATE_05_META.editalFramingFront,
  editalFramingBack: CERTIFICATE_05_META.editalFramingBack,
  periodText: CERTIFICATE_05_META.periodText,
  workloadText: CERTIFICATE_05_META.workloadText,
  workloadShort: CERTIFICATE_05_META.workloadShort,
  issueLocationAndDate: CERTIFICATE_05_META.issueLocationAndDate,
  verificationCode: CERTIFICATE_05_META.verificationCode,
  controlKey: CERTIFICATE_05_META.controlKey,
  bookNumber: CERTIFICATE_05_META.bookNumber,
  pageNumber: CERTIFICATE_05_META.pageNumber,
  sha256Hash: CERTIFICATE_05_META.sha256Hash,
  permanentBaseUrl: CERTIFICATE_05_META.permanentBaseUrl,
  permanentVerificationUrl: CERTIFICATE_05_META.permanentVerificationUrl,
  axes: CERTIFICATE_05_META.axes.map((a) => ({ ...a })),
});

interface TextSegment {
  text: string;
  bold?: boolean;
  color?: [number, number, number];
}

interface PositionedWord {
  word: string;
  bold: boolean;
  width: number;
  color: [number, number, number];
}

async function fetchImageAsDataUrl(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function renderSvgElementToPngDataUrl(svgElement: SVGSVGElement, sizePx = 400): Promise<string> {
  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(svgElement);
  if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
    svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = sizePx;
      canvas.height = sizePx;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, sizePx, sizePx);
        ctx.drawImage(img, 0, 0, sizePx, sizePx);
      }
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

/**
 * Draws a multi-segment paragraph (supporting mixed normal + bold words) as native selectable PDF text.
 */
function drawRichParagraph(
  pdf: jsPDF,
  segments: TextSegment[],
  startX: number,
  startY: number,
  maxWidth: number,
  fontSizePt: number,
  lineHeightMm: number,
  options: {
    fontFamily?: 'helvetica' | 'times';
    justify?: boolean;
    alignCenter?: boolean;
    defaultColor?: [number, number, number];
  } = {}
): number {
  const fontFamily = options.fontFamily || 'helvetica';
  const defaultColor: [number, number, number] = options.defaultColor || [28, 37, 44];

  pdf.setFontSize(fontSizePt);

  // Tokenize segments into words
  const words: PositionedWord[] = [];
  for (const seg of segments) {
    const isBold = Boolean(seg.bold);
    const color = seg.color || defaultColor;
    pdf.setFont(fontFamily, isBold ? 'bold' : 'normal');
    const rawTokens = seg.text.split(/(\s+)/);
    for (const token of rawTokens) {
      const trimmed = token.trim();
      if (!trimmed) continue;
      const w = pdf.getTextWidth(trimmed);
      words.push({
        word: trimmed,
        bold: isBold,
        width: w,
        color,
      });
    }
  }

  pdf.setFont(fontFamily, 'normal');
  const normalSpaceWidth = pdf.getTextWidth(' ');

  // Group words into lines
  const lines: PositionedWord[][] = [];
  let currentLine: PositionedWord[] = [];
  let currentWidth = 0;

  for (const item of words) {
    const spaceNeeded = currentLine.length > 0 ? normalSpaceWidth : 0;
    if (currentLine.length > 0 && currentWidth + spaceNeeded + item.width > maxWidth) {
      lines.push(currentLine);
      currentLine = [item];
      currentWidth = item.width;
    } else {
      currentLine.push(item);
      currentWidth += spaceNeeded + item.width;
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  let cursorY = startY;
  lines.forEach((line, lineIdx) => {
    const isLastLine = lineIdx === lines.length - 1;
    const totalWordsWidth = line.reduce((acc, w) => acc + w.width, 0);
    const gapsCount = Math.max(0, line.length - 1);

    let gapWidth = normalSpaceWidth;
    let cursorX = startX;

    if (options.alignCenter) {
      const totalLineWidth = totalWordsWidth + gapsCount * normalSpaceWidth;
      cursorX = startX + (maxWidth - totalLineWidth) / 2;
    } else if (options.justify && !isLastLine && gapsCount > 0) {
      const extraSpace = maxWidth - totalWordsWidth;
      const computedGap = extraSpace / gapsCount;
      // Avoid excessive stretching
      if (computedGap <= normalSpaceWidth * 3.0) {
        gapWidth = computedGap;
      }
    }

    for (let i = 0; i < line.length; i++) {
      const wObj = line[i];
      pdf.setFont(fontFamily, wObj.bold ? 'bold' : 'normal');
      pdf.setTextColor(wObj.color[0], wObj.color[1], wObj.color[2]);
      pdf.text(wObj.word, cursorX, cursorY);
      cursorX += wObj.width + gapWidth;
    }

    cursorY += lineHeightMm;
  });

  return cursorY;
}

function drawInstitutionalFrames(pdf: jsPDF) {
  // Cream background (#FAF9F6)
  pdf.setFillColor(250, 249, 246);
  pdf.rect(0, 0, 297, 210, 'F');

  // Outer Frame (#0F4C3A) at 4.8mm inset
  pdf.setDrawColor(15, 76, 58);
  pdf.setLineWidth(0.55);
  pdf.rect(4.8, 4.8, 287.4, 200.4, 'S');

  // Inner Frame (#1B365D) at 6.4mm inset
  pdf.setDrawColor(27, 54, 93);
  pdf.setLineWidth(0.28);
  pdf.rect(6.4, 6.4, 284.2, 197.2, 'S');

  // Corner L-Accents
  pdf.setDrawColor(15, 76, 58);
  pdf.setLineWidth(0.5);
  const c = 5.6;
  const len = 3.2;
  // Top-left
  pdf.line(c, c, c + len, c);
  pdf.line(c, c, c, c + len);
  // Top-right
  pdf.line(297 - c - len, c, 297 - c, c);
  pdf.line(297 - c, c, 297 - c, c + len);
  // Bottom-left
  pdf.line(c, 210 - c, c + len, 210 - c);
  pdf.line(c, 210 - c - len, c, 210 - c);
  // Bottom-right
  pdf.line(297 - c - len, 210 - c, 297 - c, 210 - c);
  pdf.line(297 - c, 210 - c - len, 297 - c, 210 - c);
}

/**
 * Generates a 100% Vector, Selectable, Copyable & Editable 2-Page A4 Landscape PDF
 * with native PDF clickable hyperlink annotations pointing to https://extensao-saude-colirios-caseiros.vercel.app/
 */
export async function generateVectorCertificatePdf(
  fields: EditableCertificateFields,
  qrSvgElement?: SVGSVGElement | null
): Promise<void> {
  const [logoEditora, logoCentro, sigBarbara, sigJames] = await Promise.all([
    fetchImageAsDataUrl('/assets/cert/logo_editora.png'),
    fetchImageAsDataUrl('/assets/cert/logo_centro.png'),
    fetchImageAsDataUrl('/assets/cert/sig_barbara.png'),
    fetchImageAsDataUrl('/assets/cert/sig_james.png'),
  ]);

  let qrPngDataUrl: string | null = null;
  if (qrSvgElement) {
    try {
      qrPngDataUrl = await renderSvgElementToPngDataUrl(qrSvgElement, 420);
    } catch (e) {
      console.warn('Fallback QR render error:', e);
    }
  }

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
    putOnlyUsedFonts: true,
  });

  // Set PDF Document Metadata for Accessibility & Auditability
  pdf.setProperties({
    title: `Certificado de Extensão Nº 05 - ${fields.holderName} (${fields.verificationCode})`,
    subject: fields.projectTitle,
    author: `${CERTIFICATE_05_META.issuer1.name} & ${CERTIFICATE_05_META.issuer2.name}`,
    keywords: `Certificado Extensão, ${fields.verificationCode}, ${fields.controlKey}, ${fields.holderName}, FUBOG Item 08, Saúde Ocular`,
    creator: `Portal de Fé Pública - ${fields.permanentBaseUrl}`,
  });

  // =========================================================================
  // LAUDA 1 — FRENTE DO CERTIFICADO (297mm x 210mm)
  // =========================================================================
  drawInstitutionalFrames(pdf);

  const marginX = 14.5;
  const contentWidth = 297 - marginX * 2; // 268mm

  // 1. TOP HEADER
  pdf.addImage(logoEditora, 'PNG', marginX, 10.5, 17.5, 17.5);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(15, 76, 58);
  pdf.text('EDITORA MENTE E SAÚDE', marginX + 20, 15.2);

  pdf.setFont('courier', 'bold');
  pdf.setFontSize(8.2);
  pdf.setTextColor(28, 37, 44);
  pdf.text(`CNPJ: ${CERTIFICATE_05_META.issuer1.cnpj}`, marginX + 20, 19.5);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.8);
  pdf.setTextColor(21, 107, 78);
  pdf.text('Conselho Editorial e Extensão Científica', marginX + 20, 23.6);

  // Center Program Header
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.8);
  pdf.setTextColor(28, 37, 44);
  pdf.text(
    'PROGRAMA INTERINSTITUCIONAL DE EXTENSÃO, COMUNICAÇÃO CIENTÍFICA',
    148.5,
    14.5,
    { align: 'center' }
  );
  pdf.text('E EDUCAÇÃO EM SAÚDE', 148.5, 18.2, { align: 'center' });

  pdf.setFont('courier', 'bold');
  pdf.setFontSize(7.6);
  pdf.setTextColor(28, 37, 44);
  pdf.text(
    `Certificado Nº 05 · Livro de Extensão nº ${fields.bookNumber} · Cód. ${fields.verificationCode}`,
    148.5,
    23.2,
    { align: 'center' }
  );

  // Right Institution
  const rightLogoX = 297 - marginX - 17.5;
  pdf.addImage(logoCentro, 'PNG', rightLogoX, 10.5, 17.5, 17.5);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10.2);
  pdf.setTextColor(27, 54, 93);
  pdf.text('CENTRO PROFISSIONALIZANTE', rightLogoX - 2.5, 15.0, { align: 'right' });
  pdf.text('MARIA DALVA DE ARAÚJO', rightLogoX - 2.5, 19.2, { align: 'right' });

  pdf.setFont('courier', 'bold');
  pdf.setFontSize(8.2);
  pdf.setTextColor(28, 37, 44);
  pdf.text(`CNPJ: ${CERTIFICATE_05_META.issuer2.cnpj}`, rightLogoX - 2.5, 23.5, {
    align: 'right',
  });

  // Header Divider Line
  pdf.setDrawColor(15, 76, 58);
  pdf.setLineWidth(0.2);
  pdf.line(marginX, 31, 297 - marginX, 31);

  // 2. MAIN TITLE
  pdf.setFont('times', 'bold');
  pdf.setFontSize(24.5);
  pdf.setTextColor(15, 76, 58);
  pdf.text('CERTIFICADO DE ATIVIDADE DE EXTENSÃO', 148.5, 43.5, { align: 'center' });

  // Intro line
  drawRichParagraph(
    pdf,
    [
      { text: 'A ' },
      { text: 'Editora Mente e Saúde', bold: true },
      { text: ` (CNPJ: ${CERTIFICATE_05_META.issuer1.cnpj}), em parceria institucional com o ` },
      { text: 'Centro Profissionalizante Maria Dalva de Araújo', bold: true },
      {
        text: ` (CNPJ: ${CERTIFICATE_05_META.issuer2.cnpj}), certifica para os devidos fins de comprovação curricular e acadêmica que`,
      },
    ],
    24.5,
    51.5,
    248,
    10.2,
    4.8,
    { fontFamily: 'helvetica', alignCenter: true }
  );

  // 3. HOLDER HIGHLIGHT BOX
  const holderBoxX = 24.5;
  const holderBoxW = 248;
  const holderBoxY = 60.5;
  const holderBoxH = 22.5;
  pdf.setFillColor(243, 241, 234);
  pdf.setDrawColor(213, 207, 194);
  pdf.setLineWidth(0.3);
  pdf.rect(holderBoxX, holderBoxY, holderBoxW, holderBoxH, 'FD');

  pdf.setFont('times', 'bold');
  pdf.setFontSize(21);
  pdf.setTextColor(20, 35, 60);
  pdf.text(fields.holderName, 148.5, holderBoxY + 11.2, { align: 'center' });

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10.2);
  pdf.setTextColor(44, 53, 61);
  pdf.text(
    `${fields.holderRole} | CPF: ${fields.holderCpf} | ${fields.holderInstitution}`,
    148.5,
    holderBoxY + 18.2,
    { align: 'center' }
  );

  // 4. BODY PARAGRAPHS (Native Selectable & Copyable Text with Bold Keywords)
  const bodyX = 24.5;
  const bodyW = 248;
  let nextY = drawRichParagraph(
    pdf,
    [
      { text: 'participou de forma efetiva da ' },
      { text: 'Atividade de Extensão', bold: true, color: [15, 23, 42] },
      { text: ' intitulada ' },
      { text: `“${fields.projectTitle}”,`, bold: true, color: [15, 23, 42] },
      { text: ' desenvolvida na modalidade de ' },
      { text: `${fields.editalFramingFront},`, bold: true, color: [15, 23, 42] },
      { text: ' realizada no período de ' },
      { text: `${fields.periodText},`, bold: true, color: [15, 23, 42] },
      { text: ' contabilizando carga horária total de ' },
      { text: `${fields.workloadText}.`, bold: true, color: [15, 23, 42] },
    ],
    bodyX,
    92.5,
    bodyW,
    10.3,
    5.1,
    { fontFamily: 'helvetica', justify: true }
  );

  nextY = drawRichParagraph(
    pdf,
    [
      {
        text: 'No âmbito desta ação extensionista, o profissional atuou na curadoria médico-científica em página virtual de saúde e aplicação de cards e enquetes digitais interativas de “Mito ou Verdade” para ',
      },
      { text: 'coleta de dados populacionais', bold: true, color: [15, 23, 42] },
      {
        text: ' sobre automedicação ocular, elaboração e distribuição comunitária gratuita de materiais educativos (folhetos e mini e-book de prevenção à cegueira evitável), ',
      },
      {
        text: 'comunicação científica para combate à desinformação (fake news)',
        bold: true,
        color: [15, 23, 42],
      },
      { text: ' sobre colírios e receitas caseiras perigosas, e ' },
      {
        text: 'divulgação dos canais oficiais de urgência oftalmológica do SUS.',
        bold: true,
        color: [15, 23, 42],
      },
    ],
    bodyX,
    nextY + 3.2,
    bodyW,
    10.3,
    5.1,
    { fontFamily: 'helvetica', justify: true }
  );

  // 5. LOCATION & DATE
  pdf.setFont('times', 'bolditalic');
  pdf.setFontSize(13.5);
  pdf.setTextColor(28, 37, 44);
  pdf.text(fields.issueLocationAndDate, 148.5, Math.max(nextY + 7.5, 139.5), {
    align: 'center',
  });

  // 6. BOTTOM SIGNATURES, SEAL & QR AUTHENTICATION
  const sigLineY = 174.5;

  // Left Signature Block (Barbara)
  pdf.addImage(sigBarbara, 'PNG', 32, sigLineY - 14.5, 48, 13);
  pdf.setDrawColor(28, 37, 44);
  pdf.setLineWidth(0.25);
  pdf.line(18, sigLineY, 94, sigLineY);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.8);
  pdf.setTextColor(28, 37, 44);
  pdf.text(CERTIFICATE_05_META.issuer1.signerName, 56, sigLineY + 4.5, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.6);
  pdf.setTextColor(51, 65, 85);
  pdf.text(CERTIFICATE_05_META.issuer1.signerRole, 56, sigLineY + 8.3, { align: 'center' });

  pdf.setFont('courier', 'bold');
  pdf.setFontSize(7.0);
  pdf.setTextColor(28, 37, 44);
  pdf.text(
    `Editora Mente e Saúde (CNPJ: ${CERTIFICATE_05_META.issuer1.cnpj})`,
    56,
    sigLineY + 12.0,
    { align: 'center' }
  );

  // Center Official Gold Seal (Vector)
  const sealCenterX = 113.5;
  const sealCenterY = 172.0;
  pdf.setFillColor(253, 251, 243);
  pdf.setDrawColor(197, 155, 39);
  pdf.setLineWidth(0.5);
  pdf.circle(sealCenterX, sealCenterY, 11.2, 'FD');
  pdf.setLineWidth(0.25);
  pdf.circle(sealCenterX, sealCenterY, 9.8, 'S');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(5.5);
  pdf.setTextColor(120, 89, 8);
  pdf.text('* * *', sealCenterX, sealCenterY - 5.2, { align: 'center' });
  pdf.text('SELO OFICIAL', sealCenterX, sealCenterY - 1.8, { align: 'center' });
  pdf.text('FÉ PÚBLICA', sealCenterX, sealCenterY + 1.0, { align: 'center' });
  pdf.setFont('courier', 'bold');
  pdf.setFontSize(4.7);
  pdf.setTextColor(142, 107, 13);
  pdf.text(fields.verificationCode, sealCenterX, sealCenterY + 4.2, { align: 'center' });
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(5.5);
  pdf.text('* * *', sealCenterX, sealCenterY + 7.5, { align: 'center' });

  // Center QR & Manual Verification Box
  const qrBoxX = 127.5;
  const qrBoxY = 158.0;
  const qrBoxW = 68.5;
  const qrBoxH = 28.0;
  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(203, 213, 225);
  pdf.setLineWidth(0.28);
  pdf.roundedRect(qrBoxX, qrBoxY, qrBoxW, qrBoxH, 1.2, 1.2, 'FD');

  if (qrPngDataUrl) {
    pdf.addImage(qrPngDataUrl, 'PNG', qrBoxX + 2.2, qrBoxY + 3.0, 21.5, 21.5);
    // Make QR Code clickable in PDF
    pdf.link(qrBoxX + 2.2, qrBoxY + 3.0, 21.5, 21.5, {
      url: fields.permanentVerificationUrl,
    });
  }

  const qrTextX = qrBoxX + 25.5;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(6.2);
  pdf.setTextColor(15, 76, 58);
  pdf.text('AUTENTICAÇÃO PÚBLICA MANUAL', qrTextX, qrBoxY + 5.2);

  pdf.setFont('courier', 'bold');
  pdf.setFontSize(6.5);
  pdf.setTextColor(28, 37, 44);
  pdf.text(`Cód.: ${fields.verificationCode}`, qrTextX, qrBoxY + 9.2);
  pdf.text(`Chave: ${fields.controlKey}`, qrTextX, qrBoxY + 12.8);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(6.0);
  pdf.setTextColor(28, 37, 44);
  pdf.text('Endereço p/ Verificação Online:', qrTextX, qrBoxY + 16.8);

  pdf.setFont('courier', 'bold');
  pdf.setFontSize(5.7);
  pdf.setTextColor(15, 76, 58);
  pdf.text('https://extensao-saude-colirios-', qrTextX, qrBoxY + 20.4);
  pdf.text('caseiros.vercel.app/', qrTextX, qrBoxY + 23.6);
  // Add clickable link over the URL text in the authentication box
  pdf.link(qrTextX, qrBoxY + 17.5, 41.5, 8.0, {
    url: fields.permanentVerificationUrl,
  });

  // Right Signature Block (James)
  pdf.addImage(sigJames, 'PNG', 217, sigLineY - 14.5, 48, 13);
  pdf.setDrawColor(28, 37, 44);
  pdf.setLineWidth(0.25);
  pdf.line(203, sigLineY, 279, sigLineY);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.8);
  pdf.setTextColor(28, 37, 44);
  pdf.text(CERTIFICATE_05_META.issuer2.signerName, 241, sigLineY + 4.5, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.6);
  pdf.setTextColor(51, 65, 85);
  pdf.text(CERTIFICATE_05_META.issuer2.signerRole, 241, sigLineY + 8.3, { align: 'center' });

  pdf.setFont('courier', 'bold');
  pdf.setFontSize(6.6);
  pdf.setTextColor(28, 37, 44);
  pdf.text(
    `Centro Profissionalizante Maria Dalva de Araújo (CNPJ: ${CERTIFICATE_05_META.issuer2.cnpj})`,
    241,
    sigLineY + 12.0,
    { align: 'center' }
  );

  // 7. FOOTER VERIFICATION LINE WITH CLICKABLE LINK
  pdf.setDrawColor(203, 213, 225);
  pdf.setLineWidth(0.2);
  pdf.line(marginX, 193.0, 297 - marginX, 193.0);

  const footerText = `Verifique via QR Code ou acesse ${fields.permanentBaseUrl} informando o Código ${fields.verificationCode} ou Chave ${fields.controlKey}`;
  pdf.setFont('courier', 'bold');
  pdf.setFontSize(7.1);
  pdf.setTextColor(15, 76, 58);
  pdf.text(footerText, 148.5, 197.8, { align: 'center' });
  // Make entire footer verification line clickable in PDF
  pdf.link(25, 194.0, 247, 5.5, {
    url: fields.permanentVerificationUrl,
  });

  // =========================================================================
  // LAUDA 2 — VERSO: MEMORIAL DESCRITIVO E REGISTRO ACADÊMICO (297mm x 210mm)
  // =========================================================================
  pdf.addPage('a4', 'landscape');
  drawInstitutionalFrames(pdf);

  // 1. TOP HEADER (VERSO)
  pdf.addImage(logoEditora, 'PNG', marginX, 10.2, 11.5, 11.5);
  pdf.addImage(logoCentro, 'PNG', marginX + 13.0, 10.2, 11.5, 11.5);

  pdf.setFont('times', 'bold');
  pdf.setFontSize(15.2);
  pdf.setTextColor(15, 76, 58);
  pdf.text(
    'MEMORIAL DESCRITIVO E REGISTRO ACADÊMICO DE ATIVIDADE DE EXTENSÃO',
    marginX + 27.5,
    15.5
  );

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.8);
  pdf.setTextColor(51, 65, 85);
  pdf.text(
    `Verso Oficial do Certificado Nº 05 · Fé Pública Interinstitucional e Validação Curricular`,
    marginX + 27.5,
    20.2
  );

  pdf.setDrawColor(15, 76, 58);
  pdf.setLineWidth(0.2);
  pdf.line(marginX, 24.2, 297 - marginX, 24.2);

  // 2. BOX 1 & BOX 2 (2-Column Metadata)
  const boxY = 27.2;
  const boxH = 29.0;
  const colW = (contentWidth - 4.0) / 2; // 132mm each

  // Box 1: Holder Data
  pdf.setFillColor(245, 244, 239);
  pdf.setDrawColor(213, 207, 194);
  pdf.setLineWidth(0.25);
  pdf.rect(marginX, boxY, colW, boxH, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.6);
  pdf.setTextColor(15, 76, 58);
  pdf.text(
    '1. DADOS DE IDENTIFICAÇÃO DO PROFISSIONAL EXTENSIONISTA',
    marginX + 3.5,
    boxY + 5.2
  );

  drawRichParagraph(
    pdf,
    [
      { text: 'Titular Certificado: ' },
      { text: fields.holderName, bold: true },
    ],
    marginX + 3.5,
    boxY + 10.5,
    colW - 7,
    8.6,
    4.2
  );
  drawRichParagraph(
    pdf,
    [
      { text: 'CPF Registrado: ' },
      { text: fields.holderCpf, bold: true },
    ],
    marginX + 3.5,
    boxY + 15.2,
    colW - 7,
    8.6,
    4.2
  );
  drawRichParagraph(
    pdf,
    [
      { text: 'Qualificação Profissional: ' },
      { text: fields.holderRole, bold: true },
    ],
    marginX + 3.5,
    boxY + 19.9,
    colW - 7,
    8.6,
    4.2
  );
  drawRichParagraph(
    pdf,
    [
      { text: 'Instituição de Origem: ' },
      { text: fields.holderInstitution, bold: true },
    ],
    marginX + 3.5,
    boxY + 24.6,
    colW - 7,
    8.6,
    4.2
  );

  // Box 2: Curricular Framing
  const box2X = marginX + colW + 4.0;
  pdf.setFillColor(245, 244, 239);
  pdf.setDrawColor(213, 207, 194);
  pdf.rect(box2X, boxY, colW, boxH, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.6);
  pdf.setTextColor(27, 54, 93);
  pdf.text('2. ENQUADRAMENTO CURRICULAR E PONTUAÇÃO', box2X + 3.5, boxY + 5.2);

  drawRichParagraph(
    pdf,
    [{ text: fields.editalFramingBack, bold: true }],
    box2X + 3.5,
    boxY + 10.8,
    colW - 7,
    9.0,
    4.5
  );

  pdf.setDrawColor(213, 207, 194);
  pdf.line(box2X + 3.5, boxY + 20.5, box2X + colW - 3.5, boxY + 20.5);

  pdf.setFont('courier', 'bold');
  pdf.setFontSize(8.8);
  pdf.setTextColor(15, 76, 58);
  pdf.text(
    `Período: ${fields.periodText}   |   Total: ${fields.workloadShort}`,
    box2X + 3.5,
    boxY + 25.4
  );

  // 3. BOX 3: MATRIX OF PRACTICAL ACTIVITIES (10 HOURS)
  const matrixY = 59.5;
  const matrixHeaderH = 7.2;
  const rowH = 15.6;
  const totalMatrixH = matrixHeaderH + rowH * fields.axes.length;

  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(203, 213, 225);
  pdf.setLineWidth(0.25);
  pdf.rect(marginX, matrixY, contentWidth, totalMatrixH, 'FD');

  // Matrix Header Bar
  pdf.setFillColor(238, 242, 240);
  pdf.rect(marginX, matrixY, contentWidth, matrixHeaderH, 'FD');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.8);
  pdf.setTextColor(15, 76, 58);
  pdf.text(
    '3. MATRIZ DE ATIVIDADES PRÁTICAS E METODOLOGIA EXTENSIONISTA (10 HORAS)',
    marginX + 3.5,
    matrixY + 4.9
  );

  fields.axes.forEach((axis, idx) => {
    const rY = matrixY + matrixHeaderH + idx * rowH;
    if (idx > 0) {
      pdf.setDrawColor(226, 232, 240);
      pdf.line(marginX, rY, marginX + contentWidth, rY);
    }

    // Left Axis Title & Subtitle
    drawRichParagraph(
      pdf,
      [{ text: axis.axisTitle, bold: true, color: [28, 37, 44] }],
      marginX + 3.5,
      rY + 4.8,
      82,
      8.1,
      3.8
    );
    drawRichParagraph(
      pdf,
      [{ text: axis.axisSubtitle, bold: false, color: [100, 116, 139] }],
      marginX + 3.5,
      rY + 11.8,
      82,
      7.2,
      3.4
    );

    // Center Description
    drawRichParagraph(
      pdf,
      [{ text: axis.description, bold: false, color: [51, 65, 85] }],
      marginX + 89,
      rY + 5.0,
      154,
      8.0,
      3.9
    );

    // Right Workload
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(8.4);
    pdf.setTextColor(15, 76, 58);
    pdf.text(axis.workload, marginX + contentWidth - 3.5, rY + 8.8, { align: 'right' });
  });

  // 4. BOX 4: PUBLIC FAITH REGISTRATION, PERMANENT URL & SHA-256 HASH
  const regY = matrixY + totalMatrixH + 3.2; // ~132.3mm
  const regH = 34.0;
  pdf.setFillColor(251, 248, 236);
  pdf.setDrawColor(226, 213, 181);
  pdf.setLineWidth(0.3);
  pdf.rect(marginX, regY, contentWidth, regH, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.6);
  pdf.setTextColor(133, 91, 10);
  pdf.text(
    '4. REGISTRO OFICIAL DE FÉ PÚBLICA, ENDEREÇO WEB E CHAVES DE VERIFICAÇÃO DE AUTENTICIDADE',
    marginX + 3.5,
    regY + 5.2
  );

  drawRichParagraph(
    pdf,
    [
      { text: 'Certificado registrado sob o ' },
      { text: 'nº 05', bold: true },
      { text: ' no ' },
      { text: `Livro de Extensão nº ${fields.bookNumber}, Folha ${fields.pageNumber},`, bold: true },
      { text: ' expedido pela ' },
      { text: 'Editora Mente e Saúde', bold: true },
      { text: ` (CNPJ: ${CERTIFICATE_05_META.issuer1.cnpj}) e ` },
      { text: 'Centro Profissionalizante Maria Dalva de Araújo', bold: true },
      { text: ` (CNPJ: ${CERTIFICATE_05_META.issuer2.cnpj}).` },
    ],
    marginX + 3.5,
    regY + 10.4,
    contentWidth - 38,
    8.2,
    4.0
  );

  pdf.setFont('courier', 'bold');
  pdf.setFontSize(7.6);
  pdf.setTextColor(30, 41, 59);
  pdf.text(
    `CÓDIGO DE AUTENTICIDADE: ${fields.verificationCode}   |   CHAVE DE CONTROLE / DÍGITO: ${fields.controlKey}`,
    marginX + 3.5,
    regY + 19.2
  );

  // Permanent clickable verification URL in Box 4
  pdf.setFont('courier', 'bold');
  pdf.setFontSize(7.5);
  pdf.setTextColor(30, 41, 59);
  const urlLabel = 'ENDEREÇO PARA VERIFICAÇÃO MANUAL (SEM QR CODE): ';
  pdf.text(urlLabel, marginX + 3.5, regY + 24.5);
  const labelW = pdf.getTextWidth(urlLabel);

  pdf.setTextColor(15, 76, 58);
  pdf.text(fields.permanentVerificationUrl, marginX + 3.5 + labelW, regY + 24.5);
  // Add clickable link annotation over the URL on Back Page
  pdf.link(marginX + 3.5, regY + 21.2, contentWidth - 40, 4.8, {
    url: fields.permanentVerificationUrl,
  });

  pdf.setFont('courier', 'bold');
  pdf.setFontSize(7.3);
  pdf.setTextColor(71, 85, 105);
  pdf.text(`HASH SHA-256: ${fields.sha256Hash}`, marginX + 3.5, regY + 29.8);

  // Right QR Code inside Box 4
  if (qrPngDataUrl) {
    const backQrX = marginX + contentWidth - 29.5;
    const backQrY = regY + 4.0;
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(213, 207, 194);
    pdf.rect(backQrX - 1.5, backQrY - 1.5, 27.5, 27.5, 'FD');
    pdf.addImage(qrPngDataUrl, 'PNG', backQrX, backQrY, 24.5, 24.5);
    pdf.link(backQrX - 1.5, backQrY - 1.5, 27.5, 27.5, {
      url: fields.permanentVerificationUrl,
    });
  }

  // 5. BOTTOM SIGNATURES ROW ON BACK PAGE
  const backSigY = 186.5;

  // Left Signature
  pdf.addImage(sigBarbara, 'PNG', 34, backSigY - 11.8, 42, 10.8);
  pdf.setDrawColor(28, 37, 44);
  pdf.setLineWidth(0.25);
  pdf.line(18, backSigY, 92, backSigY);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.2);
  pdf.setTextColor(28, 37, 44);
  pdf.text(CERTIFICATE_05_META.issuer1.signerName, 55, backSigY + 4.2, { align: 'center' });

  pdf.setFont('courier', 'normal');
  pdf.setFontSize(6.8);
  pdf.setTextColor(51, 65, 85);
  pdf.text(
    `Editora Mente e Saúde (CNPJ: ${CERTIFICATE_05_META.issuer1.cnpj})`,
    55,
    backSigY + 8.0,
    { align: 'center' }
  );

  // Center Date & Document Validity
  pdf.setFont('times', 'bolditalic');
  pdf.setFontSize(11.5);
  pdf.setTextColor(28, 37, 44);
  pdf.text(fields.issueLocationAndDate, 148.5, backSigY - 1.5, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.4);
  pdf.setTextColor(51, 65, 85);
  pdf.text(
    'Documento Oficial de 2 Laudas (Frente e Verso) · Válido em Todo o Território Nacional',
    148.5,
    backSigY + 3.2,
    { align: 'center' }
  );

  pdf.setFont('courier', 'normal');
  pdf.setFontSize(6.9);
  pdf.setTextColor(71, 85, 105);
  pdf.text(
    `Registro: ${fields.verificationCode} · Chave: ${fields.controlKey} · ${fields.permanentBaseUrl}`,
    148.5,
    backSigY + 7.2,
    { align: 'center' }
  );
  pdf.link(100, backSigY + 4.5, 97, 4.5, {
    url: fields.permanentVerificationUrl,
  });

  // Right Signature
  pdf.addImage(sigJames, 'PNG', 221, backSigY - 11.8, 42, 10.8);
  pdf.setDrawColor(28, 37, 44);
  pdf.setLineWidth(0.25);
  pdf.line(205, backSigY, 279, backSigY);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.2);
  pdf.setTextColor(28, 37, 44);
  pdf.text(CERTIFICATE_05_META.issuer2.signerName, 242, backSigY + 4.2, { align: 'center' });

  pdf.setFont('courier', 'normal');
  pdf.setFontSize(6.8);
  pdf.setTextColor(51, 65, 85);
  pdf.text(
    `${CERTIFICATE_05_META.issuer2.shortName} (CNPJ: ${CERTIFICATE_05_META.issuer2.cnpj})`,
    242,
    backSigY + 8.0,
    { align: 'center' }
  );

  // Save Vector PDF
  pdf.save(
    `Certificado_Extensao_05_${fields.verificationCode}_Lucas_Goncalves_Silveira.pdf`
  );
}
