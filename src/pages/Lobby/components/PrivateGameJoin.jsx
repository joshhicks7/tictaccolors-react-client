import React from 'react';
import './PrivateGameJoin.css';

export default function PrivateGameJoin({ 
  gameIdInput, 
  setGameIdInput, 
  onJoin, 
  isConnected 
}) {
  const handleJoin = () => {
    if (gameIdInput.trim()) {
      onJoin(gameIdInput.trim());
    } else {
      alert("Please enter a Game ID");
    }
  };

  return (
    <div className="private-game-section">
      <h3>Join Private Game</h3>
      <div className="game-id-input-group">
        <input
          type="text"
          value={gameIdInput}
          onChange={(e) => setGameIdInput(e.target.value.toUpperCase())}
          placeholder="Enter Game ID"
          className="game-id-input"
        />
        <button
          className="btn btn-primary"
          onClick={handleJoin}
          disabled={!gameIdInput.trim() || !isConnected}
        >
          Join
        </button>
      </div>
      <p className="game-id-hint">
        Ask the host for the 6-character Game ID
      </p>
    </div>
  );
}

