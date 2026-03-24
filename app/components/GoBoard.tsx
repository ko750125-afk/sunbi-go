'use client'

import { useState, useCallback } from 'react'
import { Stone, Problem } from '../types'

interface GoBoardProps {
  problem: Problem
  onSolve: (isCorrect: boolean, moves: string[]) => void
  disabled?: boolean
}

type CellState = 'empty' | 'black' | 'white'

export default function GoBoard({ problem, onSolve, disabled = false }: GoBoardProps) {
  const size = problem.boardSize
  const [playerMoves, setPlayerMoves] = useState<string[]>([])
  const [boardState, setBoardState] = useState<CellState[][]>(() => {
    const grid: CellState[][] = Array(size).fill(null).map(() => Array(size).fill('empty'))
    problem.stones.forEach(stone => {
      if (stone.x >= 1 && stone.x <= size && stone.y >= 1 && stone.y <= size) {
        grid[stone.y - 1][stone.x - 1] = stone.color
      }
    })
    return grid
  })

  // Determine whose turn it is based on stone counts
  const blackCount = problem.stones.filter(s => s.color === 'black').length
  const whiteCount = problem.stones.filter(s => s.color === 'white').length
  const [currentColor] = useState<'black' | 'white'>(
    blackCount <= whiteCount ? 'black' : 'white'
  )

  const handleCellClick = useCallback((row: number, col: number) => {
    if (disabled) return
    if (boardState[row][col] !== 'empty') return

    const moveStr = `${col + 1},${row + 1}`
    const newBoard = boardState.map(r => [...r])
    newBoard[row][col] = currentColor

    const newMoves = [...playerMoves, moveStr]
    setPlayerMoves(newMoves)
    setBoardState(newBoard)

    // Check if this matches the solution
    const expectedMove = problem.solution[newMoves.length - 1]
    const isCorrectMove = expectedMove === moveStr

    if (!isCorrectMove || newMoves.length === problem.solution.length) {
      const isFullySolved = newMoves.length === problem.solution.length &&
        newMoves.every((move, idx) => move === problem.solution[idx])
      onSolve(isFullySolved, newMoves)
    }
  }, [boardState, currentColor, disabled, onSolve, playerMoves, problem.solution])

  const getCellSize = () => {
    if (size <= 5) return 'size-14 md:size-16'
    if (size <= 7) return 'size-10 md:size-12'
    return 'size-8 md:size-10'
  }

  const getStoneSize = () => {
    if (size <= 5) return 'size-10 md:size-11'
    if (size <= 7) return 'size-7 md:size-9'
    return 'size-6 md:size-7'
  }

  const getLineThickness = () => size <= 5 ? 'border-[1.5px]' : 'border'
  const lineColor = 'border-[#8B5E3C]/40'

  const cellSize = getCellSize()
  const stoneSize = getStoneSize()

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Board */}
      <div
        className="relative rounded-xl shadow-xl border-4 border-[#b5813c]/40 p-2 md:p-4"
        style={{ background: 'linear-gradient(135deg, #d4a55a 0%, #c8953e 50%, #b5813c 100%)' }}
      >
        {/* Grid lines */}
        <div
          className="relative"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            gridTemplateRows: `repeat(${size}, 1fr)`,
          }}
        >
          {/* Horizontal lines */}
          {Array.from({ length: size }).map((_, row) => (
            Array.from({ length: size }).map((_, col) => (
              <div
                key={`${row}-${col}`}
                className={`relative flex items-center justify-center cursor-pointer go-cell ${cellSize}`}
                onClick={() => handleCellClick(row, col)}
              >
                {/* Line segments */}
                {row > 0 && (
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1.5px] h-1/2 bg-[#5a3a1a]/50`} />
                )}
                {row < size - 1 && (
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 w-[1.5px] h-1/2 bg-[#5a3a1a]/50`} />
                )}
                {col > 0 && (
                  <div className={`absolute top-1/2 left-0 -translate-y-1/2 h-[1.5px] w-1/2 bg-[#5a3a1a]/50`} />
                )}
                {col < size - 1 && (
                  <div className={`absolute top-1/2 left-1/2 -translate-y-1/2 h-[1.5px] w-1/2 bg-[#5a3a1a]/50`} />
                )}

                {/* Star points for 9x9 */}
                {size === 9 && [2, 4, 6].includes(row) && [2, 4, 6].includes(col) && (
                  <div className="absolute w-2 h-2 bg-[#5a3a1a]/60 rounded-full z-10" />
                )}

                {/* Stones */}
                {boardState[row][col] !== 'empty' && (
                  <div
                    className={`${stoneSize} rounded-full z-20 stone-animate ${
                      boardState[row][col] === 'black' ? 'go-stone-black' : 'go-stone-white'
                    }`}
                  />
                )}

                {/* Hover hint */}
                {boardState[row][col] === 'empty' && !disabled && (
                  <div className={`${stoneSize} rounded-full z-20 opacity-0 hover:opacity-30 transition-opacity ${
                    currentColor === 'black' ? 'bg-black' : 'bg-white border-2 border-gray-400'
                  }`} />
                )}
              </div>
            ))
          ))}
        </div>
      </div>

      {/* Coordinate labels */}
      <div className="text-sm text-on-surface-variant font-label">
        {playerMoves.length === 0
          ? `흑 차례 — 최선의 수를 찾으세요`
          : `${playerMoves.length}수 착수됨`}
      </div>
    </div>
  )
}
