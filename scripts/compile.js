const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const package = require(path.join(__dirname, '..', 'package.json'));

function uuid() {
  const uuid = crypto.randomBytes(16);
  uuid[6] = (uuid[6] & 0x0f) | 0x40;
  uuid[8] = (uuid[8] & 0x3f) | 0x80;
  return uuid.toString('hex').match(/.{8}|.{4}|.{4}|.{4}|.{12}/g).join('-');
}

const workflowTmplPath = path.join(__dirname, '..', 'src', 'workflow.tmpl.json');
const workflowTmplBuf = fs.readFileSync(workflowTmplPath);
const workflowTmplData = workflowTmplBuf.toString('utf-8');
const workflowTmpl = JSON.parse(workflowTmplData);
const workflowOutput = path.join(__dirname, '..', 'dist', 'Leakz.json');

const leakzScriptPath = path.join(__dirname, '..', 'dist', 'leakz.js');
const leakzScriptBuf = fs.readFileSync(leakzScriptPath);
let leakzScriptData = leakzScriptBuf.toString('utf-8');

if (workflowTmpl.hasOwnProperty('id') && workflowTmpl.id === '${UUID}') {
  workflowTmpl.id = uuid();
}

if (workflowTmpl.hasOwnProperty('name') && workflowTmpl.name === package.name) {
  workflowTmpl.name += ` v${package.version}`;
}

for (let [n, node] of workflowTmpl.graph.nodes.entries()) {
  for (let [i, input] of node.inputs.entries()) {
    if (!input.hasOwnProperty('value')) continue;
    if (!input.value.hasOwnProperty('data') || input.value.data !== '${DATA}') continue;

    let data = `// Licensed to ${package.author} under one or more agreements.\n` +
      `// ${package.author} licenses this file to you under the ` +
      `${package.license} License.\n${leakzScriptData}`;

    workflowTmpl.graph.nodes[n].inputs[i].value.data = data;
  }
}

fs.writeFile(workflowOutput, JSON.stringify(workflowTmpl, null, 2), (err) => {
  if (err) {
    console.error('err writing to file:', err);
    return;
  }

  console.log('workflow compiled successfully!', [workflowOutput]);
});
