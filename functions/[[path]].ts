import { Hono } from 'hono';
import { cors } from 'hono/cors';

interface Env {
  DB: D1Database;
  R2: R2Bucket;
}

const app = new Hono<{ Bindings: Env }>();

app.use('/*', cors());

app.get('/api/test-d1', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM users').all();
    return c.json({ success: true, d1_results: results });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get('/api/test-r2', async (c) => {
  try {
    const object = await c.env.R2.get('test-object');
    if (object) {
      return c.json({ success: true, r2_object_key: object.key });
    } else {
      return c.json({ success: false, message: 'Object not found in R2' }, 404);
    }
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export const onRequest = app.fetch;
