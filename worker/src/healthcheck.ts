import {postgres} from './postgres.js';
import {redis} from './redis.js';

async function healthcheck() {
  try {
    await redis.ping();
    await postgres.query('select 1')

    process.exit(0);
  } catch (err) {
    console.error(err)
    process.exit(1);
  } finally {
    await redis.quit();
    await postgres.end();
  }
}

await healthcheck();
