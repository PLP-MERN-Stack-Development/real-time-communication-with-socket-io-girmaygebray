// client/src/App.jsx

import React, { useState } from 'react';
import Chat from './Chat';

function App() {
  const [username, setUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setLoggedIn(true);
    }
  };

  if (loggedIn) {
    return <Chat username={username} />;
  }

  return (
    <div className="login-container">
      <h1>Enter Chat</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">Join Chat</button>
      </form>
    </div>
  );
}

export default App;