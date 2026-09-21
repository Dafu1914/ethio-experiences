export function SelectorRow({
  icon,
  label,
  sublabel,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between rounded-tile bg-surface px-4 py-3 text-left transition hover:bg-[#EFF1F4]"
    >
      <span className="flex items-center gap-3">
        <span className="text-muted">{icon}</span>
        <span className="flex flex-col">
          <span className="text-sm font-medium text-ink">{label}</span>
          {sublabel && <span className="text-xs text-muted">{sublabel}</span>}
        </span>
      </span>
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}