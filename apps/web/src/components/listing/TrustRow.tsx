export function TrustRow({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <svg
        viewBox="0 0 24 24"
        className="mt-0.5 h-5 w-5 shrink-0"
        fill="none"
        stroke="#12A150"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
      <div>
        <p className="text-[13px] font-semibold text-ink">{title}</p>
        <p className="text-[12px] leading-relaxed text-muted">{body}</p>
      </div>
    </div>
  );
}