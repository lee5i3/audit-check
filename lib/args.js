const {
  program
} = require('commander');

module.exports = function (args) {
  program
    .option('-s, --severity <severity>', 'severity to fail on', 'info')
    .option('-w --whitelist <whitelist>', 'module to ignore (comma separated)', '')
    .option('-j --json', 'display json')
    .option('-o --output <output>', 'path to save output')
    .option('-i, --ignore-dev', 'ignore dev dependencies');

  program.parse(args);

  return program;
};