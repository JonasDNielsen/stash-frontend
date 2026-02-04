
import { Hono } from 'hono';

interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
}

const app = new Hono<{
  Bindings: Env;
}>();

app.get('/test-d1', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT 1 as success').all();
    return c.json({ success: true, message: 'D1 binding successful', results });
  } catch (error: any) {
    return c.json({ success: false, message: 'D1 binding failed', error: error.message }, 500);
  }
});

app.get('/test-r2', async (c) => {
  try {
    const bucketList = await c.env.BUCKET.list();
    return c.json({ success: true, message: 'R2 binding successful', bucketList });
  } catch (error: any) {
    return c.json({ success: false, message: 'R2 binding failed', error: error.message }, 500);
  }
});

export const onRequest = app.fetch;
