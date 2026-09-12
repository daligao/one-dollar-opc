const ALLOWED_STATUSES = new Set(['complete', 'current', 'pending', 'locked']);
const MAX_STR  = 200;
const MAX_NOTE = 500;

function err(msg, status = 400) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost({ request, env }) {
  const ct = request.headers.get('Content-Type') || '';
  if (!ct.includes('application/json')) return err('Content-Type must be application/json');

  let body;
  try { body = await request.json(); }
  catch { return err('Invalid JSON'); }

  const errors = [];

  for (const k of ['revenue', 'mrr', 'websites_live', 'experiments_running']) {
    if (k in body && typeof body[k] !== 'number') errors.push(`${k} must be a number`);
  }
  for (const k of ['current_mission', 'latest_milestone', 'updated']) {
    if (k in body) {
      if (typeof body[k] !== 'string') errors.push(`${k} must be a string`);
      else if (body[k].length > MAX_STR) errors.push(`${k} too long (max ${MAX_STR})`);
    }
  }
  if ('milestones' in body) {
    if (!Array.isArray(body.milestones)) {
      errors.push('milestones must be an array');
    } else {
      body.milestones.forEach((m, i) => {
        if (!ALLOWED_STATUSES.has(m.status))
          errors.push(`milestones[${i}].status must be one of: ${[...ALLOWED_STATUSES].join(', ')}`);
        if (typeof m.label !== 'string' || m.label.length > MAX_STR)
          errors.push(`milestones[${i}].label invalid`);
      });
    }
  }
  if ('log' in body) {
    if (!Array.isArray(body.log)) {
      errors.push('log must be an array');
    } else {
      body.log.forEach((e, i) => {
        if (typeof e.title !== 'string' || e.title.length > MAX_STR)
          errors.push(`log[${i}].title invalid`);
        if (e.note && (typeof e.note !== 'string' || e.note.length > MAX_NOTE))
          errors.push(`log[${i}].note invalid`);
        if (typeof e.date !== 'string' || e.date.length > 20)
          errors.push(`log[${i}].date invalid`);
      });
    }
  }

  if (errors.length) {
    return new Response(JSON.stringify({ errors }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!env.OPC_STATE) return err('KV not configured', 503);

  const existing = await env.OPC_STATE.get('company_state');
  const current  = existing ? JSON.parse(existing) : {};

  // Remove internal note field from stored state
  delete body._note;

  const updated = {
    ...current,
    ...body,
    updated: new Date().toISOString().split('T')[0],
  };

  await env.OPC_STATE.put('company_state', JSON.stringify(updated));

  return new Response(JSON.stringify({ ok: true, updated: updated.updated }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Reject everything that isn't POST
export async function onRequest({ request }) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
}
