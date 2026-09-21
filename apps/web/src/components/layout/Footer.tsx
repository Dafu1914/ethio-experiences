import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-16 bg-ink text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <p className="text-lg font-extrabold tracking-tight text-brand-orange">
              ETHIO EXPERIENCES
            </p>
            <p className="mt-3 text-sm text-white/70">
              Book tours, treks & culture across Ethiopia.
            </p>
          </div>

          <Column title="Explore" links={[
            { label: 'All experiences', href: '/search' },
            { label: 'Tours', href: '/search?category=tour' },
            { label: 'Treks', href: '/search?category=trek' },
            { label: 'Culture', href: '/search?category=culture' },
          ]} />

          <Column title="Destinations" links={[
            { label: 'Addis Ababa', href: '/search?city=Addis+Ababa' },
            { label: 'Lalibela', href: '/search?city=Lalibela' },
            { label: 'Gondar', href: '/search?city=Gondar' },
            { label: 'Harar', href: '/search?city=Harar' },
          ]} />

          <Column title="Company" links={[
            { label: 'About', href: '/' },
            { label: 'Careers', href: '/' },
            { label: 'Press', href: '/' },
            { label: 'Blog', href: '/' },
          ]} />

          <Column title="Work with us" links={[
            { label: 'As a supplier', href: '/vendor/apply' },
            { label: 'As a content creator', href: '/' },
            { label: 'As an affiliate', href: '/' },
          ]} />
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/60 md:flex-row">
          <p>© {new Date().getFullYear()} Ethio Experiences. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/" className="hover:text-white">
              Terms
            </Link>
            <Link href="/" className="hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Column({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-bold text-white">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-sm text-white/70 hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}