import React from 'react';
import './App.css';
import Puzzle from './components/Puzzle'
import { getRandomGoal } from './lib/puzzleGoals';

function App() {
  return (
    <div className="App height100">
      {/* <header className="App-header">
        Chozolingo
      </header> */}
      <div className="main-body height100">
        <div className="puzzle-container">
          <Puzzle goal={getRandomGoal()} />
        </div>
      </div>
    </div>
  );
}

export default App;
