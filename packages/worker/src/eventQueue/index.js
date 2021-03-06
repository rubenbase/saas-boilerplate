const PQueue = require('p-queue');

const createQueueClass = ({ log }) =>
  class Queue {
    constructor() {
      this._queue = [];
      this._log = log.create('pqueue');
    }

    enqueue(fn, { name }) {
      this._log.debug(`Adding job ${name} to event queue ...`);
      this._queue.push({ name, fn });
    }

    dequeue() {
      const { name, fn } = this._queue.shift() || {};

      if (name) {
        this._log.debug(`Removing ${name} from event queue ...`);
      }

      return fn;
    }

    get size() {
      return this._queue.length;
    }
  };

module.exports = ({ log }) =>
  new PQueue({
    concurrency: 1,
    autoStart: true,
    queueClass: createQueueClass({ log }),
  });
