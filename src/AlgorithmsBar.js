import React from 'react';
import Stack from 'react-bootstrap/Stack';
import Button from "react-bootstrap/Button";
import './AlgorithmsBar.css';

function AlgorithmsBar(){

  return (
    <Stack direction='horizontal' gap={1} className="p-1 rounded-3 algorithm-bar">
      <Button variant="light" className="fw-bold">Matriz</Button>
      <Button variant="light" className="fw-bold">Lista</Button>
      <Button variant="light" className="fw-bold">Pilha</Button>
      <Button variant="light" className="fw-bold">Fila</Button>
      <Button variant="light" className="fw-bold">Dijkstra</Button>
    </Stack>
  );
}

export default AlgorithmsBar;
