interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function ProgressBar({
  value,
  showLabel = true,
  size = "md",
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const height = size === "sm" ? "h-1.5" : "h-2.5";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex-1 bg-slate-700 rounded-full ${height} overflow-hidden`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ease-out ${
            clamped === 100
              ? "bg-green-500"
              : "bg-gradient-to-r from-orange-500 to-orange-400"
          }`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-slate-400 font-medium min-w-[2.5rem] text-right">
          {clamped}%
        </span>
      )}
    </div>
  );
}
