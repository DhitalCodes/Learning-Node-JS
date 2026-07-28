document.getElementById('searchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const userId = document.getElementById('userId').value.trim();
  const resultDiv = document.getElementById('searchResult');
  resultDiv.innerHTML = '';
  resultDiv.classList.add('hidden');
  if (!userId) {
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = '<p class="error-message">Please enter a user ID</p>';
    return;
  }
  try {
    const res = await fetch('/admin/user/' + userId);
    const data = await res.json();
    resultDiv.classList.remove('hidden');
    if (res.ok) {
      resultDiv.innerHTML = `<h3>User Found</h3>
        <p><strong>ID:</strong> ${data.id}</p>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Password (hashed):</strong> ${data.password}</p>`;
    } else {
      resultDiv.innerHTML = `<p class="error-message">${data.message || 'User not found'}</p>`;
    }
  } catch (err) {
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = '<p class="error-message">Network error</p>';
  }
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetch('/logout', { method: 'POST' });
  window.location.href = '/login';
});