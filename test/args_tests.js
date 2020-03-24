const assert = require('assert');
const _ = require('lodash');

const args = require('../lib/args.js');

describe('Arg Tests', function () {

  describe('command tests', function () {
    const testCases = [
      {
        args: ['--severity','low'],
        expected: { severity: 'low', json: undefined, whitelist: '' }
      },
      {
        args: ['--severity','low','--json'],
        expected: { severity: 'low', json: true, whitelist: '' }
      },
      {
        args: ['--severity','low','--json', '--output', './file.json'],
        expected: { severity: 'low', json: true, output: './file.json', whitelist: '' }
      },
      {
        args: ['--severity','high','--json', '--output', './file.json'],
        expected: { severity: 'high', json: true, output: './file.json', whitelist: '' }
      },
      {
        args: ['--severity','low','--json', '--output', './file.json', '--whitelist', 'debug'],
        expected: { severity: 'low', json: true, output: './file.json', whitelist: 'debug' }
      },
      {
        args: ['--severity','low','--json', '--output', './file.json', '--whitelist', 'debug,ms,test,world'],
        expected: { severity: 'low', json: true, output: './file.json', whitelist: 'debug,ms,test,world' }
      }
    ];

    _.forEach(testCases, (test) => {
      describe(`${test.args}`, function () {
        before(() => {
          let parsedArgs = [
            'test1',
            'test2'
          ];

          this.args = args(_.concat(parsedArgs, test.args));
        });

        it('severity should return ' + test.expected.severity, () => {
          assert.equal(this.args.severity, test.expected.severity);
        });

        it('json should return ' + test.expected.json, () => {
          assert.equal(this.args.json, test.expected.json);
        });

        it('ignoreDev should return ' + test.expected.ignoreDev, () => {
          assert.equal(this.args.ignoreDev, test.expected.ignoreDev);
        });

        it('output should return ' + test.expected.output, () => {
          assert.equal(this.args.output, test.expected.output);
        });

        it('whitelist should return ' + test.expected.whitelist, () => {
          assert.equal(this.args.whitelist, test.expected.whitelist);
        });
      });
    });
  });
});
