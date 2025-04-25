import React, { useRef, useState } from 'react';
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
  selectedNodeId,
  setSelectedNodeId,
  setShowMatrix
}) {
  const sectionRef = useRef(null);
  const [zoomAction, setZoomAction] = useState(null);
  const [dragMode, setDragMode] = useState(false);

  return (
    <section className="d-flex flex-row flex-grow-1 flex-wrap board-container justify-content-start" ref={sectionRef}>
      <div className="z-1 flex-grow-0 mt-1 ms-1">
        <Toolbar setZoomAction={setZoomAction}
          dragMode={dragMode}
          setDragMode={setDragMode}
        />
      </div>
      <Canvas 
        nodes={nodes}
        setNodes={setNodes}
        edges={edges}
        setEdges={setEdges}
        selectedNodeId={selectedNodeId}
        setSelectedNodeId={setSelectedNodeId}
        zoomAction={zoomAction}
        setZoomAction={setZoomAction}
        dragMode={dragMode}
      />
      {selectedNodeId && (
        <div className="z-1 ms-auto me-1 mt-1">
          <VertexMenu
            nodes={nodes}
            selectedNodeId={selectedNodeId}
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

