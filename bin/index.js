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
    process.exit(1)
  }

  let audit = new Audit(cmd.severity, cmd.json, cmd.whitelist);

  audit.load(stdout);

  console.log(audit.get());

  process.exit(audit.getCode());
});