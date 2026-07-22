const WHATSAPP_NUMBER = '919256525580';

const DEFAULT_MESSAGE =
  'Hi, I would like to book a diagnostic test or health package. Please help me get started.';

/**
 * Build a WhatsApp chat URL with an optional prefilled message.
 * @param {string} [message]
 * @returns {string}
 */
export function getWhatsAppUrl(message = DEFAULT_MESSAGE) {
  const text = (message || DEFAULT_MESSAGE).trim();
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Open WhatsApp in a new tab.
 * @param {string} [message]
 */
export function openWhatsApp(message) {
  window.open(getWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
}

/**
 * Prefill message for a specific test or package booking.
 */
export function getBookingWhatsAppMessage(item, itemType = 'test') {
  if (!item?.name) return DEFAULT_MESSAGE;
  const kind = itemType === 'package' ? 'health package' : 'diagnostic test';
  const price = item.price != null ? ` (₹${item.price})` : '';
  return `Hi, I would like to book the ${kind} "${item.name}"${price}. Please help me confirm a slot.`;
}
