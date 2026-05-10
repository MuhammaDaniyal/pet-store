/**
 * Generates a WhatsApp URL for contacting a phone number
 * @param phoneNumber - The phone number (can include country code, spaces, dashes)
 * @param message - Optional message to pre-fill
 * @returns WhatsApp URL or null if phone is invalid
 */
export function generateWhatsAppUrl(
  phoneNumber: string | null | undefined,
  message?: string
): string | null {
  if (!phoneNumber || !phoneNumber.trim()) {
    return null;
  }

  // Remove all non-digit characters and the leading + if present
  const cleanedPhone = phoneNumber.replace(/\D/g, "");

  if (!cleanedPhone) {
    return null;
  }

  const baseUrl = `https://wa.me/${cleanedPhone}`;

  if (message) {
    const encodedMessage = encodeURIComponent(message);
    return `${baseUrl}?text=${encodedMessage}`;
  }

  return baseUrl;
}
