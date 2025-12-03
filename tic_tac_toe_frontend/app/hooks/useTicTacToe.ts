import { useCallback, useMemo, useState } from "react";

export type Player = "X" | "O";
export type CellValue = Player | null;

export type GameStatus =
  | { type: "in_progress"; currentPlayer: Player }
  | { type: "win"; winner: Player; line: number[] }
  | { type: "draw" };

// Winning line indices for a 3x3 board
const WIN_LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // cols
  [0, 4, 8],
  [2, 4, 6], // diags
];

/**
 * PUBLIC_INTERFACE
 * useTicTacToe
 * A React hook that manages Tic Tac Toe game state including board, turn, win/draw detection,
 * winning line highlighting, and simple in-memory scoring with undo/move history.
 */
export function useTicTacToe() {
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [history, setHistory] = useState<{ board: CellValue[]; player: Player }[]>([]);
  const [scores, setScores] = useState<{ X: number; O: number; draws: number }>({
    X: 0,
    O: 0,
    draws: 0,
  });

  const evaluateStatus = useCallback(
    (b: CellValue[]): GameStatus => {
      for (const line of WIN_LINES) {
        const [a, c, d] = line;
        if (b[a] && b[a] === b[c] && b[a] === b[d]) {
          return { type: "win", winner: b[a]!, line };
        }
      }
      const isFull = b.every((v) => v !== null);
      if (isFull) {
        return { type: "draw" };
      }
      return { type: "in_progress", currentPlayer };
    },
    [currentPlayer]
  );

  const status: GameStatus = useMemo(() => evaluateStatus(board), [board, evaluateStatus]);

  const canPlay = status.type === "in_progress";

  // PUBLIC_INTERFACE
  /** Play a move at a particular index if the cell is empty and game is in progress. */
  const play = useCallback(
    (index: number) => {
      if (!canPlay || board[index] !== null) return;
      const nextBoard = board.slice();
      nextBoard[index] = currentPlayer;
      setHistory((h) => [...h, { board, player: currentPlayer }]);
      setBoard(nextBoard);
      setCurrentPlayer((p) => (p === "X" ? "O" : "X"));
    },
    [board, canPlay, currentPlayer]
  );

  // PUBLIC_INTERFACE
  /** Reset the board and status for a new game, preserving scores. */
  const reset = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer((prev) => (prev === "X" ? "O" : "X")); // alternate starting player for fairness
    setHistory([]);
  }, []);

  // PUBLIC_INTERFACE
  /** Undo the last move (if any). */
  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setBoard(prev.board);
      setCurrentPlayer(prev.player);
      return h.slice(0, -1);
    });
  }, []);

  // Update scores when game reaches a terminal state (win/draw).
  useMemo(() => {
    if (status.type === "win") {
      setScores((s) => ({ ...s, [status.winner]: s[status.winner] + 1 }));
    } else if (status.type === "draw") {
      setScores((s) => ({ ...s, draws: s.draws + 1 }));
    }
    // We only want to react when the board reaches a terminal state, not on every move.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.type === "win" ? `win-${status.winner}-${status.line.join("-")}` : status.type]);

  return {
    board,
    currentPlayer,
    status,
    canPlay,
    play,
    reset,
    undo,
    history,
    scores,
  };
}
