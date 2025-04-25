import React, {useState} from 'react'
import Board from '../components/Board/Board.js'
import GraphHeader from '../components/GraphHeader/GraphHeader.js';
import NavbarGraph from '../components/NavbarGraph/NavbarGraph.js';
import MatrixModal from "../components/MatrixModal/MatrixModal.js";

function DrawScreen() {
  const [logged, setLogged] = useState(true);
  const [nodes, setNodes] = useState([
    { id: 1, label: "A", number: 0, x: -100, y: 50, geometry: 'circle', color: 0xFFFFFF },
    { id: 2, label: "B", number: 1, x: 100, y: -50, geometry: 'square', color: 0xFFFFFF },
    { id: 3, label: "C", number: 2, x: -300, y: -50, geometry: 'triangle', color: 0xFFFFFF },
  ]);
  const [edges, setEdges] = useState([
    { origin: 0, destination: 1 },
    { origin: 2, destination: 0 }
  ]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const [showMatrix, setShowMatrix] = useState(false);

  return(
    <>
      <NavbarGraph 
        logged={logged} 
      />
      <GraphHeader/>
      <Board
        nodes={nodes}
        setNodes={setNodes}
        edges={edges}
        setEdges={setEdges}
        selectedNodeId={selectedNodeId}
        setSelectedNodeId={setSelectedNodeId}
        setShowMatrix={setShowMatrix}
      />

      <MatrixModal
        showMatrix={showMatrix}
        setShowMatrix={setShowMatrix}
      />
    </>
  )
}

export default DrawScreen;
