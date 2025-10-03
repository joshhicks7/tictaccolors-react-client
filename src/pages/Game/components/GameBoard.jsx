import React, { useState } from 'react';
import socket from '../../../socket';
import Toast from '../../../components/shared/Toast';
import './GameBoard.css';

export default function GameBoard({ game, winner, myPlayer, onMakeMove }) {
  const [toastMessage, setToastMessage] = useState(null);

  if (!game.started || !game.board) return null;

  const boardSize = Math.sqrt(game.board.length);
  const isMyTurn = game.currentPlayer === socket.id;

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

  const handleCellClick = (idx) => {
    if (game.board[idx] || winner || !myPlayer) return;
    
    if (!isMyTurn) {
      // Show toast notification that it's not their turn
      const currentPlayer = game.players.find(p => p.userId === game.currentPlayer);
      setToastMessage(`It's ${currentPlayer?.username}'s turn!`);
      return;
    }
    
    onMakeMove(idx);
  };

  return (
    <>
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      )}
      
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
            onClick={() => handleCellClick(idx)}
            disabled={!!cell || !!winner || !myPlayer}
            data-empty={!cell}
            style={{ 
              backgroundColor: cell ? getColorForSymbol(cell) : '#f8f9fa',
              cursor: (!cell && !winner && myPlayer && isMyTurn) ? 'pointer' : 'not-allowed'
            }}
          >
            {cell || ""}
          </button>
        ))}
      </div>
    </>
  );
}

