import React, {useState} from 'react'
import Board from './Board'
import GraphHeader from './GraphHeader';

function DrawScreen() {
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

  return(
    <>
      <GraphHeader/>
      <Board
        nodes={nodes}
        setNodes={setNodes}
        edges={edges}
        setEdges={setEdges}
        selectedNodeId={selectedNodeId}
        setSelectedNodeId={setSelectedNodeId}
      />
    </>
  )
}

export default DrawScreen;
