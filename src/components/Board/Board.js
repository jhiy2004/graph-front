import React, { useRef, useState, useEffect } from 'react';
import Canvas from '../Canvas/Canvas.js';
import Toolbar from '../Toolbar/Toolbar.js';
import AlgorithmsBar from '../AlgorithmsBar/AlgorithmsBar.js';
import VertexMenu from '../VertexMenu/VertexMenu.js';

import './Board.css';

function Board({
  nodes,
  setNodes,
  edges,
  setEdges,
  setShowMatrix
}) {
  const sectionRef = useRef(null);
  const [zoomAction, setZoomAction] = useState(null);

  const [selectedNodeNumber, setSelectedNodeNumber] = useState(null);
  const [dragMode, setDragMode] = useState(false);
  const [dragPreviewNode, setDragPreviewNode] = useState(null);

  const [lastNodeNumber, setLastNodeNumber] = useState(0);

  useEffect(() => {
    const maxNumber = nodes.reduce((max, node) => Math.max(max, node.number), 0);
    setLastNodeNumber(maxNumber);
  }, []);

  return (
    <section className="d-flex flex-row flex-grow-1 flex-wrap board-container justify-content-start" ref={sectionRef}>
      <div className="z-1 flex-grow-0 mt-1 ms-1">
        <Toolbar setZoomAction={setZoomAction}
          dragMode={dragMode}
          setDragMode={setDragMode}
          setDragPreviewNode={setDragPreviewNode}
          lastNodeNumber={lastNodeNumber}
        />
      </div>
      <Canvas 
        nodes={nodes}
        setNodes={setNodes}
        edges={edges}
        setEdges={setEdges}
        selectedNodeNumber={selectedNodeNumber}
        setSelectedNodeNumber={setSelectedNodeNumber}
        zoomAction={zoomAction}
        setZoomAction={setZoomAction}
        dragMode={dragMode}
        dragPreviewNode={dragPreviewNode}
        setDragPreviewNode={setDragPreviewNode}
        lastNodeNumber={lastNodeNumber}
        setLastNodeNumber={setLastNodeNumber}
      />
      {selectedNodeNumber !== null && (
        <div className="z-1 ms-auto me-1 mt-1">
          <VertexMenu
            nodes={nodes}
            selectedNodeNumber={selectedNodeNumber}
            setNodes={setNodes}
          />
        </div>
      )}
      <div className="z-1 flex-grow-1 mx-1 mb-1 align-self-end w-100">
        <AlgorithmsBar
          setShowMatrix={setShowMatrix}
        />
      </div>
    </section>
  );
}

export default Board;

