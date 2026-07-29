const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const QRCode = require('qrcode');

/**
 * Genera un PDF oficial institucional en buffer para la PQR especificada.
 */
async function generatePqrPdf(pqr, appUrl = 'http://localhost:3000') {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 (puntos)
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Colores principales
  const redColor = rgb(211 / 255, 47 / 255, 47 / 255);    // #D32F2F
  const greenColor = rgb(76 / 255, 175 / 255, 80 / 255);  // #4CAF50
  const blueColor = rgb(2 / 255, 136 / 255, 209 / 255);   // #0288D1
  const grayColor = rgb(120 / 255, 144 / 255, 156 / 255); // #78909C
  const darkColor = rgb(33 / 255, 33 / 255, 33 / 255);

  // Encabezado institucional (Franja superior tricolor)
  page.drawRectangle({ x: 0, y: height - 12, width: width / 3, height: 12, color: redColor });
  page.drawRectangle({ x: width / 3, y: height - 12, width: width / 3, height: 12, color: greenColor });
  page.drawRectangle({ x: (2 * width) / 3, y: height - 12, width: width / 3, height: 12, color: blueColor });

  // Título Institucional
  let y = height - 50;

  page.drawText('CONJUNTO RESIDENCIAL PARQUES DE ALEJANDRÍA', {
    x: 40,
    y: y,
    size: 14,
    font: fontBold,
    color: darkColor,
  });

  y -= 18;
  page.drawText('COMITÉ DE CONVIVENCIA - COMPROBANTE OFICIAL DE RADICACIÓN', {
    x: 40,
    y: y,
    size: 10,
    font: fontBold,
    color: redColor,
  });

  // Línea divisoria
  y -= 15;
  page.drawLine({
    start: { x: 40, y: y },
    end: { x: width - 40, y: y },
    thickness: 1,
    color: grayColor,
  });

  // Cuadro de Radicado
  y -= 50;
  page.drawRectangle({
    x: 40,
    y: y - 10,
    width: width - 80,
    height: 45,
    color: rgb(245 / 255, 247 / 255, 250 / 255),
    borderColor: blueColor,
    borderWidth: 1,
  });

  page.drawText('NÚMERO DE RADICADO:', {
    x: 55,
    y: y + 15,
    size: 10,
    font: fontBold,
    color: grayColor,
  });

  page.drawText(pqr.radicado, {
    x: 55,
    y: y - 2,
    size: 16,
    font: fontBold,
    color: blueColor,
  });

  const fechaFormat = new Date(pqr.createdAt).toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  page.drawText(`FECHA DE RADICACIÓN: ${fechaFormat}`, {
    x: 280,
    y: y + 15,
    size: 9,
    font: fontRegular,
    color: darkColor,
  });

  page.drawText(`ESTADO INICIAL: ${pqr.status.toUpperCase()}`, {
    x: 280,
    y: y - 2,
    size: 9,
    font: fontBold,
    color: greenColor,
  });

  // Generar Código QR de seguimiento
  const trackingUrl = `${appUrl}/consultar?radicado=${pqr.radicado}`;
  const qrDataUrl = await QRCode.toDataURL(trackingUrl, { margin: 1, width: 120 });
  const qrBase64 = qrDataUrl.split(',')[1];
  const qrImageBytes = Buffer.from(qrBase64, 'base64');
  const qrImage = await pdfDoc.embedPng(qrImageBytes);

  page.drawImage(qrImage, {
    x: width - 130,
    y: y - 8,
    width: 75,
    height: 75,
  });

  // Sección 1: Datos del Residente
  y -= 50;
  page.drawText('1. DATOS DEL SOLICITANTE', {
    x: 40,
    y: y,
    size: 11,
    font: fontBold,
    color: darkColor,
  });

  y -= 8;
  page.drawLine({ start: { x: 40, y: y }, end: { x: width - 40, y: y }, thickness: 0.5, color: grayColor });

  y -= 20;
  page.drawText(`Nombre Completo: ${pqr.residentName}`, { x: 40, y: y, size: 10, font: fontRegular, color: darkColor });
  y -= 16;
  page.drawText(`Ubicación: Torre ${pqr.tower} - Apartamento ${pqr.apartment}`, { x: 40, y: y, size: 10, font: fontRegular, color: darkColor });
  y -= 16;
  page.drawText(`Correo Electrónico: ${pqr.email}`, { x: 40, y: y, size: 10, font: fontRegular, color: darkColor });
  y -= 16;
  page.drawText(`Teléfono / Celular: ${pqr.phone}`, { x: 40, y: y, size: 10, font: fontRegular, color: darkColor });

  // Sección 2: Clasificación y Detalles de la PQR
  y -= 30;
  page.drawText('2. DETALLES DE LA SOLICITUD', {
    x: 40,
    y: y,
    size: 11,
    font: fontBold,
    color: darkColor,
  });

  y -= 8;
  page.drawLine({ start: { x: 40, y: y }, end: { x: width - 40, y: y }, thickness: 0.5, color: grayColor });

  y -= 20;
  page.drawText(`Tipo de Solicitud: ${pqr.type.toUpperCase()}`, { x: 40, y: y, size: 10, font: fontBold, color: redColor });
  y -= 18;
  page.drawText(`Asunto: ${pqr.subject}`, { x: 40, y: y, size: 10, font: fontBold, color: darkColor });

  y -= 22;
  page.drawText('Descripción:', { x: 40, y: y, size: 10, font: fontBold, color: darkColor });

  // Texto multilínea ajustado para la descripción
  y -= 16;
  const descLines = wrapText(pqr.description, 85);
  for (const line of descLines.slice(0, 15)) {
    page.drawText(line, { x: 40, y: y, size: 9, font: fontRegular, color: darkColor });
    y -= 14;
  }

  if (pqr.attachments && pqr.attachments.length > 0) {
    y -= 10;
    page.drawText(`Archivos adjuntos: ${pqr.attachments.length} archivo(s) registrado(s)`, {
      x: 40,
      y: y,
      size: 9,
      font: fontBold,
      color: grayColor,
    });
  }

  // Pie de página institucional
  const pageHeightEnd = 50;
  page.drawLine({ start: { x: 40, y: pageHeightEnd }, end: { x: width - 40, y: pageHeightEnd }, thickness: 0.5, color: grayColor });

  page.drawText('Documento generado automáticamente por la PWA del Comité de Convivencia - Parques de Alejandría.', {
    x: 40,
    y: pageHeightEnd - 15,
    size: 8,
    font: fontRegular,
    color: grayColor,
  });

  page.drawText(`Escanee el código QR o consulte en: ${appUrl}/consultar`, {
    x: 40,
    y: pageHeightEnd - 26,
    size: 8,
    font: fontRegular,
    color: blueColor,
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

function wrapText(text, maxCharsPerLine) {
  const words = text.replace(/\r\n/g, '\n').split(/\s+/);
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

module.exports = {
  generatePqrPdf
};
