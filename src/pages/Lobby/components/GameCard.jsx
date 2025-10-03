import React from 'react';
import './GameCard.css';

export default function GameCard({ game, onJoin }) {
  return (
    <div className="game-card">
      <div className="game-info">
        <h3>Game #{game.id.substring(0, 6)}</h3>
        <span className="game-mode-badge">
          {game.teamMode ? "Team" : "VS"}
        </span>
        <p className="player-count">
          {game.players.length}/{game.maxPlayers} Players
        </p>
      </div>

      {game.teamMode ? (
        <div className="team-join-options">
          <p className="team-label">Join a team:</p>
          {game.teams?.map(team => {
            const teamPlayerCount = game.players.filter(p => p.teamId === team.teamId).length;
            const maxPerTeam = Math.ceil(game.maxPlayers / 2);
            const isFull = teamPlayerCount >= maxPerTeam;
            
            return (
              <button
                key={team.teamId}
                className={`team-btn team-${team.color.toLowerCase()}`}
                onClick={() => onJoin(game.id, team.teamId)}
                disabled={isFull}
                style={{ backgroundColor: team.color.toLowerCase() }}
              >
                {team.teamId} ({teamPlayerCount}/{maxPerTeam})
                {isFull && " - Full"}
              </button>
            );
          })}
        </div>
      ) : (
        <button 
          className="btn btn-primary"
          onClick={() => onJoin(game.id)}
          disabled={game.players.length >= game.maxPlayers}
        >
          {game.players.length >= game.maxPlayers ? "Full" : "Join Game"}
        </button>
      )}
    </div>
  );
}

