export const onRequest = async ({ next }) => {
  return new Response("Hello from middleware!");
};
