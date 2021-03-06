const uuid = require('uuid');

const _idn = (id, name) => `${name}-${id}`;

class IntervalScheduler {
  constructor({ log }) {
    this._log = log.create('intervalScheduler');

    this._jobs = {};
  }

  schedule(name, intervalSeconds, callback) {
    const id = _idn(uuid(), name);

    this._log.info(
      `Scheduled job ${name} to run every ${intervalSeconds} seconds`,
    );

    this._jobs[id] = {
      name,
      callback,
      intervalMs: intervalSeconds * 1000,
      lastRun: 0,
    };

    this.start();

    return id;
  }

  unschedule(id) {
    this._log.info(`Unscheduled job ${id}`);

    delete this._jobs[id];
  }

  start() {
    if (!this._running) {
      this._log.info('Starting scheduler ...');

      this._running = true;
      this._processJobs();
    }
  }

  stop() {
    if (this._running) {
      this._log.info('Stopping scheduler ...');

      this._running = false;
      clearTimeout(this._timer);
    }
  }

  _processJobs() {
    if (!this._running) {
      return;
    }

    Object.keys(this._jobs).forEach(id => {
      const job = this._jobs[id];
      const { lastRun, intervalMs, callback } = job;
      const now = Date.now();

      if (now - lastRun >= intervalMs) {
        job.lastRun = now;

        callback();
      }
    });

    // check every second
    this._timer = setTimeout(() => this._processJobs(), 1000);
  }
}

module.exports = args => new IntervalScheduler(args);
