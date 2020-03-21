const colors = require('colors');
const Table = require('cli-table');
const _ = require('lodash');

const allowedSeverity = {
  INFO: 0,
  LOW: 1,
  MODERATE: 2,
  HIGH: 3,
  CRITICAL: 4
};

class Audit {
  constructor(severity, json, whitelist) {
    this.severity = allowedSeverity[severity.toUpperCase()];
    this.whitelist = whitelist ? whitelist.split(',') : '';

    this.isJson = json;
  }

  load(value) {
    var data = JSON.parse(value);

    let json = {
      advisories: [],
      metadata: {
        info: 0,
        low: 0,
        moderate: 0,
        high: 0,
        critical: 0
      }
    };

    _.forEach(data.advisories, (advisory) => {
      if (allowedSeverity[advisory.severity.toUpperCase()] >= this.severity && this.whitelist.indexOf(advisory.module_name) === -1) {

        json.metadata[advisory.severity] = json.metadata[advisory.severity] + 1;

        json.advisories.push(advisory);
      }
    });

    this.value = json;
  }

  get() {
    if (this.isJson) {
      return JSON.stringify(this.value, null, 2);
    } else {

      let result = '';

      _.forEach(this.value.advisories, (advisory) => {
        _.forEach(advisory.findings, (finding) => {
          _.forEach(finding.paths, (path) => {
            const table = new Table();

            let dependency = path.split('>');

            table.push(
              [advisory.severity, advisory.title],
              ['Package', advisory.module_name],
              ['Patched in', advisory.patched_versions],
              ['Dependency of', dependency[0]],
              ['Path', path],
              ['Recommendation', advisory.recommendation],
              ['More info', advisory.url]
            );

            result += table.toString() + '\n';
          });
        });
      });

      result += '\n';
      result += this.getSummary(true);

      return result;
    }
  }

  getMetaCount() {
    return Object.entries(this.value.metadata).reduce((sum, x) => sum + x[1], 0);
  }

  getCode() {
    let count = this.getMetaCount();

    return (count > 0) ? 1 : 0;
  }

  getSummary(colorColor) {
    if (this.getMetaCount() == 0) {
      return 'No vulnerabilities.';
    }

    let meta = this.value.metadata;

    if (colorColor) {
      colors.enable();
    } else {
      colors.disable();
    }

    let report = [];

    report.push(`${meta.info} ${'info'.green}`);
    report.push(`${meta.low} ${'low'.white}`);
    report.push(`${meta.moderate} ${'moderate'.yellow}`);
    report.push(`${meta.high} ${'high'.red}`);
    report.push(`${meta.critical} ${'critical'.brightRed}`);

    return `Found ${report.join(', ')} vulnerabilities.`;
  }
}

module.exports = Audit;