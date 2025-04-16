import React, { useRef } from 'react';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import './Board.css';
import AlgorithmsBar from './AlgorithmsBar';

function Board() {
  const sectionRef = useRef(null);

  return (
    <section className="d-flex flex-column flex-grow-1 board-container justify-content-start" ref={sectionRef}>
      <div className="z-1 flex-grow-0 align-self-start">
        <Toolbar />
      </div>
      <Canvas />
      <div className="z-1 flex-grow-0 mt-auto mx-1 mb-1">
        <AlgorithmsBar/>
      </div>
    </section>
  );
}

export default Board;

