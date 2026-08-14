document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMessages();
  const identifier = document.getElementById('identifier').value.trim();
  const password = document.getElementById('password').value.trim();
  const isAdmin = document.getElementById('isAdmin').checked;

  if (!identifier || !password) {
    return displayError('Please fill in all fields');
  }

  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password, isAdmin })
    });
    const data = await res.json();
    if (res.ok) {
      displaySuccess(data.message);
      setTimeout(() => { window.location.href = data.redirect; }, 1000);
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