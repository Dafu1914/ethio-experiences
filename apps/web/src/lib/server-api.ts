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
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Listing not found (${res.status})`);
  }
  const data = await res.json();
  return data.listing;
}