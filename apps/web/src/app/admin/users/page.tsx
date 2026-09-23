'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

type UserRow = {
  _id: string;
  name: string;
  email: string;
  role: 'traveler' | 'vendor' | 'admin';
  emailVerified: boolean;
  createdAt: string;
};

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'traveler' | 'vendor' | 'admin'>('all');

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
    if (!authLoading && user && user.role !== 'admin') router.replace('/');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    (async () => {
      try {
        const { items } = await api.get('/admin/users');
        setUsers(items);
      } catch {}
      setLoading(false);
    })();
  }, [user]);

  const changeRole = async (id: string, role: string) => {
    setBusy(id);
    try {
      await api.patch(`/admin/users/${id}/role`, { role });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: role as any } : u))
      );
      toast.success('Role updated');
    } catch (e: any) {
      toast.error(e.message || 'Update failed');
    } finally {
      setBusy(null);
    }
  };

  const filtered = filter === 'all' ? users : users.filter((u) => u.role === filter);

  if (authLoading || loading) {
    return <div className="p-20 text-center text-muted">Loading…</div>;
  }
  if (!user) return null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">Users</h1>
          <p className="mt-1 text-muted">{users.length} total</p>
        </div>
        <Link href="/admin" className="text-sm font-medium text-brand-blue hover:underline">
          ← Admin dashboard
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'traveler', 'vendor', 'admin'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-pill px-4 py-1.5 text-xs font-semibold capitalize ${
              filter === f
                ? 'bg-brand-blue text-white'
                : 'border border-line text-muted hover:text-ink'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-card border border-line">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 text-right">Change role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {filtered.map((u) => (
              <tr key={u._id}>
                <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                <td className="px-4 py-3 text-muted">{u.email}</td>
                <td className="px-4 py-3">
                  <RoleBadge role={u.role} />
                </td>
                <td className="px-4 py-3 text-muted">{u.emailVerified ? '✓' : '—'}</td>
                <td className="px-4 py-3 text-muted">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <select
                    value={u.role}
                    disabled={busy === u._id}
                    onChange={(e) => changeRole(u._id, e.target.value)}
                    className="rounded-tile border border-line bg-surface px-2 py-1 text-xs outline-none focus:border-brand-blue disabled:opacity-50"
                  >
                    <option value="traveler">Traveler</option>
                    <option value="vendor">Vendor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function RoleBadge({ role }: { role: string }) {
  const cls =
    role === 'admin'
      ? 'bg-[#FFEDED] text-[#C0392B]'
      : role === 'vendor'
      ? 'bg-[#E7F0FF] text-[#0A66FF]'
      : 'bg-surface text-muted';
  return (
    <span
      className={`rounded-pill px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${cls}`}
    >
      {role}
    </span>
  );
}