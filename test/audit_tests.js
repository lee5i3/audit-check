const assert = require('assert');
const fs = require('fs');
const _ = require('lodash');

const Audit = require('../lib/audit.js');

describe('Audit Tests', function () {

  describe('data tests', function () {
    const testCases = [
      {
        args: { file: 'none.json', severity: 'low', json: true },
        expected: { code: 0, metadata: { info: 0, low: 0, moderate: 0, high: 0, critical: 0 } }
      },
      {
        args: { file: 'single-low.json', severity: 'low', json: true },
        expected: { code: 1, metadata: { info: 0, low: 1, moderate: 0, high: 0, critical: 0 } }
      },
      {
        args: { file: 'single-low.json', severity: 'low', json: false },
        expected: { code: 1, metadata: { info: 0, low: 1, moderate: 0, high: 0, critical: 0 } }
      },
      {
        args: { file: 'single-low.json', severity: 'low', json: true, whitelist: 'uglify-js' },
        expected: { code: 0, metadata: { info: 0, low: 0, moderate: 0, high: 0, critical: 0 } }
      },
      {
        args: { file: 'many-low.json', severity: 'low', json: true },
        expected: { code: 1, metadata: { info: 0, low: 3, moderate: 0, high: 0, critical: 0 } }
      },
      {
        args: { file: 'many-low.json', severity: 'low', json: true, whitelist: 'debug' },
        expected: { code: 1, metadata: { info: 0, low: 2, moderate: 0, high: 0, critical: 0 } }
      },
      {
        args: { file: 'many-low.json', severity: 'low', json: true, whitelist: 'non-existant' },
        expected: { code: 1, metadata: { info: 0, low: 3, moderate: 0, high: 0, critical: 0 } }
      },
      {
        args: { file: 'many.json', severity: 'info', json: true },
        expected: { code: 1, metadata: { info: 1, low: 1, moderate: 1, high: 1, critical: 1 } }
      },
      {
        args: { file: 'many.json', severity: 'low', json: true },
        expected: { code: 1, metadata: { info: 0, low: 1, moderate: 1, high: 1, critical: 1 } }
      },
      {
        args: { file: 'many.json', severity: 'moderate', json: true },
        expected: { code: 1, metadata: { info: 0, low: 0, moderate: 1, high: 1, critical: 1 } }
      },
      {
        args: { file: 'many.json', severity: 'high', json: true },
        expected: { code: 1, metadata: { info: 0, low: 0, moderate: 0, high: 1, critical: 1 } }
      },
      {
        args: { file: 'many.json', severity: 'critical', json: true },
        expected: { code: 1, metadata: { info: 0, low: 0, moderate: 0, high: 0, critical: 1 } }
      },
      {
        args: { file: 'no-critical.json', severity: 'high', json: true },
        expected: { code: 1, metadata: { info: 0, low: 0, moderate: 0, high: 1, critical: 0 } }
      },
      {
        args: { file: 'no-critical.json', severity: 'critical', json: true },
        expected: { code: 0, metadata: { info: 0, low: 0, moderate: 0, high: 0, critical: 0 } }
      }
    ];

    _.forEach(testCases, (test) => {
      describe(`${test.args.file} - ${test.args.severity} ${test.args.whitelist ? test.args.whitelist : ''}`, function () {
        before(() => {
          this.audit = new Audit(test.args.severity, test.args.json, test.args.whitelist);

          let data = fs.readFileSync(__dirname + '/data/' + test.args.file);
          this.audit.load(data);
        });

        it('getCode() should return ' + test.expected.code, () => {
          assert.equal(this.audit.getCode(), test.expected.code);
        });

        if (test.args.json) {
          it('get() should have correct metadata', () => {
            const data = JSON.parse(this.audit.get());

            assert.equal(data.metadata.info, test.expected.metadata.info);
            assert.equal(data.metadata.low, test.expected.metadata.low);
            assert.equal(data.metadata.moderate, test.expected.metadata.moderate);
            assert.equal(data.metadata.high, test.expected.metadata.high);
            assert.equal(data.metadata.critical, test.expected.metadata.critical);
          });
        } else {
          it('get() should have a value', () => {
            const data = this.audit.get();

            assert.ok(data);
          });
        }
      });
    });
  });

  describe('summary tests', function() {
    const testCases = [
      {
        args: { file: 'single-low.json', severity: 'low', json: true },
        expected: { code: 0, metadata: { info: 0, low: 1, moderate: 0, high: 0, critical: 0 } },
        color: false
      },
      {
        args: { file: 'many-low.json', severity: 'low', json: true },
        expected: { code: 0, metadata: { info: 0, low: 3, moderate: 0, high: 0, critical: 0 } },
        color: false
      },
      {
        args: { file: 'many-low.json', severity: 'low', json: true, whitelist: 'debug' },
        expected: { code: 0, metadata: { info: 0, low: 2, moderate: 0, high: 0, critical: 0 } },
        color: false
      }
    ];

    _.forEach(testCases, (test) => {
      describe(`${test.args.file} - ${test.args.severity} ${test.args.whitelist ? test.args.whitelist : ''}`, function () {
        before(() => {
          this.audit = new Audit(test.args.severity, test.args.json, test.args.whitelist);

          let data = fs.readFileSync(__dirname + '/data/' + test.args.file);
          this.audit.load(data);
        });

        it('getSummary() should have correct summary', () => {
          const data = this.audit.getSummary(test.color);

          assert.equal(data, `Found ${test.expected.metadata.info} info, ${test.expected.metadata.low} low, ${test.expected.metadata.moderate} moderate, ${test.expected.metadata.high} high, ${test.expected.metadata.critical} critical vulnerabilities.`);
        });        
      });
    });
  });
});
