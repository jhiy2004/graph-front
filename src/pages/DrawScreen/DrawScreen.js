import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router";

import Board from "../../components/Board/Board.js";
import GraphHeader from "../../components/GraphHeader/GraphHeader.js";
import NavbarGraph from "../../components/NavbarGraph/NavbarGraph.js";
import MatrixModal from "../../components/MatrixModal/MatrixModal.js";
import AdjListModal from "../../components/AdjListModal/AdjListModal.js";
import PathModal from "../../components/PathModal/PathModal.js";
import PathInputModal from "../../components/PathInputModal/PathInputModal.js";

import { Algorithms } from "../../utils/algorithms.js";
import { useGraphAPI } from "../../hooks/useGraphAPI.js";

function DrawScreen() {
  const [logged, setLogged] = useState(true);
  const canvasRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const { graph_id } = useParams();

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const [lastNodeNumber, setLastNodeNumber] = useState(0);

  const [showMatrix, setShowMatrix] = useState(false);
  const [showAdjList, setShowAdjList] = useState(false);
  const [showPathInputModal, setShowPathInputModal] = useState(false);
  const [activeAlgorithm, setActiveAlgorithm] = useState(Algorithms.NONE);
  const [pathResult, setPathResult] = useState(null);
  const [matrix, setMatrix] = useState(null);
  const [list, setList] = useState(null);

  const {
    fetchAdjacencyMatrix,
    fetchAdjacencyList,
    fetchPath,
    fetchDOT,
    updateGraph,
    fetchGraph,
  } = useGraphAPI(process.env.REACT_APP_API_URL);

  function addNewNode(newNode) {
    setNodes((prev) => {
      const updated = [...prev, newNode];
      const maxNumber = updated.reduce(
        (max, node) => Math.max(max, node.number),
        0,
      );
      setLastNodeNumber(maxNumber);
      return updated;
    });
  }

  function addNewEdge(newEdge) {
    const exists = edges.some(
      (edge) =>
        (newEdge.origin === edge.origin &&
          newEdge.destination === edge.destination) ||
        (newEdge.origin === edge.destination &&
          newEdge.destination === edge.origin),
    );

    if (!exists) {
      setEdges([...edges, newEdge]);
    }
  }

  function updateNodePosition(nodeNumber, x, y) {
    setNodes((prev) =>
      prev.map((node) =>
        node.number === nodeNumber ? { ...node, x, y } : node,
      ),
    );
  }

  function updateNodeField(field, value, nodeNumber) {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.number === nodeNumber) {
          if (["x", "y", "number"].includes(field)) {
            if (value === "" || value === "-" || value === "+") {
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
      }),
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

      const blob = new Blob([data.dot], { type: "text/plain;charset=utf-8" });
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

    const token = "Bearer token";

    try {
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
      const data = await fetchPath(
        edges,
        nodes.length,
        source,
        destination,
        activeAlgorithm,
        "matrix",
      );
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
      setList(data.graph);
    } catch (e) {
      alert("Erro ao buscar lista de adjacência.");
      setList([]);
    }

    setShowAdjList(true);
  }

  function handleInputAlgorithm(algorithm) {
    setActiveAlgorithm(algorithm);
    setShowPathInputModal(true); // show modal only
  }

  function handleInputSubmit(src, dst) {
    const source = parseInt(src);
    const destination = parseInt(dst);
    const valid =
      nodes.some((n) => n.number === source) &&
      nodes.some((n) => n.number === destination);

    if (!valid || isNaN(source) || isNaN(destination)) {
      alert("Origem ou destino inválido.");
      return;
    }

    setShowPathInputModal(false);
    handleRunAlgorithm(source, destination);
  }

  useEffect(() => {
    if (!logged) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Usuário não autenticado.");
      return;
    }

    fetchGraph(graph_id, token)
      .then((data) => {
        setNodes(data.vertices);

        const idToNumber = new Map(data.vertices.map((v) => [v.id, v.number]));

        const remappedEdges = data.edges.map((edge) => ({
          ...edge,
          origin: idToNumber.get(edge.origin),
          destination: idToNumber.get(edge.destination),
        }));

        setEdges(remappedEdges);

        const maxNumber = data.vertices.reduce(
          (max, node) => Math.max(max, node.number),
          0
        );
        setLastNodeNumber(maxNumber);
      })
      .catch(() => alert("Erro ao carregar o grafo."));
  }, [graph_id, logged]);

  return (
    <>
      <div className="vh-100 d-flex flex-column">
        <NavbarGraph logged={logged} />
        <GraphHeader
          exportPNG={exportPNG}
          exportDOT={exportDOT}
          handleSave={handleSave}
        />
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
      </div>

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
      <AdjListModal
        showAdjList={showAdjList}
        setShowAdjList={setShowAdjList}
        adjacencyList={list}
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
