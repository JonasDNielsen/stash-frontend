import { router } from '../../backend/src/index.js';

export async function onRequest(context) {
  // Map Pages Function context to Hono environment
  const env = {
    ...context.env,
    ENVIRONMENT: context.env.ENVIRONMENT || 'production'
  };
  
  // Handle the request using the existing Hono router
  return router.fetch(context.request, env, context);
}
