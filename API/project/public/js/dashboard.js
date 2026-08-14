async function loadUserProfile() {
  const profileDiv = document.getElementById('profileInfo');
  const greeting = document.getElementById('greeting');
  try {
    const res = await fetch('/user/profile');
    const data = await res.json();
    if (res.ok) {
      // Update greeting
      greeting.textContent = `Hello, ${data.name}!`;
      // Show profile details
      profileDiv.innerHTML = `
  <p><strong>User ID:</strong> ${data.id}</p>
  <p><strong>Username:</strong> ${data.username}</p>
  <p><strong>Name:</strong> ${data.name}</p>
  <p><strong>Email:</strong> ${data.email}</p>
  <p><strong>Phone:</strong> ${data.phone}</p>`;
    } else {
      if (res.status === 401 || res.status === 403) window.location.href = '/login';
      else profileDiv.innerHTML = `<p class="error-message">${data.message}</p>`;
    }
  } catch (err) {
    profileDiv.innerHTML = '<p class="error-message">Failed to load profile</p>';
  }
}

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetch('/logout', { method: 'POST' });
  window.location.href = '/login';
});

window.addEventListener('DOMContentLoaded', loadUserProfile);