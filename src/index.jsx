import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import "./styles.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Lobby />} />
        <Route path="game/:gameId" element={<Game />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

// Register service worker for PWA functionality
serviceWorkerRegistration.register();
