import React, {useState} from 'react'
import Board from './Board'
import GraphHeader from './GraphHeader';

function DrawScreen() {
  const [nodes, setNodes] = useState([
    { label: "A", number: 0, x: -100, y: 50 },
    { label: "B", number: 1, x: 100, y: -50 },
    { label: "C", number: 2, x: -1000, y: -500 },
  ]);
  const [edges, setEdges] = useState([
    { origin: 0, destination: 1 },
    { origin: 2, destination: 0 }
  ]);
  const [selectedNode, setSelectedNode] = useState(null);

  return(
    <>
      <GraphHeader/>
      <Board
        nodes={nodes}
        setNodes={setNodes}
        edges={edges}
        setEdges={setEdges}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
      />
    </>
  )
}

export default DrawScreen;
