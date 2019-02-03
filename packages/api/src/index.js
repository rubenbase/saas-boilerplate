const Koa = require('koa');
const cors = require('@koa/cors');
const Router = require('koa-router');
const koaBody = require('koa-body');
const isEmpty = require('lodash.isempty');
const Sentry = require('@sentry/node');

const config = require('./config');
const log = require('./log')(config);
const connectDb = require('./db');
const createProcessor = require('./processor');
const paddleRouting = require('./routes/paddle');
const setupAuthMiddleware = require('./auth');
const setupGraphQLEndpoint = require('./graphql');

const init = async () => {
  log.info(`App mode: ${config.APP_MODE}`);

  Sentry.init({
    dsn: config.SENTRY_DSN,
    environment: config.APP_MODE,
    serverName: config.SERVER_NAME,
  });

  const db = await connectDb({ config, log });
  await createProcessor({ config, log, db });

  const server = new Koa();

  server.use(koaBody());
  server.use(async (ctx, next) => {
    const { body } = ctx.request;

    ctx.body = isEmpty(body) ? 'OK' : body;

    await next();
  });

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

  setupAuthMiddleware({ config, db, server });
  setupGraphQLEndpoint({ config, db, server, log });

  const router = new Router();

  paddleRouting({ db, router, log });

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
