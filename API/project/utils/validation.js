/**
 * Validate email format and length
 */
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length === 0 || trimmed.length > 100) return false;
  // Basic email regex (allows most common formats)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}

/**
 * Validate password: length 8-64, must contain at least one letter and one digit
 */
function isValidPassword(password) {
  if (typeof password !== 'string') return false;
  const trimmed = password.trim();
  if (trimmed.length < 8 || trimmed.length > 64) return false;
  // At least one letter and one digit
  return /[a-zA-Z]/.test(trimmed) && /\d/.test(trimmed);
}

/**
 * Validate name: length 2-50, only letters, spaces, hyphens, apostrophes allowed
 */
function isValidName(name) {
  if (typeof name !== 'string') return false;
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 50) return false;
  // Allow letters, spaces, hyphens, apostrophes, and dots
  return /^[a-zA-Z\s\-'\.]+$/.test(trimmed);
}

/**
 * Validate user ID: must be a positive integer
 */
function isValidUserId(id) {
  const num = Number(id);
  return Number.isInteger(num) && num > 0;
}

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidUserId
};