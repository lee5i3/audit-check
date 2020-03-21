const {
  spawn
} = require('child_process');
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
  constructor(severity, json, whitelist) {
    this.severity = allowedSeverity[severity.toUpperCase()];
    this.whitelist = whitelist.split(',');

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
    }

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

      let result = ''

      _.forEach(this.value.advisories, (advisory) => {
        _.forEach(advisory.findings, (finding) => {
          _.forEach(finding.paths, (path) => {
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
  }

  // parse() {
  //   let data = JSON.parse(this.value)

  //   _.forEach(data.advisories, (advisory) => {      
  //     if (allowedSeverity[advisory.severity.toUpperCase()] < this.severity || this.whitelist.indexOf(advisory.module_name) !== -1) {
  //       delete data.advisories[advisory.id];        
  //     }
  //   });

  //   if (this.severity > allowedSeverity.INFO) { delete data.metadata.vulnerabilities['info']; }
  //   if (this.severity > allowedSeverity.LOW) { delete data.metadata.vulnerabilities['low']; }
  //   if (this.severity > allowedSeverity.MODERATE) { delete data.metadata.vulnerabilities['moderate']; }
  //   if (this.severity > allowedSeverity.HIGH) { delete data.metadata.vulnerabilities['high']; }
  //   if (this.severity > allowedSeverity.CRITICAL) { delete data.metadata.vulnerabilities['critical']; }

  //   this.total = data.metadata.totalDependencies;

  //   return data
  // }

  // getJson() {
  //   return JSON.stringify(this.parse(), null, 2)
  // }

  // getTable() {
  //   let json = this.parse()

  //   let result = ''

  //   _.forEach(json.advisories, (advisory) => {
  //     _.forEach(advisory.findings, (finding) => {
  //       _.forEach(finding.paths, (path) => {
  //         const table = new Table();

  //         let dependency = path.split('>');

  //         this.meta[advisory.severity] = this.meta[advisory.severity] + 1

  //         table.push(
  //           [advisory.severity, advisory.title],
  //           ["Package", advisory.module_name],
  //           ["Patched in", advisory.patched_versions],
  //           ["Dependency of", dependency[0]],
  //           ["Path", path],
  //           ["Recommendation", advisory.recommendation],
  //           ["More info", advisory.url]
  //         );

  //         result += table.toString() + '\n';
  //       });
  //     });
  //   });

  //   return result
  // }

  getCode() {
    let count = Object.entries(this.value.metadata).reduce((sum, x) => sum + x[1], 0)

    return (count > 0) ? 1 : 0;
  }

  // getSummary(colorColor) {
  //   if (colorColor) {
  //     colors.enable();
  //   } else {
  //     colors.disable();
  //   }

  //   let counter = []

  //   if (this.severity <= allowedSeverity.INFO) { counter.push(`${this.meta.info} ${'info'.green}`); }
  //   if (this.severity <= allowedSeverity.LOW) { counter.push(`${this.meta.low} ${'low'.white}`); }
  //   if (this.severity <= allowedSeverity.MODERATE) { counter.push(`${this.meta.moderate} ${'moderate'.yellow}`); }
  //   if (this.severity <= allowedSeverity.HIGH) { counter.push(`${this.meta.high} ${'high'.red}`); }
  //   if (this.severity <= allowedSeverity.CRITICAL) { counter.push(`${this.meta.critical} ${'critical'.brightRed}`); }

  //   return `Found ${counter.join(', ')} vulnerabilities in ${this.total} scanned packages.`
  // }
}

module.exports = Audit