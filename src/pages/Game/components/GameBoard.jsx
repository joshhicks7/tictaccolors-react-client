import React from 'react';
import './GameBoard.css';

export default function GameBoard({ game, winner, myPlayer, onMakeMove }) {
  if (!game.started || !game.board) return null;

  const boardSize = Math.sqrt(game.board.length);

  const getColorForSymbol = (symbol) => {
    const colors = {
      'Red': '#ef4444',
      'Blue': '#3b82f6',
      'Green': '#10b981',
      'Yellow': '#f59e0b',
      'Purple': '#a855f7',
      'Orange': '#f97316'
    };
    return colors[symbol] || '#6b7280';
  };

  return (
    <div 
      className="board" 
      style={{ 
        gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
        width: '100%',
        maxWidth: `min(500px, 90vw)`
      }}
    >
      {game.board.map((cell, idx) => (
        <button
          key={idx}
          onClick={() => onMakeMove(idx)}
          disabled={!!cell || !!winner || !myPlayer}
          data-empty={!cell}
          style={{ 
            backgroundColor: cell ? getColorForSymbol(cell) : '#f8f9fa',
            cursor: (!cell && !winner && myPlayer) ? 'pointer' : 'not-allowed'
          }}
        >
          {cell || ""}
        </button>
      ))}
    </div>
  );
}

