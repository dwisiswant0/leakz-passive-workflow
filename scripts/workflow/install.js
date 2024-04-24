const db = require('./db');
const path = require('node:path');
const { getNowDate, isWorkflowExists } = require('./utils');
const workflow = require(path.join(__dirname, '..', '..', 'dist', 'Leakz.json'));

if (isWorkflowExists()) console.error('workflow already installed'), process.exit(1);

const addWorkflow = db.query(
  'INSERT INTO workflows (definition, enabled, created_at, updated_at) ' +
  'VALUES ($definition, $enabled, $now, $now)'
).run({
  $definition: JSON.stringify(workflow),
  $enabled: 1,
  $now: getNowDate()
});

if (isWorkflowExists()) console.log('workflow successfully installed');

db.close(false);
