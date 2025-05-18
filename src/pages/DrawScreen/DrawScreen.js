import React, { useState, useRef } from 'react';

import Board from '../../components/Board/Board.js';
import GraphHeader from '../../components/GraphHeader/GraphHeader.js';
import NavbarGraph from '../../components/NavbarGraph/NavbarGraph.js';
import MatrixModal from '../../components/MatrixModal/MatrixModal.js';
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
  const [pathResult, setPathResult] = useState(null);
  const [matrix, setMatrix] = useState(null);

  function addNewNode(newNode) {
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

  function updateNodePosition(nodeNumber, x, y) {
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

  function save() {
    if (!logged) return;

    const apiUrl = process.env.REACT_APP_API_URL;
    const token = 'Bearer token';
    const graph_id = 1;

    fetch(`${apiUrl}/graphs/update/${graph_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({
        vertices: nodes,
        edges: edges
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) return;
        setNodes(data.vertices);
        setEdges(data.edges);
      })
      .catch(() => {
        alert("ERROR");
      });
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
    alert("clicked on DOT");
  }

  async function handleRunAlgorithm(algorithm) {
    setActiveAlgorithm(algorithm);

    const apiUrl = process.env.REACT_APP_API_URL;
    const apiEdges = edges.map(edge => [edge.origin, edge.destination, edge.weight]);

    const graph = {
      edges: apiEdges,
      n: nodes.length,
      source: 0,
      destination: 2
    };

    try {
      const res = await fetch(`${apiUrl}/graphs/${algorithm}/matrix`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(graph)
      });
      const data = await res.json();
      setPathResult(data);
    } catch (e) {
      alert("Erro ao buscar caminho.");
      setPathResult(null);
      setActiveAlgorithm(Algorithms.NONE);
    }
  }

  async function getAdjacencyMatrix(){
    const apiEdges = edges.map(edge => [edge.origin, edge.destination, edge.weight]);
    const apiUrl = process.env.REACT_APP_API_URL;

    const graph = {
      edges: apiEdges,
      n: nodes.length
    }

    try {
      const res = await fetch(`${apiUrl}/graphs/matrix`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(graph)
      })
      const data = await res.json();
      setMatrix(data.graph);
      console.log(data);
    } catch (e) {
      alert("Erro ao buscar matriz de adjacência.");
      setMatrix([[]]);
    }

    setShowMatrix(true)
  }

  async function getAdjacencyList(){
    const apiEdges = edges.map(edge => [edge.origin, edge.destination, edge.weight]);
    const apiUrl = process.env.REACT_APP_API_URL;

    const graph = {
      edges: apiEdges,
      n: nodes.length
    }

    try {
      const res = await fetch(`${apiUrl}/graphs/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(graph)
      })
      const data = await res.json();
      console.log(data);
    } catch (e) {
      alert("Erro ao buscar lista de adjacência.");
    }
  }

  return (
    <>
      <NavbarGraph logged={logged} />
      <GraphHeader exportPNG={exportPNG} exportDOT={exportDOT} save={save} />
      <Board
        canvasRef={canvasRef}
        isExporting={isExporting}
        nodes={nodes}
        edges={edges}
        setActiveAlgorithm={handleRunAlgorithm}
        addNewEdge={addNewEdge}
        addNewNode={addNewNode}
        updateNodePosition={updateNodePosition}
        updateNodeField={updateNodeField}
        getAdjacencyMatrix={getAdjacencyMatrix}
        getAdjacencyList={getAdjacencyList}
      />

      <MatrixModal
        showMatrix={showMatrix}
        setShowMatrix={setShowMatrix}
        matrix={matrix}
      />

      {activeAlgorithm !== Algorithms.NONE && pathResult && (
        <PathModal
          activeAlgorithm={activeAlgorithm}
          setActiveAlgorithm={(alg) => {
            setActiveAlgorithm(alg);
            setPathResult(null);
          }}
          nodes={nodes}
          edges={edges}
          path={pathResult.path}
          cost={pathResult.cost}
        />
      )}
    </>
  );
}

export default DrawScreen;
