const date = require('date-and-time');
const path = require('node:path');
const package = require(path.join(__dirname, '..', '..', 'package.json'));
const caidoTime = 'YYYY-MM-DD hh:mm:ss.SSSZZ';

function getNowDate() {
	return date.format(new Date(), caidoTime);
}

function isWorkflowExists(db = require('./db')) {
  return db.query('SELECT id FROM workflows WHERE name LIKE $name')
    .get({ $name: `${package.name}%` });
}

module.exports = { getNowDate, isWorkflowExists }