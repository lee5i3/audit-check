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
  constructor(severity, ignoreDev, whitelist) {
    this.severity = allowedSeverity[severity.toUpperCase()];
    this.ignoreDev = ignoreDev;
    this.whitelist = whitelist.split(',');

    this.meta = {info: 0, low: 0, moderate: 0, high: 0, critical: 0};
  }

  load(value) {
    this.value = value;
  }

  parse() {
    let data = JSON.parse(this.value)

    let self = this;

    _.forEach(data.advisories, function(advisory) {      
      if (allowedSeverity[advisory.severity.toUpperCase()] < self.severity || self.whitelist.indexOf(advisory.module_name) !== -1) {
        delete data.advisories[advisory.id];        
      }
    });

    if (this.severity > allowedSeverity.INFO) { delete data.metadata.vulnerabilities['info']; }
    if (this.severity > allowedSeverity.LOW) { delete data.metadata.vulnerabilities['low']; }
    if (this.severity > allowedSeverity.MODERATE) { delete data.metadata.vulnerabilities['moderate']; }
    if (this.severity > allowedSeverity.HIGH) { delete data.metadata.vulnerabilities['high']; }
    if (this.severity > allowedSeverity.CRITICAL) { delete data.metadata.vulnerabilities['critical']; }

    this.total = data.metadata.totalDependencies;

    return data
  }

  getJson() {
    return JSON.stringify(this.parse(), null, 2)
  }

  getTable() {
    let json = this.parse()

    let result = ''
    let self = this;

    _.forEach(json.advisories, function(advisory) {
      _.forEach(advisory.findings, function(finding){
        _.forEach(finding.paths, function(path){
          const table = new Table();

          let dependency = path.split('>');

          self.meta[advisory.severity] = self.meta[advisory.severity] + 1

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

    let count = Object.entries(this.meta).reduce((sum, x) => sum+ x[1], 0)

    return (count > 0) ? 1 : 0;
  }

  getSummary(colorColor) {
    if (colorColor) {
      colors.enable();
    } else {
      colors.disable();
    }
  
    let counter = []

    if (this.severity <= allowedSeverity.INFO) { counter.push(`${this.meta.info} ${'info'.green}`); }
    if (this.severity <= allowedSeverity.LOW) { counter.push(`${this.meta.low} ${'low'.white}`); }
    if (this.severity <= allowedSeverity.MODERATE) { counter.push(`${this.meta.moderate} ${'moderate'.yellow}`); }
    if (this.severity <= allowedSeverity.HIGH) { counter.push(`${this.meta.high} ${'high'.red}`); }
    if (this.severity <= allowedSeverity.CRITICAL) { counter.push(`${this.meta.critical} ${'critical'.brightRed}`); }

    return `Found ${counter.join(', ')} vulnerabilities in ${this.total} scanned packages.`
  }
}

module.exports = Audit