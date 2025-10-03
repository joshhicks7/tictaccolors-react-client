import React from 'react';
import './RematchSection.css';

export default function RematchSection({ game, winner, socketId, onRematch, onBackToLobby }) {
  if (!winner) return null;

  const hasRequested = game.rematchRequests?.includes(socketId);

  return (
    <div className="rematch-section">
      {game.rematchRequests && game.rematchRequests.length > 0 && (
        <div className="rematch-status">
          {hasRequested ? (
            <>
              ✓ Waiting for others... ({game.rematchRequests.length}/{game.players.length} ready)
              {game.rematchRequests.length < 2 && (
                <div className="rematch-hint">
                  Need at least 2 players to start
                </div>
              )}
            </>
          ) : (
            <>
              {game.rematchRequests.length} player{game.rematchRequests.length > 1 ? 's' : ''} want{game.rematchRequests.length === 1 ? 's' : ''} to play again
            </>
          )}
        </div>
      )}
      
      <div className="rematch-buttons">
        {!hasRequested ? (
          <button className="btn btn-primary btn-large" onClick={onRematch}>
            Play Again
          </button>
        ) : (
          <button 
            className="btn btn-secondary btn-large" 
            onClick={onRematch}
            disabled
          >
            ⏳ Waiting...
          </button>
        )}
        <button className="btn btn-secondary btn-large" onClick={onBackToLobby}>
          Back to Lobby
        </button>
      </div>
    </div>
  );
}

