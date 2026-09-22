const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

let accessToken: string | null = null;

export const setAccessToken = (t: string | null) => {
  accessToken = t;
};

export const getAccessToken = () => accessToken;

// Turn a stored image URL into something the browser can load.
// - Absolute URLs (https://...) pass through unchanged (Unsplash, CDN)
// - /uploads/* live on the API server, so prefix the API base (without /api)
// - /images/* live under Next.js public/, so leave as-is
export function imageUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads/')) {
    const base = API.replace(/\/api\/?$/, '');
    return `${base}${url}`;
  }
  return url;
}

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

// Multipart upload helper — cannot use JSON headers with FormData
export async function uploadFiles(files: File[]): Promise<string[]> {
  const form = new FormData();
  files.forEach((f) => form.append('images', f));

  const res = await fetch(`${API}/uploads`, {
    method: 'POST',
    credentials: 'include',
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    body: form,
  });

  if (res.status === 401 && accessToken) {
    const r = await fetch(`${API}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (r.ok) {
      const { accessToken: t } = await r.json();
      setAccessToken(t);
      return uploadFiles(files);
    }
    setAccessToken(null);
  }

  if (!res.ok) {
    const t = await res.json().catch(() => ({}));
    throw new Error(t.error || 'Upload failed');
  }

  const { urls } = await res.json();
  return urls as string[];
}