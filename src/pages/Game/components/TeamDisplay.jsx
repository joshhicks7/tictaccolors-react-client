import React from 'react';
import './TeamDisplay.css';

export default function TeamDisplay({ game }) {
  if (!game.started || !game.teamMode) return null;

  return (
    <div className="teams-display">
      {game.teams.map(team => (
        <div 
          key={team.teamId} 
          className="team-card"
          style={{ 
            borderColor: team.color.toLowerCase(),
            background: `linear-gradient(135deg, ${team.color.toLowerCase()} 0%, ${team.color.toLowerCase()}dd 100%)`
          }}
        >
          <div className="team-players">
            {team.players.map(pid => {
              const player = game.players.find(p => p.userId === pid);
              return player ? (
                <div key={pid} className="player-item">
                  {player.username}
                </div>
              ) : null;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

