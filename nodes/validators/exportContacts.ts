export interface ExportContactsRequest {
  /**
   * List of email addresses where the export will be sent.
   * Maximum 5 emails. If not specified, it will be sent to the requester's email and the main user.
   */
  email_urls?: string[]; // length <= 5
}

/**
 * Validates that the contact export request is valid
 * @param data - Export request data
 * @returns true if the request is valid, false otherwise
 */
export function isValidExportContactsRequest(data: ExportContactsRequest): boolean {
  // If no email_urls, it is valid (will be sent to the requester's email and main user)
  if (!data.email_urls) {
    return true;
  }

  // Validate that it does not exceed 5 emails
  if (data.email_urls.length > 5) {
    return false;
  }

  // Validate that all emails have a valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return data.email_urls.every(email => emailRegex.test(email));
}
