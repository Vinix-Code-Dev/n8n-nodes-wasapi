export interface ExportContactsRequest {
  /**
   * Lista de direcciones de correo electrónico donde se enviará la exportación.
   * Máximo 5 correos. Si no se especifica, se enviará al correo del solicitante y al usuario principal.
   */
  email_urls?: string[]; // length <= 5
}

/**
 * Valida que la solicitud de exportación de contactos sea válida
 * @param data - Datos de la solicitud de exportación
 * @returns true si la solicitud es válida, false en caso contrario
 */
export function isValidExportContactsRequest(data: ExportContactsRequest): boolean {
  // Si no hay email_urls, es válido (se enviará al correo del solicitante y usuario principal)
  if (!data.email_urls) {
    return true;
  }

  // Validar que no exceda 5 correos
  if (data.email_urls.length > 5) {
    return false;
  }

  // Validar que todos los correos tengan formato válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return data.email_urls.every(email => emailRegex.test(email));
}
