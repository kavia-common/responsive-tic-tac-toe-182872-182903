import type { CellValue, GameStatus } from "~/hooks/useTicTacToe";
import { PlayerIcon } from "./Icons";

type BoardProps = {
  board: CellValue[];
  status: GameStatus;
  onPlay: (index: number) => void;
};

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

type CellProps = {
  value: CellValue;
  index: number;
  disabled: boolean;
  highlight: boolean;
  onPlay: (index: number) => void;
};

function VisIcon({
  value,
  className,
}: {
  value: CellValue;
  className?: string;
}) {
  if (value === null) {
    // Subtle dot for empty state, but aria-label on button provides context.
    return <span aria-hidden="true" className={className}>•</span>;
  }
  return (
    <span
      aria-hidden="true"
      className={className}
    >
      <PlayerIcon
        player={value}
        // We use emoji fallback for visual crispness and simplicity.
        fallbackEmoji
        // Color is inherited from parent span via Tailwind classes.
      />
    </span>
  );
}

function Cell({ value, index, disabled, highlight, onPlay }: CellProps) {
  const isEmpty = value === null;
  const isX = value === "X";
  const colorClass = isX
    ? "text-blue-600"
    : value === "O"
      ? "text-amber-500"
      : "text-gray-300";

  return (
    <button
      type="button"
      aria-label={`Cell ${index + 1}${value ? ` with ${value === "X" ? "Knight" : "Queen"}` : ""}`}
      aria-disabled={disabled || !isEmpty}
      onClick={() => onPlay(index)}
      onKeyDown={(e) => {
        if (disabled || !isEmpty) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPlay(index);
        }
      }}
      className={classNames(
        "group flex items-center justify-center rounded-xl transition-colors duration-200 ease-out",
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300/50",
        "shadow-sm hover:shadow-md",
        "border border-gray-200",
        "bg-white",
        highlight ? "ring-2 ring-blue-400" : "ring-0",
        disabled && isEmpty ? "cursor-not-allowed opacity-60" : "cursor-pointer",
      )}
      style={{
        // Ensure squares by maintaining aspect ratio
        aspectRatio: "1 / 1",
      }}
    >
      <VisIcon
        value={value}
        className={classNames(
          "text-4xl sm:text-5xl md:text-6xl font-extrabold select-none",
          colorClass,
          "transition-transform duration-150 ease-out",
          value ? "scale-100" : "scale-95 group-active:scale-90"
        )}
      />
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * Board component rendering a 3x3 responsive grid with accessible, keyboard-navigable cells.
 */
export function Board({ board, status, onPlay }: BoardProps) {
  const winningSet = new Set<number>(
    status.type === "win" ? status.line : []
  );
  const disabledAll = status.type !== "in_progress";

  return (
    <div
      className={classNames(
        "grid grid-cols-3 gap-3 sm:gap-4 md:gap-5 p-3 sm:p-4 md:p-5",
        "rounded-2xl border border-gray-200 bg-white shadow-lg"
      )}
      style={{
        width: "min(92vw, 560px)",
      }}
    >
      {board.map((value, idx) => (
        <Cell
          key={idx}
          value={value}
          index={idx}
          disabled={disabledAll || value !== null}
          highlight={winningSet.has(idx)}
          onPlay={onPlay}
        />
      ))}
    </div>
  );
}
