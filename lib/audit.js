const { spawn } = require('child_process');
const colors = require('colors');
const Table = require('cli-table');
const _ = require('lodash');

const allowedSeverity = {
  INFO: 0,
  LOW: 1,
  MODERATE: 2,
  HIGH: 3,
  CRITICAL: 4
}

class Audit {
  constructor(severity, ignoreDev) {
    this.severity = allowedSeverity[severity.toUpperCase()];
    this.ignoreDev = ignoreDev;
  }

  load(value) {
    this.value = value;
  }

  parse() {
    let data = JSON.parse(this.value)

    let self = this;

    _.forEach(data.advisories, function(advisory) {
      if (allowedSeverity[advisory.severity.toUpperCase()] < self.severity) {
        delete data.advisories[advisory.id];        
      }
    });

    if (this.severity > allowedSeverity.INFO) { delete data.metadata.vulnerabilities['info']; }
    if (this.severity > allowedSeverity.LOW) { delete data.metadata.vulnerabilities['low']; }
    if (this.severity > allowedSeverity.MODERATE) { delete data.metadata.vulnerabilities['moderate']; }
    if (this.severity > allowedSeverity.HIGH) { delete data.metadata.vulnerabilities['high']; }
    if (this.severity > allowedSeverity.CRITICAL) { delete data.metadata.vulnerabilities['critical']; }

    return data
  }

  getJson() {
    return JSON.stringify(this.parse())
  }

  getTable() {
    let json = this.parse()

    let result = ''

    _.forEach(json.advisories, function(advisory) {
      _.forEach(advisory.findings, function(finding){
        _.forEach(finding.paths, function(path){
          const table = new Table();

          let dependency = path.split('>');

          table.push(
            [advisory.severity, advisory.title],
            ["Package", advisory.module_name],
            ["Patched in", advisory.patched_versions],
            ["Dependency of", dependency[0]],
            ["Path", path],
            ["Recommendation", advisory.recommendation],
            ["More info", advisory.url]
          );

          result += table.toString() + '\n';
        });
      });
    });

    return result
  }

  getCode() {
    let json = this.parse()

    let count = Object.entries(json.metadata.vulnerabilities).reduce((sum, x) => sum+ x[1], 0)

    return (count > 0) ? 1 : 0;
  }

  getSummary(colorColor) {
    if (colorColor) {
      colors.enable();
    } else {
      colors.disable();
    }

    let json = this.parse()
   
    let vuln = json.metadata.vulnerabilities;
    let total = json.metadata.totalDependencies;

    let counter = []

    if (this.severity <= allowedSeverity.INFO) { counter.push(`${vuln.info} ${'info'.green}`); }
    if (this.severity <= allowedSeverity.LOW) { counter.push(`${vuln.low} ${'low'.white}`); }
    if (this.severity <= allowedSeverity.MODERATE) { counter.push(`${vuln.moderate} ${'moderate'.yellow}`); }
    if (this.severity <= allowedSeverity.HIGH) { counter.push(`${vuln.high} ${'high'.red}`); }
    if (this.severity <= allowedSeverity.CRITICAL) { counter.push(`${vuln.critical} ${'critical'.brightRed}`); }

    return `Found ${counter.join(', ')} vulnerabilities in ${total} scanned packages.`
  }
}

module.exports = Audit