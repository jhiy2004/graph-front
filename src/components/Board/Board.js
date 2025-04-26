import React, { useRef, useState, useEffect } from 'react';
import Canvas from '../Canvas/Canvas.js';
import Toolbar from '../Toolbar/Toolbar.js';
import AlgorithmsBar from '../AlgorithmsBar/AlgorithmsBar.js';
import VertexMenu from '../VertexMenu/VertexMenu.js';
import { Modes } from '../../utils/modes.js';

import './Board.css';

function Board({
  nodes,
  edges,
  setShowMatrix,
  addNewEdge,
  addNewNode,
  updateNodePosition,
  updateNodeField
}) {
  const sectionRef = useRef(null);
  const [zoomAction, setZoomAction] = useState(null);

  const [selectedNodeNumber, setSelectedNodeNumber] = useState(null);
  const [activeMode, setActiveMode] = useState(null);
  const [dragPreviewTemplate, setDragPreviewTemplate] = useState(null);
  const [edgeModeNodes, setEdgeModeNodes] = useState({ origin: null });

  const [lastNodeNumber, setLastNodeNumber] = useState(0);

  function handleModeChange(newMode){
    if(activeMode === Modes.EDGE){
      setEdgeModeNodes({ origin: null });
    }

    setActiveMode(newMode === activeMode ? Modes.NONE : newMode);
  }

  useEffect(() => {
    const maxNumber = nodes.reduce((max, node) => Math.max(max, node.number), 0);
    setLastNodeNumber(maxNumber);
  }, []);

  return (
    <section className="d-flex flex-row flex-grow-1 flex-wrap board-container justify-content-start" ref={sectionRef}>
      <div className="z-1 flex-grow-0 mt-1 ms-1">
        <Toolbar setZoomAction={setZoomAction}
          activeMode={activeMode}
          handleModeChange={handleModeChange}
          setDragPreviewTemplate={setDragPreviewTemplate}
          lastNodeNumber={lastNodeNumber}
        />
      </div>
      <Canvas 
        nodes={nodes}
        edges={edges}
        selectedNodeNumber={selectedNodeNumber}
        setSelectedNodeNumber={setSelectedNodeNumber}
        zoomAction={zoomAction}
        setZoomAction={setZoomAction}
        activeMode={activeMode}
        dragPreviewTemplate={dragPreviewTemplate}
        setDragPreviewTemplate={setDragPreviewTemplate}
        lastNodeNumber={lastNodeNumber}
        setLastNodeNumber={setLastNodeNumber}
        edgeModeNodes={edgeModeNodes}
        setEdgeModeNodes={setEdgeModeNodes}
        addNewEdge={addNewEdge}
        addNewNode={addNewNode}
        updateNodePosition={updateNodePosition}
      />
      {selectedNodeNumber !== null && (
        <div className="z-1 ms-auto me-1 mt-1">
          <VertexMenu
            nodes={nodes}
            selectedNodeNumber={selectedNodeNumber}
            updateNodeField={updateNodeField}
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