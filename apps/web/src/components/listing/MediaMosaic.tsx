'use client';

export type MosaicImage = { url: string; alt: string };

export function MediaMosaic({ images }: { images: MosaicImage[] }) {
  const [a, b, c, d] = images;
  if (!a) return null;

  return (
    <div className="relative grid h-[280px] grid-cols-2 gap-2 overflow-hidden rounded-card md:h-[460px] md:grid-cols-[2fr_2fr_1fr] md:grid-rows-2">
      {/* Large left image (spans both rows on desktop) */}
      <div className="col-span-2 overflow-hidden bg-surface md:col-span-1 md:row-span-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={a.url} alt={a.alt} className="h-full w-full object-cover" />
      </div>

      {/* Middle tall image */}
      {b && (
        <div className="hidden overflow-hidden bg-surface md:row-span-2 md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={b.url} alt={b.alt} className="h-full w-full object-cover" />
        </div>
      )}

      {/* Two small right images */}
      {c && (
        <div className="hidden overflow-hidden bg-surface md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.url} alt={c.alt} className="h-full w-full object-cover" />
        </div>
      )}
      {d && (
        <div className="hidden overflow-hidden bg-surface md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={d.url} alt={d.alt} className="h-full w-full object-cover" />
        </div>
      )}

      {/* Mobile-only second image */}
      {b && (
        <div className="col-span-1 overflow-hidden bg-surface md:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={b.url} alt={b.alt} className="h-full w-full object-cover" />
        </div>
      )}
      {c && (
        <div className="col-span-1 overflow-hidden bg-surface md:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.url} alt={c.alt} className="h-full w-full object-cover" />
        </div>
      )}

      {/* View all button */}
      <button
        type="button"
        className="absolute bottom-4 right-4 rounded-pill bg-white/95 px-4 py-2 text-sm font-semibold text-ink shadow-md transition hover:bg-white"
      >
        View all
      </button>
    </div>
  );
}