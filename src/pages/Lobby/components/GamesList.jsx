import React from 'react';
import GameCard from './GameCard';
import './GamesList.css';

export default function GamesList({ 
  games, 
  onJoinGame, 
  onRefresh, 
  onCreateGame,
  isConnected 
}) {
  return (
    <div className="public-games-section">
      <div className="public-games-header">
        <h3>Public Games</h3>
        <button 
          className="btn btn-secondary btn-refresh" 
          onClick={onRefresh}
          disabled={!isConnected}
        >
          🔄 Refresh
        </button>
      </div>

      {games.length === 0 ? (
        <div className="no-games">
          <p>No public games available</p>
          <button className="btn btn-secondary" onClick={onCreateGame}>
            Create a Game
          </button>
        </div>
      ) : (
        <div className="games-list">
          {games.map(game => (
            <GameCard 
              key={game.id} 
              game={game} 
              onJoin={onJoinGame}
            />
          ))}
        </div>
      )}
    </div>
  );
}

