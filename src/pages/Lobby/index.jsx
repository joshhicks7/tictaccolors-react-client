import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";
import ConnectionStatus from "./components/ConnectionStatus";
import PrivateGameJoin from "./components/PrivateGameJoin";
import GamesList from "./components/GamesList";
import './styles.css';

export default function Lobby() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [view, setView] = useState("main"); // main, create, join
  const [games, setGames] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  
  // Create game settings
  const [gameMode, setGameMode] = useState("vs");
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [requiredToWin, setRequiredToWin] = useState(3);
  const [visibility, setVisibility] = useState("public");
  const [gameIdInput, setGameIdInput] = useState("");

  const fetchGames = () => {
    if (!socket.connected) {
      console.log("[LOBBY] Cannot fetch games - not connected");
      return;
    }
    
    console.log("[LOBBY] Fetching public games...");
    socket.emit("getPublicGames", (response) => {
      if (response && response.games) {
        console.log("[LOBBY] Received", response.games.length, "games");
        setGames(response.games);
      }
    });
  };

  useEffect(() => {
    const onConnect = () => {
      console.log("[LOBBY] Socket connected:", socket.id);
      setIsConnected(true);
      setTimeout(() => fetchGames(), 100);
    };

    const onDisconnect = () => {
      console.log("[LOBBY] Socket disconnected");
      setIsConnected(false);
    };

    const onConnectError = (error) => {
      console.log("[LOBBY] Connection error:", error);
      setIsConnected(false);
    };

    if (socket.connected) {
      onConnect();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
    };
  }, []);

  useEffect(() => {
    if (view === "join" && isConnected) {
      const interval = setInterval(fetchGames, 5000);
      return () => clearInterval(interval);
    }
  }, [view, isConnected]);

  const createGame = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!isConnected) {
      alert("Not connected to server. Please check your connection.");
      return;
    }

    socket.emit(
      "createGame",
      {
        hostName: name,
        visibility,
        teamMode: gameMode === "team",
        maxPlayers,
        requiredToWin,
        invitedUsers: []
      },
      res => {
        if (res.ok) {
          joinGame(res.gameId, null);
        }
      }
    );
  };

  const joinGame = (gameId, preferredTeamId = null) => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!isConnected) {
      alert("Not connected to server. Please check your connection.");
      return;
    }

    socket.emit("joinGame", { gameId, userId: socket.id, username: name, preferredTeamId }, res => {
      if (res.ok) {
        navigate(`/game/${gameId}`);
      } else {
        alert(res.error);
      }
    });
  };

  // Main menu view
  if (view === "main") {
    return (
      <div className="lobby-container">
        <div className="lobby-card">
          <h2>Welcome to TicTacColors</h2>
          
          <ConnectionStatus isConnected={isConnected} />
          
          <div className="name-input-group">
            <label>Your Name:</label>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Enter your name"
              className="name-input"
            />
          </div>

          <div className="menu-buttons">
            <button 
              className="btn btn-primary" 
              onClick={() => setView("create")}
              disabled={!name.trim()}
            >
              Create Game
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setView("join")}
              disabled={!name.trim()}
            >
              Join Game
            </button>
          </div>

          {!name.trim() && <p className="hint">Please enter your name to continue</p>}
        </div>
      </div>
    );
  }

  // Create game view
  if (view === "create") {
    return (
      <div className="lobby-container">
        <div className="lobby-card">
          <button className="back-button" onClick={() => setView("main")}>← Back</button>
          
          <h2>Create Game</h2>
          <p className="player-name">Playing as: <strong>{name}</strong></p>

          <div className="game-settings">
            <div className="setting-group">
              <label>Game Mode:</label>
              <div className="mode-selector">
                <button 
                  className={`mode-btn ${gameMode === "vs" ? "active" : ""}`}
                  onClick={() => setGameMode("vs")}
                >
                  VS
                </button>
                <button 
                  className={`mode-btn ${gameMode === "team" ? "active" : ""}`}
                  onClick={() => setGameMode("team")}
                >
                  Team
                </button>
              </div>
            </div>

            <div className="setting-group">
              <label>Max Players:</label>
              <select value={maxPlayers} onChange={e => setMaxPlayers(Number(e.target.value))}>
                {gameMode === "vs" ? (
                  <>
                    <option value={2}>2 Players</option>
                    <option value={3}>3 Players</option>
                    <option value={4}>4 Players</option>
                    <option value={5}>5 Players</option>
                    <option value={6}>6 Players</option>
                  </>
                ) : (
                  <>
                    <option value={2}>2 Players (1v1)</option>
                    <option value={4}>4 Players (2v2)</option>
                    <option value={6}>6 Players (3v3)</option>
                  </>
                )}
              </select>
            </div>

            <div className="setting-group">
              <label>Required to Win:</label>
              <select value={requiredToWin} onChange={e => setRequiredToWin(Number(e.target.value))}>
                <option value={3}>3 in a row</option>
                <option value={4}>4 in a row</option>
                <option value={5}>5 in a row</option>
              </select>
            </div>

            <div className="setting-group">
              <label>Visibility:</label>
              <select value={visibility} onChange={e => setVisibility(e.target.value)}>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <button 
            className="btn btn-primary btn-large" 
            onClick={createGame}
            disabled={!isConnected}
          >
            Create Game
          </button>
          
          {visibility === "private" && (
            <p className="hint">
              Private games won't appear in the public list. Share the game ID with your friends!
            </p>
          )}
        </div>
      </div>
    );
  }

  // Join games view
  if (view === "join") {
    return (
      <div className="lobby-container">
        <div className="lobby-card">
          <button className="back-button" onClick={() => setView("main")}>← Back</button>
          
          <h2>Join Game</h2>
          <p className="player-name">Playing as: <strong>{name}</strong></p>

          <PrivateGameJoin
            gameIdInput={gameIdInput}
            setGameIdInput={setGameIdInput}
            onJoin={joinGame}
            isConnected={isConnected}
          />

          <GamesList
            games={games}
            onJoinGame={joinGame}
            onRefresh={fetchGames}
            onCreateGame={() => setView("create")}
            isConnected={isConnected}
          />
        </div>
      </div>
    );
  }
}

