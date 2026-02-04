import { Context } from 'hono';

export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api')) {
    return new Response('Hello from middleware!');
  }
  return next();
};
