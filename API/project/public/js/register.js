// register.js — Complete client-side registration logic

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMessages();

  const username = document.getElementById('username').value.trim();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirmPassword').value.trim();

  // ----- Presence -----
  if (!username || !name || !email || !password || !confirmPassword || !phone) {
    return displayError('All fields are required');
  }

  // ----- Username -----
  if (!/^[a-zA-Z0-9_]{5,30}$/.test(username)) {
    return displayError('Username must be 5-30 characters, alphanumeric or underscore only');
  }

  // ----- Email -----
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return displayError('Invalid email format');
  }

  // ----- Phone -----
  if (!/^\d{10}$/.test(phone)) {
    return displayError('Phone must be exactly 10 digits');
  }

  // ----- Password -----
  if (password.length < 8 || password.length > 64) {
    return displayError('Password must be 8-64 characters');
  }
  if (!/\d/.test(password)) {
    return displayError('Password must contain at least one digit');
  }
  const upper = (password.match(/[A-Z]/g) || []).length;
  if (upper < 2) {
    return displayError('Password must contain at least 2 uppercase letters');
  }
  const lower = (password.match(/[a-z]/g) || []).length;
  if (lower < 2) {
    return displayError('Password must contain at least 2 lowercase letters');
  }
  if (password.toLowerCase() === username.toLowerCase()) {
    return displayError('Password cannot be the same as username');
  }

  // ----- Confirm Password -----
  if (password !== confirmPassword) {
    return displayError('Passwords do not match');
  }

  // ----- Name -----
  if (!/^[a-zA-Z\s\-'\.]{2,50}$/.test(name)) {
    return displayError('Name must be 2-50 characters and contain only letters, spaces, hyphens, apostrophes, or dots.');
  }

  // All validations passed — submit to server
  try {
    const res = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, name, email, phone, password, confirmPassword })
    });
    const data = await res.json();
    if (res.ok) {
      displaySuccess(data.message);
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } else {
      displayError(data.message || 'Registration failed');
    }
  } catch (err) {
    displayError('Network error');
  }
});

// Helper functions to show/hide messages
function displayError(msg) {
  document.getElementById('errorMessage').textContent = msg;
}

function displaySuccess(msg) {
  document.getElementById('successMessage').textContent = msg;
}

function clearMessages() {
  document.getElementById('errorMessage').textContent = '';
  document.getElementById('successMessage').textContent = '';
}