/**
 * Mock payment validation (no actual payments processed)
 * Pure functions - no side effects
 */

export interface PaymentDetails {
  card_number: string;
  expiry: string;
  cvc: string;
}

/**
 * Luhn algorithm to validate card numbers
 */
function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

/**
 * Validate card number
 * Returns error code or null if valid
 */
export function validateCardNumber(cardNumber: string): string | null {
  const cleaned = cardNumber.replace(/[\s-]/g, "");
  if (!/^\d+$/.test(cleaned) || !luhnCheck(cleaned)) {
    return "INVALID_CARD";
  }
  return null;
}

/**
 * Validate expiry date (MM/YY format)
 * Returns error code or null if valid
 */
export function validateExpiry(expiry: string): string | null {
  const [month, year] = expiry.split("/").map((s) => s.trim());
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);

  if (!month || !year || m < 1 || m > 12) {
    return "INVALID_CARD";
  }

  // Assume YY < 50 is 20XX, >= 50 is 19XX
  const fullYear = y < 50 ? 2000 + y : 1900 + y;
  const expiryDate = new Date(fullYear, m, 0); // Last day of month
  if (expiryDate < new Date()) {
    return "CARD_EXPIRED";
  }

  return null;
}

/**
 * Validate CVC (3 or 4 digits)
 * Returns error code or null if valid
 */
export function validateCVC(cvc: string): string | null {
  if (!/^\d{3,4}$/.test(cvc)) {
    return "INVALID_CARD";
  }
  return null;
}

/**
 * Authorize payment (mock)
 * Returns error code or null if authorized
 */
export function authorizePayment(payment: PaymentDetails): string | null {
  // Validate card number
  const cardError = validateCardNumber(payment.card_number);
  if (cardError) return cardError;

  // Validate expiry
  const expiryError = validateExpiry(payment.expiry);
  if (expiryError) return expiryError;

  // Validate CVC
  const cvcError = validateCVC(payment.cvc);
  if (cvcError) return cvcError;

  // Mock decline for cards ending in 0002
  const last4 = payment.card_number.replace(/\D/g, "").slice(-4);
  if (last4 === "0002") {
    return "PAYMENT_DECLINED";
  }

  // Otherwise, authorized
  return null;
}

/**
 * Extract last 4 digits of card
 */
export function getCardLast4(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, "");
  return digits.slice(-4);
}
