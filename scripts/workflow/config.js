const fs = require('fs');
const os = require('os');
const path = require('path');

let caidoDataDir;

// https://docs.caido.io/configuration/data_location.html
switch (os.platform()) {
	case 'linux':
		caidoDataDir = path.join(os.homedir(), '.local', 'share', 'caido');
		break;
	case 'darwin':
		caidoDataDir = path.join(os.homedir(), 'Library', 'Application Support', 'io.caido.Caido');
		break;
	case 'win32':
		caidoDataDir = path.join(process.env.APPDATA, 'caido', 'Caido', 'data');
		break;
	default:
		console.error('Unsupported OS');
		process.exit(1);
}

const caidoDBPath = path.join(caidoDataDir, 'config.db');

if (!fs.existsSync(caidoDBPath)) {
	console.error('caido DB does not exist', [caidoDBPath]);
	process.exit(1);
}

module.exports = { caidoDBPath };