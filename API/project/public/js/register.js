document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMessages();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  if (!name || !email || !password || !confirmPassword) return displayError('All fields required');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return displayError('Invalid email');
  if (password.length < 8) return displayError('Password min 8 characters');
  if (password !== confirmPassword) return displayError('Passwords do not match');
  try {
    const res = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      displaySuccess('Registration successful! Redirecting...');
      setTimeout(() => { window.location.href = '/dashboard'; }, 1000);
    } else {
      displayError(data.message);
    }
  } catch (err) {
    displayError('Network error');
  }
});

function displayError(msg) { document.getElementById('errorMessage').textContent = msg; }
function displaySuccess(msg) { document.getElementById('successMessage').textContent = msg; }
function clearMessages() { document.getElementById('errorMessage').textContent = ''; document.getElementById('successMessage').textContent = ''; }