import React from 'react';
import './App.css';
import Puzzle from './components/Puzzle'
import Translator from './components/Translator'
import { getRandomGoal } from './lib/puzzleGoals';
import { Link, Routes, Route } from "react-router-dom";


function App() {
  return (
    <div className="app height100">
      <header className="app-header">
        Chozolingo
        <nav>
          <Link to="/game">Game</Link>{" | "}
          <Link to="/translator">Translator</Link>
        </nav>
      </header>
      <div className="main-body">
        <div className="puzzle-container">
          <Routes>
            <Route path="/" element={<Puzzle goal={getRandomGoal()} />} />
            <Route path="/game" element={<Puzzle goal={getRandomGoal()} />} />
            <Route path="/translator" element={<Translator/>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
