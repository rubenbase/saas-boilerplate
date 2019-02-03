const Koa = require('koa');
const cors = require('@koa/cors');
const Router = require('koa-router');
const Sentry = require('@sentry/node');

const config = require('./config');
const log = require('./log')(config);
const createProcessor = require('./processor');
const setupScheduler = require('./scheduler');

const init = async () => {
  log.info(`App mode: ${config.APP_MODE}`);

  Sentry.init({
    dsn: config.SENTRY_DSN,
    environment: config.APP_MODE,
    serverName: config.SERVER_NAME,
  });

  const scheduler = setupScheduler({ log });

  await createProcessor({ config, log, scheduler });

  const server = new Koa();
  const router = new Router();
  server.use(
    cors({
      origin: '*',
      credentials: true,
    }),
  );

  server.use(async (ctx, nextHandler) => {
    ctx.res.statusCode = 200;
    await nextHandler();
  });

  server.use(router.routes());
  server.listen(config.PORT, err => {
    if (err) {
      throw err;
    }
  });
};

init().catch(err => {
  log.error(err);
  throw err;
});
