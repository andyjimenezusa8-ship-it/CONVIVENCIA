const nodemailer = require('nodemailer');

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user) {
    return null; // SMTP no configurado
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Notificación cuando se crea una PQR
 */
async function sendPqrCreatedNotification(pqr, pdfBuffer) {
  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || '"Comité de Convivencia" <notificaciones@parquesdealejandria.com>';
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const trackingUrl = `${appUrl}/consultar?radicado=${pqr.radicado}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #D32F2F; color: white; padding: 20px; text-align: center;">
        <h2 style="margin: 0; font-size: 20px;">Conjunto Residencial Parques de Alejandría</h2>
        <p style="margin: 5px 0 0 0; font-size: 14px;">Comité de Convivencia</p>
      </div>
      <div style="padding: 24px; color: #333333; line-height: 1.6;">
        <h3 style="color: #0288D1; margin-top: 0;">¡Su PQR ha sido radicada exitosamente!</h3>
        <p>Estimado(a) <strong>${pqr.residentName}</strong>,</p>
        <p>Confirmamos la recepción de su solicitud ante el Comité de Convivencia.</p>
        
        <div style="background-color: #f5f7fa; border-left: 4px solid #0288D1; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold; font-size: 16px; color: #0288D1;">Radicado: ${pqr.radicado}</p>
          <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Tipo:</strong> ${pqr.type}</p>
          <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Asunto:</strong> ${pqr.subject}</p>
          <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Fecha:</strong> ${new Date(pqr.createdAt).toLocaleString('es-CO')}</p>
        </div>

        <p>Adjunto a este correo encontrará el comprobante oficial en formato PDF con el código QR correspondiente.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${trackingUrl}" style="background-color: #388E3C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Consultar Estado de Radicado</a>
        </div>
      </div>
      <div style="background-color: #f0f4f8; padding: 15px; text-align: center; font-size: 12px; color: #666666;">
        Mensaje automático enviado por el Comité de Convivencia - Parques de Alejandría.
      </div>
    </div>
  `;

  if (!transporter) {
    console.log(`[EMAIL MOCK] Notificación de creación enviada a ${pqr.email} para Radicado: ${pqr.radicado}`);
    return;
  }

  try {
    // Enviar al residente
    await transporter.sendMail({
      from,
      to: pqr.email,
      subject: `[Radicado ${pqr.radicado}] Confirmación de PQR - Parques de Alejandría`,
      html: htmlContent,
      attachments: pdfBuffer ? [
        {
          filename: `Comprobante-${pqr.radicado}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ] : []
    });

    // Enviar notificación a la administración
    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@parquesdealejandria.com';
    if (adminEmail !== pqr.email) {
      await transporter.sendMail({
        from,
        to: adminEmail,
        subject: `[NUEVA PQR - ${pqr.radicado}] ${pqr.type} - Torre ${pqr.tower} Apto ${pqr.apartment}`,
        html: `<p>Se ha recibido una nueva PQR en el sistema.</p><p><strong>Radicado:</strong> ${pqr.radicado}</p><p><strong>Solicitante:</strong> ${pqr.residentName}</p><p><strong>Asunto:</strong> ${pqr.subject}</p>`
      });
    }
  } catch (error) {
    console.error('Error enviando correo de creación de PQR:', error.message);
  }
}

/**
 * Notificación de cambio de estado
 */
async function sendPqrStatusUpdatedNotification(pqr, previousState, newState, notes) {
  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || '"Comité de Convivencia" <notificaciones@parquesdealejandria.com>';
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const trackingUrl = `${appUrl}/consultar?radicado=${pqr.radicado}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0288D1; color: white; padding: 20px; text-align: center;">
        <h2 style="margin: 0; font-size: 20px;">Actualización de Estado de PQR</h2>
        <p style="margin: 5px 0 0 0; font-size: 14px;">Radicado: ${pqr.radicado}</p>
      </div>
      <div style="padding: 24px; color: #333333; line-height: 1.6;">
        <p>Estimado(a) <strong>${pqr.residentName}</strong>,</p>
        <p>El estado de su solicitud ante el Comité de Convivencia ha cambiado.</p>
        
        <div style="background-color: #f5f7fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0;"><strong>Estado Anterior:</strong> ${previousState}</p>
          <p style="margin: 0 0 8px 0; font-size: 16px; color: #388E3C;"><strong>Nuevo Estado:</strong> ${newState}</p>
          ${notes ? `<p style="margin: 8px 0 0 0; color: #555555;"><strong>Observación:</strong> ${notes}</p>` : ''}
        </div>

        <div style="text-align: center; margin: 25px 0;">
          <a href="${trackingUrl}" style="background-color: #0288D1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Ver Historial Completo</a>
        </div>
      </div>
    </div>
  `;

  if (!transporter) {
    console.log(`[EMAIL MOCK] Cambio de estado para ${pqr.radicado} (${previousState} -> ${newState}) enviado a ${pqr.email}`);
    return;
  }

  try {
    await transporter.sendMail({
      from,
      to: pqr.email,
      subject: `[Actualización ${pqr.radicado}] Nuevo estado: ${newState}`,
      html: htmlContent,
    });
  } catch (error) {
    console.error('Error enviando correo de cambio de estado:', error.message);
  }
}

module.exports = {
  sendPqrCreatedNotification,
  sendPqrStatusUpdatedNotification
};
