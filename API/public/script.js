const userIdInput = document.getElementById('userIdInput');
const fetchBtn = document.getElementById('fetchBtn');
const userCard = document.getElementById('userCard');
const message = document.getElementById('message');
const messageText = document.getElementById('messageText');
const spinner = document.getElementById('spinner');

const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userAge = document.getElementById('userAge');
const userIdMeta = document.getElementById('userIdMeta');
const userCreated = document.getElementById('userCreated');

// Stats elements
const totalUsersEl = document.getElementById('totalUsers');
const avgAgeEl = document.getElementById('avgAge');
const under25El = document.getElementById('under25');
const between25And35El = document.getElementById('between25And35');
const over35El = document.getElementById('over35');

function showMessage(text, type) {
    message.className = 'message show ' + type;
    messageText.textContent = text;
}

function hideMessage() {
    message.className = 'message';
}

function showLoading(show) {
    spinner.className = 'spinner' + (show ? ' show' : '');
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

async function fetchUser(id) {
    const userId = id.trim();
    if (!userId) {
        showMessage('Please enter a User ID.', 'error');
        userCard.classList.remove('show');
        return;
    }

    hideMessage();
    showLoading(true);
    userCard.classList.remove('show');

    try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
            let errorMsg = `Server responded with ${response.status}`;
            try {
                const errData = await response.json();
                if (errData.message) errorMsg = errData.message;
            } catch (_) {}
            throw new Error(errorMsg);
        }

        const data = await response.json();
        if (!data.success) throw new Error(data.message || 'User not found.');

        const user = data.user;
        userAvatar.textContent = getInitials(user.name);
        userName.textContent = user.name || '—';
        userEmail.textContent = user.email || '—';
        userAge.textContent = user.age !== undefined && user.age !== null ? user.age : '—';
        userIdMeta.textContent = user._id || '—';
        userCreated.textContent = user.createdAt ? formatDate(user.createdAt) : '—';

        userCard.classList.add('show');
        showMessage('User loaded successfully!', 'success');
        setTimeout(() => {
            if (message.classList.contains('success')) message.className = 'message';
        }, 3000);

    } catch (error) {
        showMessage(error.message || 'Failed to fetch user.', 'error');
        userCard.classList.remove('show');
    } finally {
        showLoading(false);
    }
}

async function fetchStats() {
    try {
        const response = await fetch('/api/stats');
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                totalUsersEl.textContent = data.stats.totalUsers;
                avgAgeEl.textContent = data.stats.averageAge;
                under25El.textContent = data.stats.ageDistribution.under25;
                between25And35El.textContent = data.stats.ageDistribution.between25And35;
                over35El.textContent = data.stats.ageDistribution.over35;
            }
        }
    } catch (error) {
        console.error('Failed to fetch stats:', error);
    }
}

// Load stats on page load
fetchStats();

fetchBtn.addEventListener('click', () => fetchUser(userIdInput.value));
userIdInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        fetchUser(userIdInput.value);
    }
});
