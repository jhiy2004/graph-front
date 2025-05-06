import React, { useEffect, useRef, useState } from "react";
import { Geometry } from "../../utils/geometry.js";

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

function PathCanvas({
  nodes,
  edges,
  highlighted,
}) {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const lastPosRef = useRef({ x: 0, y: 0 });
  const cameraRef = useRef(new Camera(0, 0, 1, 0, 0));

  const SHAPE_SIZES = {
    circle: 50,
    square: 100,
    triangle: 100
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    const resize = () => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        setCanvasSize({ width: rect.width, height: rect.height });
      
        draw(canvas.getContext("2d"));
      };
      

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    draw(ctx);
  }, [nodes, edges, canvasSize]);

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
    const { x, y, number, label, geometry } = node;
    const color = (highlighted.some((elem) => elem === number)) ? '#0E95DD' : '#FFFFFF';

    ctx.save();

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

    for (const edge of edges) {
      const a = nodes[edge.origin];
      const b = nodes[edge.destination];
      if (a && b) connectNodes(ctx, a, b);
    }

    for (const node of nodes) {
      drawGraphNode(ctx, node);
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

  function onMouseDown(e) {
    const pressed = e.button;

    if (pressed === 1) {
      lastPosRef.current.x = e.clientX;
      lastPosRef.current.y = e.clientY;
    }
  }

  function onMouseMove(e) {
    const pressed = e.buttons;

    if (pressed === 4) {
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

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onWheel={onWheel}
    />
  );
}

export default PathCanvas;