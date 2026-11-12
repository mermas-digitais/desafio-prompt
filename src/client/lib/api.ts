export async function api<T = { ok: boolean; error?: string }>(path: string, body?: unknown, method = body === undefined ? 'GET' : 'POST'): Promise<T> {
  const response = await fetch(path, {
    method, credentials: 'same-origin', signal: AbortSignal.timeout(15000),
    ...(body === undefined ? {} : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  });
  const data = await response.json();
  if (!response.ok || data.ok === false) throw new Error(data.error || `Não foi possível concluir (${response.status}). Tente novamente.`);
  return data as T;
}
