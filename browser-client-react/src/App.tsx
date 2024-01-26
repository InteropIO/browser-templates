import React from 'react';
import logo from './connect-browser.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://docs.interop.io/browser/getting-started/what-is-io-connect-browser/index.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn io.Connect Browser
        </a>
      </header>
    </div>
  );
}

export default App;
