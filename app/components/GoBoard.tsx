'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Problem } from '../types'
import { playStoneSound } from '../utils/audio'

interface GoBoardProps {
  problem: Problem
  onSolve: (isCorrect: boolean) => void
  onProgress?: (moveIndex: number, total: number) => void
  disabled?: boolean
  demoMode?: boolean
}

type CellState = 'empty' | 'black' | 'white'

function initBoard(problem: Problem): CellState[][] {
  const size = problem.boardSize
  const grid: CellState[][] = Array(size).fill(null).map(() => Array(size).fill('empty'))
  problem.stones.forEach(stone => {
    if (stone.x >= 1 && stone.x <= size && stone.y >= 1 && stone.y <= size) {
      grid[stone.y - 1][stone.x - 1] = stone.color
    }
  })
  return grid
}

const checkCaptures = (board: CellState[][], newlyPlacedRow: number, newlyPlacedCol: number, stoneColor: 'black' | 'white'): CellState[][] => {
  const size = board.length;
  const nextBoard = board.map(r => [...r]);
  const opponentColor = stoneColor === 'black' ? 'white' : 'black';
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  const getGroup = (r: number, c: number, color: CellState) => {
    const group: [number, number][] = [];
    const visited = Array(size).fill(0).map(() => Array(size).fill(false));
    const stack: [number, number][] = [[r, c]];
    visited[r][c] = true;
    let liberties = 0;

    while (stack.length > 0) {
      const [currR, currC] = stack.pop()!;
      group.push([currR, currC]);

      for (const [dr, dc] of dirs) {
        const nr = currR + dr;
        const nc = currC + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          if (nextBoard[nr][nc] === 'empty') {
            liberties++;
          } else if (nextBoard[nr][nc] === color && !visited[nr][nc]) {
            visited[nr][nc] = true;
            stack.push([nr, nc]);
          }
        }
      }
    }
    return { group, liberties };
  };

  // Check all 4 adjacent cells for opponent groups to capture
  let capturedOpponent = false;
  for (const [dr, dc] of dirs) {
    const nr = newlyPlacedRow + dr;
    const nc = newlyPlacedCol + dc;
    if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
      if (nextBoard[nr][nc] === opponentColor) {
        const { group, liberties } = getGroup(nr, nc, opponentColor);
        if (liberties === 0) {
          // Capture!
          group.forEach(([gr, gc]) => {
            nextBoard[gr][gc] = 'empty';
          });
          capturedOpponent = true;
        }
      }
    }
  }

  // Check self capture (Suicide) - prevalent in Tsumego for "under the stones"
  if (!capturedOpponent) {
    const selfGroup = getGroup(newlyPlacedRow, newlyPlacedCol, stoneColor);
    if (selfGroup.liberties === 0) {
      selfGroup.group.forEach(([gr, gc]) => {
        nextBoard[gr][gc] = 'empty';
      });
    }
  }

  return nextBoard;
};

