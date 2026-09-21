const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function fetchListings(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `${API}/listings${qs ? `?${qs}` : ''}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch listings (${res.status})`);
  return res.json();
}

export async function fetchListing(slug: string) {
  const url = `${API}/listings/${slug}`;
  console.log('[server-api] fetchListing ->', url);

  const res = await fetch(url, { cache: 'no-store' });
  console.log('[server-api] status:', res.status);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('[server-api] body:', text);
    throw new Error(`Listing not found (${res.status})`);
  }

  const data = await res.json();
  console.log('[server-api] got listing:', data?.listing?.slug);
  return data.listing;
}