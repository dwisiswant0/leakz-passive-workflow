const { Database } = require('bun:sqlite');
const { caidoDBPath } = require('./config');

const db = new Database(caidoDBPath, { readwrite: true });

module.exports = db;
