import React, { useEffect, useRef, useState } from "react";
import { Geometry } from "../../utils/geometry.js";
import { Modes } from "../../utils/modes.js";

class Camera {
  x;
  y;
  z;

  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  moveLeft(offset) { this.x += offset; }
  moveRight(offset) { this.x -= offset; }
  moveUp(offset) { this.y -= offset; }
  moveDown(offset) { this.y += offset; }

  zoomIn(factor) { this.z *= factor; }
  zoomOut(factor) { this.z /= factor; }
}

function Canvas({
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
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [dragPreviewNode, setDragPreviewNode] = useState(null);

  const cameraRef = useRef(new Camera(0, 0, 1, 0, 0));
  const draggingNodeRef = useRef(null);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const SHAPE_SIZES = {
    circle: 50,
    square: 100,
    triangle: 100
  };

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
  }, [selectedNodeNumber, nodes, edges, dragPreviewNode, edgeModeNodes, canvasSize]);

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

  function drawCenterCross(ctx) {
    ctx.save();
    const crossSize = 25;

    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 1 / cameraRef.current.z;
    ctx.scale(1, -1);
    ctx.beginPath();
    ctx.moveTo(-crossSize, 0);
    ctx.lineTo(crossSize, 0);
    ctx.moveTo(0, -crossSize);
    ctx.lineTo(0, crossSize);
    ctx.stroke();
    ctx.restore();
  }

  function drawGrid(ctx) {
    const camera = cameraRef.current;
    const baseGridSize = 50;
    const zoom = camera.z;

    const left = camera.x - canvasSize.width / 2 / zoom;
    const right = camera.x + canvasSize.width / 2 / zoom;
    const top = camera.y + canvasSize.height / 2 / zoom;
    const bottom = camera.y - canvasSize.height / 2 / zoom;

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1 / zoom;

    let startX = Math.floor(left / baseGridSize) * baseGridSize;
    for (let x = startX; x < right; x += baseGridSize) {
      ctx.moveTo(x, bottom);
      ctx.lineTo(x, top);
    }

    let startY = Math.floor(bottom / baseGridSize) * baseGridSize;
    for (let y = startY; y < top; y += baseGridSize) {
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
    }

    ctx.stroke();
    ctx.restore();
  }

  function strokeSquareCenter(ctx, x, y, color, side){
    ctx.save();

    ctx.fillStyle = color;

    const newX = x - side/2;
    const newY = y - side/2;

    ctx.fillRect(newX, newY, side, side);
    ctx.strokeRect(newX, newY, side, side);

    ctx.restore();
  }

  function strokeTriangleCenter(ctx, x, y, color, side){
    ctx.save();

    ctx.fillStyle = color;

    const height = (Math.sqrt(3) * side) / 2;
    const points = {
      left: {
        x: x - side/2,
        y: y - height/2
      },
      upper: {
        x: x,
        y: y + height/2
      },

      right: {
        x: x + side/2,
        y: y - height/2
      }
    }

    ctx.beginPath();
    ctx.moveTo(points.left.x, points.left.y);
    ctx.lineTo(points.upper.x, points.upper.y);
    ctx.lineTo(points.right.x, points.right.y);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  function strokeCircleCenter(ctx, x, y, color, radius) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  function drawGraphNode(ctx, node) {
    const { x, y, color, label, geometry } = node;

    ctx.save();
    if (selectedNodeNumber === node.number) {
      ctx.strokeStyle = "#0E95DD";
      ctx.lineWidth = 5;
    }
    
    if (edgeModeNodes.origin?.number === node.number) {
      ctx.strokeStyle = "#27AE60";
      ctx.lineWidth = 5;
    }

    // Draw the shape
    if (geometry === Geometry.CIRCLE) {
      strokeCircleCenter(ctx, x, y, color, SHAPE_SIZES.circle);
    } else if (geometry === Geometry.SQUARE) {
      strokeSquareCenter(ctx, x, y, color, SHAPE_SIZES.square);
    } else if (geometry === Geometry.TRIANGLE) {
      strokeTriangleCenter(ctx, x, y, color, SHAPE_SIZES.triangle);
    }
    ctx.restore();

    // Text styling
    ctx.save();
    ctx.scale(1, -1);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Adjust vertical positioning depending on shape
    let verticalAdjust = 0;
    if (geometry === Geometry.TRIANGLE) {
      verticalAdjust = SHAPE_SIZES.triangle * 0.1; // nudge upward for triangle
    }

    ctx.fillText(label, x, -y + verticalAdjust);
    ctx.restore();
  }

  function connectNodes(ctx, a, b) {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

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
    ctx.font = "24px serif";

    drawGrid(ctx);
    drawCenterCross(ctx);

    for (const edge of edges) {
      const a = nodes[edge.origin];
      const b = nodes[edge.destination];
      if (a && b) connectNodes(ctx, a, b);
    }

    for (const node of nodes) {
      drawGraphNode(ctx, node);
    }

    if (dragPreviewNode) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      drawGraphNode(ctx, dragPreviewNode);
      ctx.restore();
    }

    ctx.restore();
  }

  function screenToCanvas(x, y) {
    const cam = cameraRef.current;
    const sx = x - canvasSize.width / 2;
    const sy = -(y - canvasSize.height / 2);
    return {
      x: sx / cam.z + cam.x,
      y: sy / cam.z + cam.y,
    };
  }

  function isMouseOverCircle(mouse, node){
    const dx = mouse.x - node.x;
    const dy = mouse.y - node.y;

    const hip = Math.sqrt(dx ** 2 + dy ** 2);  
    return hip <= SHAPE_SIZES.circle;
  }

  function isMouseOverSquare(mouse, node){
    const dx = mouse.x - node.x;
    const dy = mouse.y - node.y;

    const halfSize = SHAPE_SIZES.square;
    return(
      dx >= -halfSize &&
        dx <= halfSize &&
        dy >= -halfSize &&
        dy <= +halfSize
    );
  }

  function isMouseOverTriangle(mouse, node){
    const dx = mouse.x - node.x;
    const dy = mouse.y - node.y;

    const size = SHAPE_SIZES.triangle;
    const height = (Math.sqrt(3) / 2) * size;
    const halfSize = size / 2;

    if(
      dx >= -halfSize &&
        dx <= halfSize &&
        dy >= -height/2 &&
        dy <= height/2
    ){
      const yFromTop = dy + height / 2;
      const maxY = Math.sqrt(3) * (halfSize - Math.abs(dx));

      return yFromTop <= maxY;}
  }

  function isMouseOverNode(mouse, node) {
    if(node.geometry === Geometry.CIRCLE){
      return isMouseOverCircle(mouse, node);
    }else if(node.geometry === Geometry.SQUARE){
      return isMouseOverSquare(mouse, node);
    }else if (node.geometry === Geometry.TRIANGLE) {
      return isMouseOverTriangle(mouse, node);
    }
  }

  function isMouseOverSomeNode(mouse) {
    return nodes.some(node => isMouseOverNode(mouse, node));
  }

  function isMouseOverEdge(mouse) {
    for (const edge of edges) {
      const a = nodes[edge.origin];
      const b = nodes[edge.destination];
      if (!a || !b) continue;

      const abx = b.x - a.x;
      const aby = b.y - a.y;
      const abLength = Math.sqrt(abx ** 2 + aby ** 2);
      const apx = mouse.x - a.x;
      const apy = mouse.y - a.y;

      const proj = (apx * abx + apy * aby) / abLength;
      if (proj < 0 || proj > abLength) continue;

      const cx = a.x + (proj / abLength) * abx;
      const cy = a.y + (proj / abLength) * aby;
      const distSq = (cx - mouse.x) ** 2 + (cy - mouse.y) ** 2;
      if (distSq <= 10 ** 2) return true;
    }

    return false;
  }

  function onMouseDown(e) {
    const pressed = e.button;
    const mouse = screenToCanvas(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

    if (pressed === 0 && activeMode === Modes.NONE) {
      let found = null;
      for (const node of nodes) {
        if (isMouseOverNode(mouse, node)) {
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
        if (isMouseOverNode(mouse, node)) {
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
    const mouse = screenToCanvas(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    const overNode = isMouseOverSomeNode(mouse);
    const overEdge = isMouseOverEdge(mouse);

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

    const before = screenToCanvas(mouseX, mouseY);
    const cam = cameraRef.current;
    direction > 0 ? cam.zoomOut(zoomFactor) : cam.zoomIn(zoomFactor);
    const after = screenToCanvas(mouseX, mouseY);

    cam.x += before.x - after.x;
    cam.y += before.y - after.y;

    draw(canvasRef.current.getContext("2d"));
  }

  function onDragOver(e){
    e.preventDefault();
    try {
      const mouse = screenToCanvas(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

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

    const mouse = screenToCanvas(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

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