import type { MetaFunction } from "@remix-run/node";
import { useEffect, useMemo, useRef } from "react";
import { Board } from "~/components/Board";
import { useTicTacToe } from "~/hooks/useTicTacToe";

export const meta: MetaFunction = () => {
  return [
    { title: "Tic Tac Toe — Ocean Professional" },
    {
      name: "description",
      content:
        "Play a modern, responsive Tic Tac Toe game. Two-player local play with accessibility and smooth UI.",
    },
  ];
};

export default function Index() {
  const { board, status, currentPlayer, canPlay, play, reset, undo, scores, history } =
    useTicTacToe();

  // Accessibility: Announce status updates
  const liveRef = useRef<HTMLDivElement | null>(null);
  const statusMessage = useMemo(() => {
    if (status.type === "win") return `Player ${status.winner} wins!`;
    if (status.type === "draw") return "It's a draw.";
    return `Current player: ${currentPlayer}`;
  }, [status, currentPlayer]);

  useEffect(() => {
    if (liveRef.current) {
      liveRef.current.textContent = statusMessage;
    }
  }, [statusMessage]);

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(180deg, rgba(37,99,235,0.08) 0%, rgba(249,250,251,1) 100%)",
      }}
    >
      <section
        className="w-full max-w-3xl flex flex-col items-center gap-6 sm:gap-8"
        aria-label="Tic Tac Toe Game"
      >
        <header className="text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827]">
            Tic Tac Toe
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            Modern, minimalist UI with Ocean Professional styling
          </p>
        </header>

        <div
          className="rounded-2xl border border-gray-200 bg-white shadow-xl p-4 sm:p-6 w-full"
          style={{ maxWidth: 680 }}
        >
          <div className="flex flex-col items-center gap-4 sm:gap-5">
            {/* Score and player indicator */}
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 ring-1 ring-blue-200">
                  Turn:
                  <span
                    className={
                      currentPlayer === "X" ? "text-blue-700" : "text-amber-600"
                    }
                    aria-live="polite"
                  >
                    {currentPlayer}
                  </span>
                </span>
                {!canPlay && status.type === "win" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700 ring-1 ring-amber-200">
                    Winner: {status.winner}
                  </span>
                )}
                {!canPlay && status.type === "draw" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 ring-1 ring-gray-300">
                    Draw
                  </span>
                )}
              </div>

              {/* Scores */}
              <div className="flex items-center gap-2 text-sm">
                <span className="rounded-md bg-blue-50 px-2.5 py-1 font-semibold text-blue-700 ring-1 ring-blue-200">
                  X: {scores.X}
                </span>
                <span className="rounded-md bg-amber-50 px-2.5 py-1 font-semibold text-amber-700 ring-1 ring-amber-200">
                  O: {scores.O}
                </span>
                <span className="rounded-md bg-gray-100 px-2.5 py-1 font-semibold text-gray-700 ring-1 ring-gray-300">
                  Draws: {scores.draws}
                </span>
              </div>
            </div>

            {/* Board */}
            <Board board={board} status={status} onPlay={play} />

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center rounded-lg bg-[#2563EB] px-4 py-2 text-white shadow-sm transition-colors hover:bg-blue-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300/50"
              >
                New Game
              </button>
              <button
                type="button"
                onClick={undo}
                disabled={history.length === 0 || !canPlay}
                className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-[#111827] shadow-sm ring-1 ring-gray-200 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300/40 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-disabled={history.length === 0 || !canPlay}
              >
                Undo
              </button>
            </div>

            {/* Live region for announcements */}
            <div
              ref={liveRef}
              className="sr-only"
              aria-live="polite"
              aria-atomic="true"
            />
          </div>
        </div>

        <footer className="text-xs text-gray-500">
          Colors: primary #2563EB, secondary/success #F59E0B, error #EF4444
        </footer>
      </section>
    </main>
  );
}
