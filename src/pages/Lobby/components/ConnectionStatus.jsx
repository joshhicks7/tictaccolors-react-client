import React from 'react';
import './ConnectionStatus.css';

export default function ConnectionStatus({ isConnected }) {
  if (isConnected) return null;

  return (
    <div className="connection-status">
      <span className="connection-status-text">
        ⚠️ Having trouble connecting...
      </span>
    </div>
  );
}

