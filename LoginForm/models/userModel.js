const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../data/users.json');

function getUsers() {
    if (!fs.existsSync(usersFile)) return [];
    return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
}

function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function create(username, password) {
    const users = getUsers();

    if (users.find(user => user.username === username)) {
        return null;
    }

    const user = { username, password };
    users.push(user);
    saveUsers(users);

    return user;
}

function validateCredentials(username, password) {
    const users = getUsers();
    return users.find(
        user => user.username === username && user.password === password
    );
}

module.exports = {
    create,
    validateCredentials
};
