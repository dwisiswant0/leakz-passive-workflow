const db = require('./db');
const { isWorkflowExists } = require('./utils');

const workflow = isWorkflowExists();
if (!workflow) console.error('workflow is not installed'), process.exit(1);

const rmWorkflow = db.query('DELETE FROM workflows WHERE id = $id')
  .run({ $id: workflow.id });

if (!isWorkflowExists()) console.log('workflow successfully removed');

db.close(false);
