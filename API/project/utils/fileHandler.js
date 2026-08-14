const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist yet — return empty array
      return [];
    }
    // Re-throw real errors (corrupt JSON, permission denied, etc.)
    throw error;
  }
}

async function writeUsers(users) {
  // Ensure the data directory exists before writing
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

async function findUserByEmail(email) {
  const users = await readUsers();
  return users.find(user => user.email === email);
}

async function findUserByUsername(username) {
  const users = await readUsers();
  return users.find(user => user.username === username);
}

async function findUserByPhone(phone) {
  const users = await readUsers();
  return users.find(user => user.phone === phone);
}

async function findUserById(id) {
  const users = await readUsers();
  return users.find(user => user.id === id);
}

module.exports = { 
  readUsers, 
  writeUsers, 
  findUserByEmail, 
  findUserByUsername,
  findUserByPhone,
  findUserById 
};