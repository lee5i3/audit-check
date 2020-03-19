#!/usr/bin/env node

const args = require('../lib/args.js');
const Audit = require('../lib/audit.js');

const { spawn } = require('child_process');

const cmd = args();

var command_args = ['audit', '--json']
if (cmd.ignoreDev) {
  command_args.push('--production')
}

const child = spawn('npm', command_args, { stdio: ['ignore', 'pipe'], detached: false });

var stdout = '';
var stderr = '';

child.stdout.on('data', (chunk) => {
  stdout += chunk
});

child.stderr.on('data', (chunk) => {
  stderr += chunk
});

child.on('close', (code) => {
  if (code == 0) {
    console.log('No vulnerabilities found.')
    process.exit(code)
  }

  if (stderr.length > 0) {
    console.error(stderr)
    process.exit(4)
  }

  let audit = new Audit(cmd.severity, cmd.ignoreDev, cmd.whitelist);

  audit.load(stdout);

  if (cmd.json) {
    console.log(audit.getJson());
  } else {
    console.log(audit.getTable());
    console.log(audit.getSummary(true));
  }

  process.exit(audit.getCode());
});