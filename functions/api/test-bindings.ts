interface Env {
  DB: D1Database;
  R2_BUCKET: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  try {
    // Test D1 binding
    const { results } = await context.env.DB.prepare("SELECT 1 as success").all();
    const d1Success = results[0].success === 1;

    // Test R2 binding
    const r2Key = "test-object";
    await context.env.R2_BUCKET.put(r2Key, "test content");
    const r2Object = await context.env.R2_BUCKET.get(r2Key);
    const r2Success = r2Object !== null && (await r2Object.text()) === "test content";
    await context.env.R2_BUCKET.delete(r2Key);

    return new Response(JSON.stringify({ d1Success, r2Success }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
