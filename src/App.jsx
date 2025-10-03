import React from "react";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="app-container">
      <h1>Tiktak Colors</h1>
      <Outlet />
    </div>
  );
}
