export const onRequest: PagesFunction = async ({ request }) => {
  return new Response("Hello from catch-all!");
};
