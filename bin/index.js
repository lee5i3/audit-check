#!/usr/bin/env node

const args = require('../lib/args.js');
const Audit = require('../lib/audit.js');

const fs = require('fs');

const { spawn } = require('child_process');

const cmd = args(process.argv);

var command_args = ['audit', '--json'];
if (cmd.ignoreDev) {
  command_args.push('--production');
}

const child = spawn(process.platform == 'win32' ? 'npm.cmd' : 'npm', command_args, { stdio: ['ignore', 'pipe'], detached: false });

var stdout = '';
var stderr = '';

child.stdout.on('data', (chunk) => {
  stdout += chunk;
});

child.stderr.on('data', (chunk) => {
  stderr += chunk;
});

child.on('close', () => {
  if (stderr.length > 0) {
    console.error(stderr);
    process.exit(1);
  }

  let audit = new Audit(cmd.severity, cmd.json, cmd.whitelist);

  audit.load(stdout);
  
  let result = audit.get();

  if (cmd.output) {
    fs.writeFileSync(cmd.output, result);
  }

  console.log(result);

  process.exit(audit.getCode());
});