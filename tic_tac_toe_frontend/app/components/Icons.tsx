import type { Player } from "~/hooks/useTicTacToe";

/**
 * PUBLIC_INTERFACE
 * KnightIcon - inline SVG for representing Player X as a chess knight.
 */
export function KnightIcon({
  className,
  title = "Knight",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={title}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      focusable="false"
    >
      <title>{title}</title>
      <path
        d="M6 20h12v-2H8.5c.1-1.63 1.03-3.02 2.5-3.87L16 12V7c0-1.66-1.34-3-3-3H9L6 7v4h2V8.5L9.5 6H13c.55 0 1 .45 1 1v3.5l-4.2 2.4C8.18 13.76 7 15.77 7 18v.5c0 .83-.67 1.5-1.5 1.5H6z"
        fill="currentColor"
      />
      <circle cx="12.2" cy="8.2" r="0.8" fill="currentColor" />
    </svg>
  );
}

/**
 * PUBLIC_INTERFACE
 * QueenIcon - inline SVG for representing Player O as a chess queen.
 */
export function QueenIcon({
  className,
  title = "Queen",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={title}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      focusable="false"
    >
      <title>{title}</title>
      <path
        d="M5 19h14v2H5v-2zm12.87-10.5c-.23 0-.45.05-.65.13L15.5 5.5l-2.3 3.2c-.37-.13-.76-.2-1.2-.2-.42 0-.83.07-1.21.2L8.5 5.5l-1.72 3.13c-.2-.08-.42-.13-.65-.13-.83 0-1.5.67-1.5 1.5S5.3 11 6.13 11c.44 0 .83-.18 1.11-.48l1.83 2.7L8 16h8l-1.07-2.78 1.83-2.7c.27.3.67.48 1.11.48.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5zM9.5 18h5l.5-2h-6l.5 2z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * PUBLIC_INTERFACE
 * PlayerIcon - convenience component to render the correct icon based on player.
 */
export function PlayerIcon({
  player,
  className,
  size = "1em",
  title,
  fallbackEmoji = true,
}: {
  player: Player;
  className?: string;
  size?: string | number;
  title?: string;
  fallbackEmoji?: boolean;
}) {
  const common = {
    className,
  };
  // Emoji fallback for environments where SVG fails to load or is disabled.
  if (fallbackEmoji === true) {
    if (player === "X") {
      return (
        <span
          role="img"
          aria-label={title ?? "Knight (Player X)"}
          style={{ fontSize: typeof size === "number" ? `${size}px` : size, lineHeight: 1 }}
        >
          ♞
        </span>
      );
    }
    return (
      <span
        role="img"
        aria-label={title ?? "Queen (Player O)"}
        style={{ fontSize: typeof size === "number" ? `${size}px` : size, lineHeight: 1 }}
      >
        ♛
      </span>
    );
  }

  if (player === "X") {
    return (
      <KnightIcon
        {...common}
        title={title ?? "Knight (Player X)"}
      />
    );
  }
  return (
    <QueenIcon
      {...common}
      title={title ?? "Queen (Player O)"}
    />
  );
}
