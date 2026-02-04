import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('/api/*', cors());

app.get('/api/test-d1', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT 1 as success').all();
    return c.json({ success: true, d1: results });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get('/api/test-r2', async (c) => {
  try {
    const bucket = c.env.R2_BUCKET;
    const list = await bucket.list();
    return c.json({ success: true, r2: list });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export const onRequest = app.fetch;
