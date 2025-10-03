import { io } from "socket.io-client";

// Dynamically determine the server URL based on where the app is accessed from
const getServerURL = () => {
  // If environment variable is set, use it
  if (process.env.REACT_APP_SERVER_URL) {
    return process.env.REACT_APP_SERVER_URL;
  }
  
  // Otherwise, use the current hostname with port 4000
  // This works for both localhost and when accessed from phones
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const serverPort = 4000;
  
  return `${protocol}//${hostname}:${serverPort}`;
};

const SERVER_URL = getServerURL();

console.log("🔌 Connecting to server:", SERVER_URL);

const socket = io(SERVER_URL, {
  transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

export default socket;
