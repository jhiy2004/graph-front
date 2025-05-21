import React, { useState, useRef, useEffect } from 'react';

import Board from '../../components/Board/Board.js';
import GraphHeader from '../../components/GraphHeader/GraphHeader.js';
import NavbarGraph from '../../components/NavbarGraph/NavbarGraph.js';
import MatrixModal from '../../components/MatrixModal/MatrixModal.js';
import PathModal from '../../components/PathModal/PathModal.js';
import PathInputModal from '../../components/PathInputModal/PathInputModal.js';

import { Algorithms } from '../../utils/algorithms.js';
import { useGraphAPI } from './useGraphAPI.js';

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

  const [lastNodeNumber, setLastNodeNumber] = useState(0);

  const [showMatrix, setShowMatrix] = useState(false);
  const [showPathInputModal, setShowPathInputModal] = useState(false);

  const [activeAlgorithm, setActiveAlgorithm] = useState(Algorithms.NONE);
  const [pathResult, setPathResult] = useState(null);
  const [matrix, setMatrix] = useState(null);

  const { fetchAdjacencyMatrix, fetchAdjacencyList, fetchPath, fetchDOT, updateGraph } = useGraphAPI(process.env.REACT_APP_API_URL);

  function addNewNode(newNode) {
    setNodes(prev => {
      const updated = [...prev, newNode];
      const maxNumber = updated.reduce((max, node) => Math.max(max, node.number), 0);
      setLastNodeNumber(maxNumber);
      return updated;
    });
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
          ? { ...node, x, y }
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
    if (isExporting) return;

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

  async function exportDOT() {
    try {
      const data = await fetchDOT(edges, nodes.length);
      if (data.message) return;

      const blob = new Blob([data.dot], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "graph.dot";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (e) {
      console.error("Error generating DOT file:", e);
      alert("Erro ao gerar arquivo DOT.");
    }
  }

  async function handleSave() {
    if (!logged) return;

    const token = 'Bearer token';
    const graph_id = 1;

    try{
      const data = await updateGraph(nodes, edges, token, graph_id);
      if (data.message) return;

      setNodes(data.vertices);
      setEdges(data.edges);
    } catch (e) {
      alert("Erro ao salvar o grafo");
    }
  }

  async function handleRunAlgorithm(source, destination) {
    try {
      const data = await fetchPath(edges, nodes.length, source, destination, activeAlgorithm, 'matrix');
      setPathResult(data);
    } catch (e) {
      alert("Erro ao buscar caminho.");
      setPathResult(null);
      setActiveAlgorithm(Algorithms.NONE);
    }
  }

  async function getAdjacencyMatrix() {
    try {
      const data = await fetchAdjacencyMatrix(edges, nodes.length);
      setMatrix(data.graph);
    } catch (e) {
      alert("Erro ao buscar matriz de adjacência.");
      setMatrix([[]]);
    }

    setShowMatrix(true);
  }

  async function getAdjacencyList() {
    try {
      const data = await fetchAdjacencyList(edges, nodes.length);
      console.log(data);
    } catch (e) {
      alert("Erro ao buscar lista de adjacência.");
    }
  }

  function handleInputAlgorithm(algorithm) {
    setActiveAlgorithm(algorithm);
    setShowPathInputModal(true); // show modal only
  }

  function handleInputSubmit(src, dst) {
    const source = parseInt(src);
    const destination = parseInt(dst);
    const valid = nodes.some(n => n.number === source) && nodes.some(n => n.number === destination);

    if (!valid || isNaN(source) || isNaN(destination)) {
      alert("Origem ou destino inválido.");
      return;
    }

    setShowPathInputModal(false);
    handleRunAlgorithm(source, destination);
  }


  useEffect(() => {
    const maxNumber = nodes.reduce((max, node) => Math.max(max, node.number), 0);
    setLastNodeNumber(maxNumber);
  }, [])

  return (
    <>
      <NavbarGraph logged={logged} />
      <GraphHeader exportPNG={exportPNG} exportDOT={exportDOT} handleSave={handleSave} />
      <Board
        canvasRef={canvasRef}
        isExporting={isExporting}
        nodes={nodes}
        edges={edges}
        handleInputAlgorithm={handleInputAlgorithm}
        addNewEdge={addNewEdge}
        addNewNode={addNewNode}
        updateNodePosition={updateNodePosition}
        updateNodeField={updateNodeField}
        getAdjacencyMatrix={getAdjacencyMatrix}
        getAdjacencyList={getAdjacencyList}
        lastNodeNumber={lastNodeNumber}
        setLastNodeNumber={setLastNodeNumber}
      />

      <MatrixModal
        showMatrix={showMatrix}
        setShowMatrix={setShowMatrix}
        matrix={matrix}
      />

      <PathInputModal
        nodes={nodes}
        showPathInputModal={showPathInputModal}
        setShowPathInputModal={setShowPathInputModal}
        handleInputSubmit={handleInputSubmit}
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