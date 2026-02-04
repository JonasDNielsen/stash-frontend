import { Hono } from 'hono';

interface Env {
  DB: D1Database;
  R2_BUCKET: R2Bucket;
}

const app = new Hono<Env>();

app.get('/', async (c) => {
  try {
    // Test D1 binding
    const { results } = await c.env.DB.prepare('SELECT 1 as value').all();
    const d1Result = results[0] as { value: number };

    // Test R2 binding (list objects)
    const r2List = await c.env.R2_BUCKET.list();
    const r2Count = r2List.objects.length;

    return c.json({
      status: 'success',
      d1: d1Result.value === 1 ? 'connected' : 'failed',
      r2: `connected, ${r2Count} objects`,
    });
  } catch (error: any) {
    return c.json({
      status: 'error',
      message: error.message,
    }, 500);
  }
});

export const onRequest = app.fetch;
