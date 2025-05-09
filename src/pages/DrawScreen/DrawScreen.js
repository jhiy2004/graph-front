import React, {useState, useRef} from 'react'

import Board from '../../components/Board/Board.js'
import GraphHeader from '../../components/GraphHeader/GraphHeader.js';
import NavbarGraph from '../../components/NavbarGraph/NavbarGraph.js';
import MatrixModal from "../../components/MatrixModal/MatrixModal.js";
import PathModal from '../../components/PathModal/PathModal.js';

import { Algorithms } from '../../utils/algorithms.js';

function DrawScreen() {
  const [logged, setLogged] = useState(true);

  const canvasRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const [nodes, setNodes] = useState([
    { id: 1, label: "A", number: 0, x: -20, y: 10, geometry: 'circle', color: "#FFFFFF" },
    { id: 2, label: "B", number: 1, x: 20, y: -10, geometry: 'square', color: "#FFFFFF" },
    { id: 3, label: "C", number: 2, x: -60, y: -10, geometry: 'triangle', color: "#FFFFFF" },
  ]);
  const [edges, setEdges] = useState([
    { id: 1, weight: 1, origin: 0, destination: 1 },
    { id: 2, weight: 1, origin: 2, destination: 0 }
  ]);

  const [showMatrix, setShowMatrix] = useState(false);
  const [activeAlgorithm, setActiveAlgorithm] = useState(Algorithms.NONE);

  function addNewNode(newNode){
    setNodes(prev => [...prev, newNode]);
  }

  function addNewEdge(newEdge) {
    const exists = edges.some(edge =>
      (newEdge.origin === edge.origin && newEdge.destination === edge.destination) ||
      (newEdge.origin === edge.destination && newEdge.destination === edge.origin)
    );
  
    if (!exists) {
      setEdges([...edges, newEdge]);
    }
  }

  function updateNodePosition(nodeNumber, x, y){
      setNodes(prev =>
        prev.map(node =>
          node.number === nodeNumber
            ? { ...node, x: x, y: y }
            : node
        )
      );
  }

  function updateNodeField(field, value, nodeNumber) {
    setNodes(prevNodes =>
      prevNodes.map(node => {
        if (node.number === nodeNumber) {
          if (['x', 'y', 'number'].includes(field)) {
            if (value === '' || value === '-' || value === '+') {
              return { ...node, [field]: value };
            }
  
            const parsed = Number(value);
            if (!Number.isNaN(parsed) && Number.isInteger(parsed)) {
              return { ...node, [field]: parsed };
            }
  
            return node;
          }
  
          return { ...node, [field]: value };
        }
        return node;
      })
    );
  }

  function exportPNG() {
    if (!canvasRef || !canvasRef.current) return;

    setIsExporting(true);

    const originalCanvas = canvasRef.current;
    const tempCanvas = document.createElement("canvas");
    const ctx = tempCanvas.getContext("2d");

    tempCanvas.width = originalCanvas.width;
    tempCanvas.height = originalCanvas.height;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    requestAnimationFrame(() => {
      ctx.drawImage(originalCanvas, 0, 0);

      const image = tempCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "graph.png";
      link.click();

      setIsExporting(false);
    });
  }

  function exportDOT() {
    alert("clicked on DOT")
  }

  return (
    <>
      <NavbarGraph
        logged={logged}
      />
      <GraphHeader
        exportPNG={exportPNG}
        exportDOT={exportDOT}
      />
      <Board
        canvasRef={canvasRef}
        isExporting={isExporting}
        nodes={nodes}
        edges={edges}
        setShowMatrix={setShowMatrix}
        setActiveAlgorithm={setActiveAlgorithm}
        addNewEdge={addNewEdge}
        addNewNode={addNewNode}
        updateNodePosition={updateNodePosition}
        updateNodeField={updateNodeField}
      />

      <MatrixModal
        showMatrix={showMatrix}
        setShowMatrix={setShowMatrix}
      />

      <PathModal
        activeAlgorithm={activeAlgorithm}
        setActiveAlgorithm={setActiveAlgorithm}
        nodes={nodes}
        edges={edges}
      />
    </>
  )
}

export default DrawScreen;
