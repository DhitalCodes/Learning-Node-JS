/**
 * Validate email format and length
 */
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length === 0 || trimmed.length > 100) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}

/**
 * Validate password: length 8-64, at least one digit, 
 * at least 2 uppercase, 2 lowercase, not equal to username
 */
function isValidPassword(password, username) {
  if (typeof password !== 'string') return false;
  const trimmed = password.trim();
  if (trimmed.length < 8 || trimmed.length > 64) return false;
  // At least one digit
  if (!/\d/.test(trimmed)) return false;
  // At least 2 uppercase
  const upper = (trimmed.match(/[A-Z]/g) || []).length;
  if (upper < 2) return false;
  // At least 2 lowercase
  const lower = (trimmed.match(/[a-z]/g) || []).length;
  if (lower < 2) return false;
  // Must not be same as username (case-insensitive)
  if (username && trimmed.toLowerCase() === username.toLowerCase()) return false;
  return true;
}

/**
 * Validate username: length 5-30, alphanumeric and underscores only,
 * no special characters like @, ., etc.
 */
function isValidUsername(username) {
  if (typeof username !== 'string') return false;
  const trimmed = username.trim();
  if (trimmed.length < 5 || trimmed.length > 30) return false;
  // Only letters, numbers, underscore
  return /^[a-zA-Z0-9_]+$/.test(trimmed);
}

/**
 * Validate name: length 2-50, only letters, spaces, hyphens, apostrophes, dots.
 */
function isValidName(name) {
  if (typeof name !== 'string') return false;
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 50) return false;
  return /^[a-zA-Z\s\-'\.]+$/.test(trimmed);
}

/**
 * Validate phone number: exactly 10 digits, digits only.
 */
function isValidPhone(phone) {
  if (typeof phone !== 'string') return false;
  const trimmed = phone.trim();
  return /^\d{10}$/.test(trimmed);
}

/**
 * Validate user ID: positive integer
 */
function isValidUserId(id) {
  const num = Number(id);
  return Number.isInteger(num) && num > 0;
}

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidUsername,
  isValidName,
  isValidPhone,
  isValidUserId
};