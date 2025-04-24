import React,{useState} from 'react';
import Stack from 'react-bootstrap/Stack';
import Button from "react-bootstrap/Button";
import MatrixModal from "./MatrixModal";
import './AlgorithmsBar.css';

function AlgorithmsBar(){
  const [showMatrix, setShowMatrix] = useState(false);

  return (
    <Stack direction='horizontal' gap={1} className="p-1 rounded-3 algorithm-bar">
      <Button variant="light" className="fw-bold" onClick={() => setShowMatrix(true)}>Matriz</Button>
      <Button variant="light" className="fw-bold">Lista</Button>
      <Button variant="light" className="fw-bold">Pilha</Button>
      <Button variant="light" className="fw-bold">Fila</Button>
      <Button variant="light" className="fw-bold">Dijkstra</Button>

      <MatrixModal
        showMatrix={showMatrix}
        setShowMatrix={setShowMatrix}
      />
    </Stack>
  );
}

export default AlgorithmsBar;