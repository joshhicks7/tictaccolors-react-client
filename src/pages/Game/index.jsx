import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../../socket";
import GameBoard from "./components/GameBoard";
import GameStatus from "./components/GameStatus";
import TeamDisplay from "./components/TeamDisplay";
import RematchSection from "./components/RematchSection";
import './styles.css';

export default function Game() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    console.log("[GAME] Requesting game state for:", gameId);
    socket.emit("getGameState", { gameId }, (response) => {
      if (response && response.ok) {
        console.log("[GAME] Received initial game state");
        setGame(response.game);
      } else {
        console.error("[GAME] Failed to get game state:", response?.error);
        alert("Game not found");
        navigate("/");
      }
    });

    socket.on("gameState", (updatedGame) => {
      console.log("[GAME] Received game state update");
      setGame(updatedGame);
      
      if (updatedGame.board && updatedGame.board.every(cell => cell === null) && !updatedGame.winner) {
        setWinner(null);
      }
      
      if (!updatedGame || updatedGame.players.length === 0) {
        alert("Game has been closed");
        navigate("/");
      }
    });

    socket.on("gameOver", ({ winner }) => {
      setWinner(winner);
    });

    socket.on("playerLeft", ({ playerId }) => {
      console.log("Player left:", playerId);
    });

    return () => {
      socket.off("gameState");
      socket.off("gameOver");
      socket.off("playerLeft");
    };
  }, [gameId, navigate]);

  const makeMove = (index) => {
    if (!game || game.board[index] || winner) return;
    
    socket.emit("makeMove", { gameId, userId: socket.id, index });
  };

  const goBackToLobby = () => {
    navigate("/");
  };

  const handleRematch = () => {
    socket.emit("requestRematch", { gameId }, (response) => {
      if (response && response.ok) {
        if (response.rematchStarted) {
          setWinner(null);
        }
      } else {
        alert(response?.error || "Failed to request rematch");
      }
    });
  };

  const handleStartGame = () => {
    socket.emit("startGame", { gameId }, (response) => {
      if (!response.ok) {
        alert(response.error);
      }
    });
  };

  if (!game) {
    return (
      <div className="game-container">
        <h2>Loading game...</h2>
      </div>
    );
  }

  const myPlayer = game.players.find(p => p.userId === socket.id);

  return (
    <div className="game-container">
      <button className="back-button" onClick={goBackToLobby}>← Leave Game</button>
      
      <div className="game-header">
        <h2>Game #{game.id.substring(0, 6)}</h2>
        <GameStatus 
          game={game} 
          winner={winner} 
          myPlayer={myPlayer} 
          socketId={socket.id}
        />
      </div>

      <TeamDisplay game={game} />

      <GameBoard 
        game={game} 
        winner={winner} 
        myPlayer={myPlayer} 
        onMakeMove={makeMove}
      />

      <div className="game-info-footer">
        <p>Players: {game.players.length}/{game.maxPlayers}</p>
        <p>Required to Win: {game.requiredToWin} in a row</p>
        {!game.started && !winner && (
          <>
            <p className="waiting-message">
              {game.players.length < 2 
                ? "Need at least 2 players to start" 
                : game.players.length < game.maxPlayers 
                  ? "Waiting for more players or host to start..." 
                  : "Ready to start!"}
            </p>
            {game.hostId === socket.id && game.players.length >= 2 && (
              <button 
                className="btn btn-primary" 
                onClick={handleStartGame}
                style={{ marginTop: '15px' }}
              >
                Start Game Now ({game.players.length} Players)
              </button>
            )}
          </>
        )}
      </div>

      <RematchSection
        game={game}
        winner={winner}
        socketId={socket.id}
        onRematch={handleRematch}
        onBackToLobby={goBackToLobby}
      />
    </div>
  );
}

