import React from 'react';
import './App.css';
import Room from './pages/room';

function App() {
  return (
    <div className="App">
      <Room/>
      <br/>
      <a href="https://github.com/ucloud/urtc-sdk-web" target="_blank" rel="noopener noreferrer">
        API 文档请看这里
      </a>
    </div>
  );
}

export default App;
