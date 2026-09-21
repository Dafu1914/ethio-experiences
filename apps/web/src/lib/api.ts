const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

let accessToken: string | null = null;
export const setAccessToken = (t: string | null) => {
  accessToken = t;
};
export const getAccessToken = () => accessToken;

type Options = RequestInit & { retry?: boolean };

async function request(path: string, opts: Options = {}): Promise<any> {
  const { retry = true, ...init } = opts;

  const res = await fetch(`${API}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(init.headers || {}),
    },
  });

  if (res.status === 401 && retry) {
    const r = await fetch(`${API}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (r.ok) {
      const { accessToken: t } = await r.json();
      setAccessToken(t);
      return request(path, { ...opts, retry: false });
    }
    setAccessToken(null);
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: (p: string) => request(p),
  post: (p: string, body?: any) =>
    request(p, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: (p: string, body?: any) =>
    request(p, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: (p: string) => request(p, { method: 'DELETE' }),
};