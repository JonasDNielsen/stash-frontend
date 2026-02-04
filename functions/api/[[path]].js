import { Hono } from 'hono';
import { router as backendRouter } from '../../backend/src/index.js';
import { onRequest as testBindingsApp } from './test-bindings.js';

const app = new Hono();

// Mount the backend router
app.route('/', backendRouter);

// Mount the test bindings app
app.route('/test', testBindingsApp);

export async function onRequest(context) {
  // Map Pages Function context to Hono environment
  const env = {
    ...context.env,
    ENVIRONMENT: context.env.ENVIRONMENT || 'production'
  };
  
  // Handle the request using the combined Hono app
  return app.fetch(context.request, env, context);
}
