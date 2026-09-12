export async function onRequestGet({ env }) {
  if (!env.OPC_STATE) {
    return new Response(null, { status: 503 });
  }
  const raw = await env.OPC_STATE.get('company_state');
  if (!raw) {
    return new Response(null, { status: 404 });
  }
  return new Response(raw, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60',
    },
  });
}
