import React from 'react';
import './GameStatus.css';

export default function GameStatus({ game, winner, myPlayer, socketId }) {
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

  if (winner) {
    return (
      <div className="game-status winner-announcement">
        {winner === "draw" ? (
          "🤝 It's a Draw!"
        ) : game.teamMode ? (
          myPlayer && myPlayer.teamId === winner ? (
            "🎉 Your Team Wins! 🎉"
          ) : (
            "😢 Your Team Lost"
          )
        ) : (
          myPlayer && myPlayer.symbol === winner ? (
            "🎉 You Win! 🎉"
          ) : (
            "😢 You Lost"
          )
        )}
      </div>
    );
  }

  return (
    <div className="game-status">
      {myPlayer ? (
        <>
          <span style={{ color: getColorForSymbol(myPlayer.symbol) }}>
            You are {myPlayer.symbol}
          </span>
          <br />
          {game.currentPlayer === socketId ? (
            <span style={{ color: getColorForSymbol(myPlayer.symbol), fontWeight: 'bold' }}>
              🟢 Your Turn
            </span>
          ) : (
            (() => {
              const currentPlayer = game.players.find(p => p.userId === game.currentPlayer);
              return currentPlayer ? (
                <span style={{ color: getColorForSymbol(currentPlayer.symbol) }}>
                  ⏳ {currentPlayer.username}'s Turn
                </span>
              ) : (
                <span>⏳ Waiting...</span>
              );
            })()
          )}
        </>
      ) : (
        "Waiting..."
      )}
    </div>
  );
}

