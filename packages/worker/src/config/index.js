const envalid = require('envalid');

const { str, num } = envalid;

const env = envalid.cleanEnv(
  process.env,
  {
    PORT: num({ default: 3002 }),
    NODE_ENV: str({ default: 'development' }),
    APP_MODE: str({ default: 'dev' }),
    LOG: str({ default: 'debug' }),
  },
  {
    dotEnvPath: '.env',
  },
);

// eslint-disable-next-line import/no-dynamic-require
const modeConfig = require(`./${env.APP_MODE}`);

module.exports = Object.freeze({
  ...env,
  ...modeConfig,
});
