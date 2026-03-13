interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-oscar-text-muted mb-1">
        <span>
          {current} of {total} categories
        </span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2 bg-oscar-black rounded-full overflow-hidden">
        <div
          className="h-full bg-oscar-gold rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
