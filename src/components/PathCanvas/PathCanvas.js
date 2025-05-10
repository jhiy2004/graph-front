import React, { useEffect, useRef, useState } from "react";
import { Camera } from "../../utils/camera.js";
import { screenToCanvas } from "../../utils/canvasUtils.js";
import { drawGraphNode, connectNodes } from "../../utils/nodeUtils.js";

function PathCanvas({
  nodes,
  edges,
  highlighted,
}) {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const lastPosRef = useRef({ x: 0, y: 0 });
  const cameraRef = useRef(new Camera(0, 0, 5));

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

    for (const edge of edges) {
      const a = nodes[edge.origin];
      const b = nodes[edge.destination];
      if (a && b) connectNodes(ctx, a, b);
    }

    for (const node of nodes) {
      drawGraphNode(ctx, node, false, false, false, highlighted);
    }

    ctx.restore();
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

    const cam = cameraRef.current;
    const before = screenToCanvas(mouseX, mouseY, canvasSize, cam);
    direction > 0 ? cam.zoomOut(zoomFactor) : cam.zoomIn(zoomFactor);
    const after = screenToCanvas(mouseX, mouseY, canvasSize, cam);

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