export default function GoBoard({ problem, onSolve, onProgress, disabled = false, demoMode = false }: GoBoardProps) {
  const size = problem.boardSize
  const [boardState, setBoardState] = useState<CellState[][]>(() => initBoard(problem))
  const [moveIndex, setMoveIndex] = useState(0)          // which solution move we're on
  const [lastMove, setLastMove] = useState<string | null>(null)
  const [wrongMove, setWrongMove] = useState<string | null>(null)
  const [aiThinking, setAiThinking] = useState(false)
  const [animatingCell, setAnimatingCell] = useState<string | null>(null)
  const isProcessing = useRef(false)
  const demoTimeouts = useRef<NodeJS.Timeout[]>([])

  // Player always plays even indices (0,2,4…), AI plays odd indices (1,3,5…)
  const playerColor: 'black' | 'white' = (() => {
    const bc = problem.stones.filter(s => s.color === 'black').length
    const wc = problem.stones.filter(s => s.color === 'white').length
    return bc <= wc ? 'black' : 'white'
  })()
  const aiColor: 'black' | 'white' = playerColor === 'black' ? 'white' : 'black'

  const placeStone = useCallback((row: number, col: number, color: 'black' | 'white') => {
    const key = `${col + 1},${row + 1}`
    setBoardState(prev => {
      if (prev[row][col] !== 'empty') return prev;
      const next = prev.map(r => [...r])
      next[row][col] = color
      return checkCaptures(next, row, col, color)
    })
    setLastMove(key)
    setAnimatingCell(key)
    setTimeout(() => setAnimatingCell(null), 300)
  }, [])

  const handleCellClick = useCallback((row: number, col: number) => {
    if (disabled || demoMode || aiThinking || isProcessing.current) return
    if (boardState[row][col] !== 'empty') return
    if (moveIndex >= problem.solution.length) return
    
    // ... [existing click logic unchanged below] ...
    
    const moveStr = `${col + 1},${row + 1}`
    const expectedMove = problem.solution[moveIndex]

    // Wrong move
    if (moveStr !== expectedMove) {
      setWrongMove(moveStr)
      playStoneSound(false)
      setTimeout(() => setWrongMove(null), 800)
      onSolve(false)
      return
    }

    // Correct player move
    isProcessing.current = true
    playStoneSound(false)
    placeStone(row, col, playerColor)
    const nextIndex = moveIndex + 1
    setMoveIndex(nextIndex)
    onProgress?.(nextIndex, problem.solution.length)

    // Check if puzzle is done
    if (nextIndex >= problem.solution.length) {
      isProcessing.current = false
      onSolve(true)
      return
    }

    // AI response — plays odd-indexed moves
    setAiThinking(true)
    setTimeout(() => {
      const aiMoveStr = problem.solution[nextIndex]
      const [aiColStr, aiRowStr] = aiMoveStr.split(',')
      const aiCol = parseInt(aiColStr) - 1
      const aiRow = parseInt(aiRowStr) - 1

      playStoneSound(true)
      placeStone(aiRow, aiCol, aiColor)
      const afterAI = nextIndex + 1
      setMoveIndex(afterAI)
      setAiThinking(false)
      isProcessing.current = false
      onProgress?.(afterAI, problem.solution.length)

      // If AI move was the last move
      if (afterAI >= problem.solution.length) {
        onSolve(true)
      }
    }, 550)
  }, [disabled, demoMode, aiThinking, boardState, moveIndex, problem.solution, playerColor, aiColor, placeStone, onSolve, onProgress])

  useEffect(() => {
    if (demoMode) {
      setBoardState(initBoard(problem))
      setMoveIndex(0)
      setLastMove(null)
      setWrongMove(null)
      setAiThinking(false)
      
      let step = 0;
      demoTimeouts.current.forEach(clearTimeout);
      demoTimeouts.current = [];

      const runStep = () => {
        if (step >= problem.solution.length) return;
        
        const moveStr = problem.solution[step];
        const [colStr, rowStr] = moveStr.split(',');
        const col = parseInt(colStr) - 1;
        const row = parseInt(rowStr) - 1;
        const color = step % 2 === 0 ? playerColor : aiColor;

        playStoneSound(step % 2 === 1);
        
        setBoardState(prev => {
          if (prev[row][col] !== 'empty') return prev; // prevent overwrite
          const next = prev.map(r => [...r]);
          next[row][col] = color;
          return checkCaptures(next, row, col, color);
        });
        
        const key = `${col + 1},${row + 1}`;
        setLastMove(key);
        setAnimatingCell(key);
        setMoveIndex(step + 1);

        demoTimeouts.current.push(setTimeout(() => setAnimatingCell(null), 300));

        step++;
        demoTimeouts.current.push(setTimeout(runStep, 800));
      };

      demoTimeouts.current.push(setTimeout(runStep, 600));
    } else {
      demoTimeouts.current.forEach(clearTimeout);
      demoTimeouts.current = [];
    }

    return () => {
      demoTimeouts.current.forEach(clearTimeout);
    };
  }, [demoMode, problem, playerColor, aiColor]);

  // Determine cell and stone sizes based on board size
  const cellPx = size <= 5 ? 64 : size <= 7 ? 52 : 44
  const stonePx = Math.floor(cellPx * 0.78)

  const boardWidthPx = size * cellPx

  return (
    <div className="flex flex-col items-center gap-4">
      {/* AI thinking indicator */}
      {aiThinking && (
        <div className="flex items-center gap-3 px-6 py-3 bg-surface-container rounded-full text-2xl font-bold text-primary">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          상대방이 생각 중...
        </div>
      )}

      {/* Board */}
      <div className="w-full overflow-x-auto pb-4 px-2 text-center" style={{ scrollBehavior: 'smooth' }}>
        <div
          className="relative inline-block text-left rounded-xl shadow-2xl border-4 border-[#b5813c]/50"
          style={{
            background: 'linear-gradient(135deg, #d4a55a 0%, #c8953e 50%, #b5813c 100%)',
            padding: Math.floor(cellPx * 0.5) + 'px',
          }}
        >
        {/* Grid */}
        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: `repeat(${size}, ${cellPx}px)`,
            gridTemplateRows: `repeat(${size}, ${cellPx}px)`,
            width: size * cellPx + 'px',
            margin: '0 auto',
          }}
        >
          {/* Coordinate Labels */}
          {Array.from({ length: size }).map((_, i) => (
            <div key={`coord-top-${i}`} className="absolute text-[#4a2a0a]/60 font-bold text-sm md:text-base pointer-events-none" style={{ left: i * cellPx + cellPx/2, top: -24, transform: 'translateX(-50%)' }}>
              {i + 1}
            </div>
          ))}
          {Array.from({ length: size }).map((_, i) => (
            <div key={`coord-left-${i}`} className="absolute text-[#4a2a0a]/60 font-bold text-sm md:text-base pointer-events-none" style={{ top: i * cellPx + cellPx/2, left: -24, transform: 'translateY(-50%)' }}>
              {i + 1}
            </div>
          ))}

          {Array.from({ length: size }).map((_, row) =>
            Array.from({ length: size }).map((_, col) => {
              const key = `${col + 1},${row + 1}`
              const isLast = lastMove === key
              const isWrong = wrongMove === key
              const isAnimating = animatingCell === key
              const state = boardState[row][col]

              return (
                <div
                  key={`${row}-${col}`}
                  className="relative flex items-center justify-center cursor-pointer select-none"
                  style={{ width: cellPx, height: cellPx }}
                  onClick={() => handleCellClick(row, col)}
                >
                  {/* Grid lines */}
                  {row > 0 && <div className="absolute" style={{ top: 0, left: '50%', width: 1.5, height: '50%', background: 'rgba(74,42,10,0.55)', transform: 'translateX(-50%)' }} />}
                  {row < size - 1 && <div className="absolute" style={{ top: '50%', left: '50%', width: 1.5, height: '50%', background: 'rgba(74,42,10,0.55)', transform: 'translateX(-50%)' }} />}
                  {col > 0 && <div className="absolute" style={{ top: '50%', left: 0, height: 1.5, width: '50%', background: 'rgba(74,42,10,0.55)', transform: 'translateY(-50%)' }} />}
                  {col < size - 1 && <div className="absolute" style={{ top: '50%', left: '50%', height: 1.5, width: '50%', background: 'rgba(74,42,10,0.55)', transform: 'translateY(-50%)' }} />}

                  {/* Star points for 9x9 */}
                  {size === 9 && [2, 4, 6].includes(row) && [2, 4, 6].includes(col) && state === 'empty' && (
                    <div className="absolute rounded-full" style={{ width: 8, height: 8, background: 'rgba(74,42,10,0.6)' }} />
                  )}

                  {/* Wrong move flash */}
                  {isWrong && (
                    <div
                      className="absolute rounded-full z-30"
                      style={{
                        width: stonePx,
                        height: stonePx,
                        background: 'rgba(186,26,26,0.75)',
                        border: '3px solid #ba1a1a',
                      }}
                    />
                  )}

                  {/* Stone */}
                  {state !== 'empty' && !isWrong && (
                    <div
                      className="absolute rounded-full z-20"
                      style={{
                        width: stonePx,
                        height: stonePx,
                        background: state === 'black'
                          ? 'radial-gradient(circle at 35% 30%, #555, #000)'
                          : 'radial-gradient(circle at 35% 30%, #ffffff, #d0d0d0)',
                        boxShadow: state === 'black'
                          ? '2px 3px 8px rgba(0,0,0,0.7), inset -1px -1px 4px rgba(0,0,0,0.4)'
                          : '2px 3px 8px rgba(0,0,0,0.35), inset -1px -1px 3px rgba(180,180,180,0.5)',
                        border: state === 'white' ? '1px solid #bbb' : 'none',
                        transform: isAnimating ? 'scale(0.85)' : 'scale(1)',
                        transition: isAnimating ? 'none' : 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1)',
                      }}
                    >
                      {/* Last move indicator */}
                      {isLast && (
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            border: `2.5px solid ${state === 'black' ? 'rgba(255,255,255,0.7)' : 'rgba(66,43,39,0.8)'}`,
                          }}
                        />
                      )}
                    </div>
                  )}

                  {/* Hover hint (when empty and not disabled) */}
                  {state === 'empty' && !disabled && !aiThinking && (
                    <div
                      className="absolute rounded-full z-10 opacity-0 hover:opacity-25 transition-opacity"
                      style={{
                        width: stonePx,
                        height: stonePx,
                        background: playerColor === 'black' ? '#000' : '#fff',
                        border: playerColor === 'white' ? '1px solid #999' : 'none',
                      }}
                    />
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-3 text-xl text-on-surface-variant font-bold">
        <span>
          {aiThinking
            ? '상대 응수 중...'
            : moveIndex === 0
            ? '최선의 수를 두세요'
            : moveIndex >= problem.solution.length
            ? '수순 완료'
            : `${Math.ceil(moveIndex / 2 + 1)}번째 수`}
        </span>
        <span className="text-outline ml-2">
          {moveIndex}/{problem.solution.length}
        </span>
      </div>
    </div>
  )
}
