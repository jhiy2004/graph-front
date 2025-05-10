import React, { useEffect, useRef, useState } from "react";
import { Camera } from "../../utils/camera.js";
import { drawGraphNode, connectNodes } from "../../utils/nodeUtils.js";
import { drawCenterCross, drawGrid } from "../../utils/canvasUtils.js";
import { screenToCanvas, isMouseOverNode, isMouseOverSomeEdge, isMouseOverSomeNode } from "../../utils/canvasUtils.js";

import { Modes } from "../../utils/modes.js";

function Canvas({
  canvasRef,
  isExporting,
  className,
  nodes,
  edges,
  selectedNodeNumber,
  setSelectedNodeNumber,
  zoomAction,
  setZoomAction,
  activeMode,
  dragPreviewTemplate,
  setDragPreviewTemplate,
  lastNodeNumber,
  setLastNodeNumber,
  edgeModeNodes,
  setEdgeModeNodes,
  addNewEdge,
  addNewNode,
  updateNodePosition
}) {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [dragPreviewNode, setDragPreviewNode] = useState(null);

  const cameraRef = useRef(new Camera(0, 0, 5));
  const draggingNodeRef = useRef(null);
  const lastPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      setCanvasSize({ width, height });

      draw(canvas.getContext("2d"));
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    draw(ctx);
  }, [selectedNodeNumber, nodes, edges, dragPreviewNode, edgeModeNodes, canvasSize, isExporting]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    const camera = cameraRef.current;

    if(zoomAction === 'zoomIn'){
      camera.zoomIn(1.1);
    }else if(zoomAction === 'zoomOut'){
      camera.zoomOut(1.1);
    }
    setZoomAction(null);
    draw(ctx);
  }, [zoomAction]);

  function draw(ctx) {
    const { width, height } = canvasSize;
    const cam = cameraRef.current;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.restore();

    ctx.save();

    ctx.translate(width / 2, height / 2);
    ctx.scale(1, -1);
    ctx.scale(cam.z, cam.z);
    ctx.translate(-cam.x, -cam.y);
    ctx.lineWidth = 0.2;

    drawGrid(ctx, cam, canvasSize.width, canvasSize.height);
    drawCenterCross(ctx, cam);

    for (const edge of edges) {
      const a = nodes[edge.origin];
      const b = nodes[edge.destination];
      if (a && b) connectNodes(ctx, a, b);
    }

    for (const node of nodes) {
      const isSelected = (node.number === selectedNodeNumber);
      const isEdgeOrigin = (node.number === edgeModeNodes.origin?.number);

      drawGraphNode(ctx, node, isSelected, isEdgeOrigin, isExporting);
    }

    if (dragPreviewNode) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      drawGraphNode(ctx, dragPreviewNode);
      ctx.restore();
    }

    ctx.restore();
  }

  function onMouseDown(e) {
    const pressed = e.button;
    const mouse = screenToCanvas(e.nativeEvent.offsetX, e.nativeEvent.offsetY, canvasSize, cameraRef.current);

    if (pressed === 0 && activeMode === Modes.NONE) {
      let found = null;
      for (const node of nodes) {
        if (isMouseOverNode(mouse.x, mouse.y, node)) {
          draggingNodeRef.current = node;
          found = node;
          break;
        }
      }

      setSelectedNodeNumber((!found) ? null : found.number);
    } else if (pressed === 1 || (pressed === 0 && activeMode === Modes.DRAG)) {
      lastPosRef.current.x = e.clientX;
      lastPosRef.current.y = e.clientY;
    } else if (pressed === 0 && activeMode === Modes.EDGE) {
      let found = null;
      for (const node of nodes) {
        if (isMouseOverNode(mouse.x, mouse.y, node)) {
          found = node;
          break;
        }
      }
    
      if (found) {
        if (!edgeModeNodes.origin) {
          setEdgeModeNodes({ origin: found });
        } else {
          const newEdge = {
            id: null,
            weight: 1,
            origin: edgeModeNodes.origin.number,
            destination: found.number,
          };
          addNewEdge(newEdge);
    
          setEdgeModeNodes({ origin: null });
        }
      }
    }
  }

  function onMouseMove(e) {
    const pressed = e.buttons;
    const mouse = screenToCanvas(e.nativeEvent.offsetX, e.nativeEvent.offsetY, canvasSize, cameraRef.current);
    const overNode = isMouseOverSomeNode(mouse.x, mouse.y, nodes);
    const overEdge = isMouseOverSomeEdge(mouse.x, mouse.y, edges, nodes);

    if(activeMode === Modes.DRAG){
      canvasRef.current.style.cursor = "grab";
    }else{
      canvasRef.current.style.cursor = overNode || overEdge ? "pointer" : "default";
    }
    if (pressed === 1 && draggingNodeRef.current && activeMode !== Modes.DRAG) {
      updateNodePosition(draggingNodeRef.current?.number, mouse.x, mouse.y);
    } else if (pressed === 4 || (pressed === 1 && activeMode === Modes.DRAG)) {
      const offsetX = (e.clientX - lastPosRef.current.x) / cameraRef.current.z;
      const offsetY = (e.clientY - lastPosRef.current.y) / cameraRef.current.z;
      lastPosRef.current.x = e.clientX;
      lastPosRef.current.y = e.clientY;

      const cam = cameraRef.current;
      cam.x -= offsetX;
      cam.y += offsetY;

      draw(canvasRef.current.getContext("2d"));
    }
  }

  function onMouseUp() {
    draggingNodeRef.current = null;
  }

  function onWheel(e) {
    const direction = e.deltaY > 0 ? 1 : -1;
    const zoomFactor = 1.1;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const cam = cameraRef.current;
    const before = screenToCanvas(mouseX, mouseY, canvasSize, cam);
    direction > 0 ? cam.zoomOut(zoomFactor) : cam.zoomIn(zoomFactor);
    const after = screenToCanvas(mouseX, mouseY, canvasSize, cam);

    cam.x += before.x - after.x;
    cam.y += before.y - after.y;

    draw(canvasRef.current.getContext("2d"));
  }

  function onDragOver(e){
    e.preventDefault();
    try {
      const mouse = screenToCanvas(e.nativeEvent.offsetX, e.nativeEvent.offsetY, canvasSize, cameraRef.current);

      setDragPreviewNode({
        ...dragPreviewTemplate,
        x: mouse.x,
        y: mouse.y
      });

    } catch (err) {
      console.error("Failed to parse JSON drag data", err);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    if(!dragPreviewTemplate) return;

    const mouse = screenToCanvas(e.nativeEvent.offsetX, e.nativeEvent.offsetY, canvasSize, cameraRef.current);

    setDragPreviewNode({
      ...dragPreviewTemplate,
      x: mouse.x,
      y: mouse.y
    });

    addNewNode(dragPreviewNode);
    setLastNodeNumber(lastNodeNumber + 1);
    setDragPreviewTemplate(null);
    setDragPreviewNode(null);
  }

  function onDragLeave(e){
    setDragPreviewNode(null);
  }

  return (
    <canvas
      className={className}
      ref={canvasRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onWheel={onWheel}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    />
  );
}

export default Canvas;