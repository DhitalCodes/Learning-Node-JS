const fs = require('fs').promises;
const path = require('path');

const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

async function findUserByEmail(email) {
  const users = await readUsers();
  return users.find(user => user.email === email);
}

async function findUserById(id) {
  const users = await readUsers();
  return users.find(user => user.id === id);
}

module.exports = { readUsers, writeUsers, findUserByEmail, findUserById };