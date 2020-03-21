const assert = require('assert');
const fs = require('fs');

const Audit = require('../lib/audit.js');

describe('Audit Tests', function () {
  describe('None --json --severity low', function () {
    before(() => {
      this.audit = new Audit('low', true, "");

      let data = fs.readFileSync(__dirname + '/data/none.json');
      this.audit.load(data)
    })

    it('getCode() should return 0', () => {
      assert.equal(this.audit.getCode(), 0);
    });

    it('get() should have 0 metadata', () => {
      let data = JSON.parse(this.audit.get());
  
      assert.equal(data.metadata.info, 0);
      assert.equal(data.metadata.low, 0);
      assert.equal(data.metadata.moderate, 0);
      assert.equal(data.metadata.high, 0);
      assert.equal(data.metadata.critical, 0);
    })
  });

  describe('Single-Low --json --severity low', function () {
    before(() => {
      this.audit = new Audit('low', true, "");

      let data = fs.readFileSync(__dirname + '/data/single-low.json');
      this.audit.load(data)
    })

    it('getCode() should return 1', () => {
      assert.equal(this.audit.getCode(), 1);
    });

    it('get() should have 1 low', () => {
      let data = JSON.parse(this.audit.get());

      assert.equal(data.metadata.info, 0);
      assert.equal(data.metadata.low, 1);
      assert.equal(data.metadata.moderate, 0);
      assert.equal(data.metadata.high, 0);
      assert.equal(data.metadata.critical, 0);
    })
  });

  describe('Single-Low --severity low', function () {
    before(() => {
      this.audit = new Audit('low', false, "");

      let data = fs.readFileSync(__dirname + '/data/single-low.json');
      this.audit.load(data)
    })

    it('getCode() should return 1', () => {
      assert.equal(this.audit.getCode(), 1);
    });

  });

  describe('None --severity low', function () {
    before(() => {
      this.audit = new Audit('low', false, "");

      let data = fs.readFileSync(__dirname + '/data/none.json');
      this.audit.load(data)
    })

    it('getCode() should return 0', () => {
      assert.equal(this.audit.getCode(), 0);
    });
    
  });

  describe('Many-Low --json --severity low', function () {
    before(() => {
      this.audit = new Audit('low', true, "");

      let data = fs.readFileSync(__dirname + '/data/many-low.json');
      this.audit.load(data)
    })

    it('getCode() should return 1', () => {
      assert.equal(this.audit.getCode(), 1);
    });

    it('get() should have 3 low', () => {
      let data = JSON.parse(this.audit.get());

      assert.equal(data.metadata.info, 0);
      assert.equal(data.metadata.low, 3);
      assert.equal(data.metadata.moderate, 0);
      assert.equal(data.metadata.high, 0);
      assert.equal(data.metadata.critical, 0);
    })
  });

  describe('Many --json --severity info', function () {
    before(() => {
      this.audit = new Audit('info', true, "");

      let data = fs.readFileSync(__dirname + '/data/many.json');
      this.audit.load(data)
    })

    it('getCode() should return 1', () => {
      assert.equal(this.audit.getCode(), 1);
    });

    it('get() should have many', () => {
      let data = JSON.parse(this.audit.get());

      assert.equal(data.metadata.info, 1);
      assert.equal(data.metadata.low, 1);
      assert.equal(data.metadata.moderate, 1);
      assert.equal(data.metadata.high, 1);
      assert.equal(data.metadata.critical, 1);
    })
  });

  describe('Many --json --severity low', function () {
    before(() => {
      this.audit = new Audit('low', true, "");

      let data = fs.readFileSync(__dirname + '/data/many.json');
      this.audit.load(data)
    })

    it('getCode() should return 1', () => {
      assert.equal(this.audit.getCode(), 1);
    });

    it('get() should have many', () => {
      let data = JSON.parse(this.audit.get());

      assert.equal(data.metadata.info, 0);
      assert.equal(data.metadata.low, 1);
      assert.equal(data.metadata.moderate, 1);
      assert.equal(data.metadata.high, 1);
      assert.equal(data.metadata.critical, 1);
    })
  });

  describe('Many --json --severity moderate', function () {
    before(() => {
      this.audit = new Audit('moderate', true, "");

      let data = fs.readFileSync(__dirname + '/data/many.json');
      this.audit.load(data)
    })

    it('getCode() should return 1', () => {
      assert.equal(this.audit.getCode(), 1);
    });

    it('get() should have many', () => {
      let data = JSON.parse(this.audit.get());

      assert.equal(data.metadata.info, 0);
      assert.equal(data.metadata.low, 0);
      assert.equal(data.metadata.moderate, 1);
      assert.equal(data.metadata.high, 1);
      assert.equal(data.metadata.critical, 1);
    })
  });

  describe('Many --json --severity high', function () {
    before(() => {
      this.audit = new Audit('high', true, "");

      let data = fs.readFileSync(__dirname + '/data/many.json');
      this.audit.load(data)
    })

    it('getCode() should return 1', () => {
      assert.equal(this.audit.getCode(), 1);
    });

    it('get() should have many', () => {
      let data = JSON.parse(this.audit.get());

      assert.equal(data.metadata.info, 0);
      assert.equal(data.metadata.low, 0);
      assert.equal(data.metadata.moderate, 0);
      assert.equal(data.metadata.high, 1);
      assert.equal(data.metadata.critical, 1);
    })
  });

  describe('Many --json --severity critical', function () {
    before(() => {
      this.audit = new Audit('critical', true, "");

      let data = fs.readFileSync(__dirname + '/data/many.json');
      this.audit.load(data)
    })

    it('getCode() should return 1', () => {
      assert.equal(this.audit.getCode(), 1);
    });

    it('get() should have many', () => {
      let data = JSON.parse(this.audit.get());

      assert.equal(data.metadata.info, 0);
      assert.equal(data.metadata.low, 0);
      assert.equal(data.metadata.moderate, 0);
      assert.equal(data.metadata.high, 0);
      assert.equal(data.metadata.critical, 1);
    })
  });

  describe('No Critical --json --severity critical', function () {
    before(() => {
      this.audit = new Audit('critical', true, "");

      let data = fs.readFileSync(__dirname + '/data/no-critical.json');
      this.audit.load(data)
    })

    it('getCode() should return 1', () => {
      assert.equal(this.audit.getCode(), 0);
    });

    it('get() should have many', () => {
      let data = JSON.parse(this.audit.get());

      assert.equal(data.metadata.info, 0);
      assert.equal(data.metadata.low, 0);
      assert.equal(data.metadata.moderate, 0);
      assert.equal(data.metadata.high, 0);
      assert.equal(data.metadata.critical, 0);
    })
  });

  describe('No Critical --json --severity high', function () {
    before(() => {
      this.audit = new Audit('high', true, "");

      let data = fs.readFileSync(__dirname + '/data/no-critical.json');
      this.audit.load(data)
    })

    it('getCode() should return 1', () => {
      assert.equal(this.audit.getCode(), 1);
    });

    it('get() should have many', () => {
      let data = JSON.parse(this.audit.get());

      assert.equal(data.metadata.info, 0);
      assert.equal(data.metadata.low, 0);
      assert.equal(data.metadata.moderate, 0);
      assert.equal(data.metadata.high, 1);
      assert.equal(data.metadata.critical, 0);
    })
  });
});