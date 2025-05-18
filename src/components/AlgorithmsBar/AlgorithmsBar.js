import React,{useState} from 'react';
import Stack from 'react-bootstrap/Stack';
import Button from "react-bootstrap/Button";
import './AlgorithmsBar.css';

import { Algorithms } from '../../utils/algorithms.js';

function AlgorithmsBar({ setActiveAlgorithm, getAdjacencyMatrix, getAdjacencyList }){
  return (
    <Stack direction='horizontal' gap={1} className="p-1 rounded-3 algorithm-bar">
      <Button variant="light" className="fw-bold" onClick={() => getAdjacencyMatrix()}>Matriz</Button>
      <Button variant="light" className="fw-bold" onClick={() => getAdjacencyList()}>Lista</Button>
      <Button variant="light" className="fw-bold" onClick={() => setActiveAlgorithm(Algorithms.DFS)}>Pilha</Button>
      <Button variant="light" className="fw-bold" onClick={() => setActiveAlgorithm(Algorithms.BFS)}>Fila</Button>
      <Button variant="light" className="fw-bold" onClick={() => setActiveAlgorithm(Algorithms.DIJKSTRA)}>Dijkstra</Button>
    </Stack>
  );
}

export default AlgorithmsBar;