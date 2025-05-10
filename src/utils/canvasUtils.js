import { SHAPE_SIZES } from "./nodeUtils.js";
import { Geometry } from "../utils/geometry.js";

export function drawCenterCross(ctx, camera) {
    ctx.save();
    const crossSize = 5;

    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 1 / camera.z;
    ctx.scale(1, -1);
    ctx.beginPath();
    ctx.moveTo(-crossSize, 0);
    ctx.lineTo(crossSize, 0);
    ctx.moveTo(0, -crossSize);
    ctx.lineTo(0, crossSize);
    ctx.stroke();
    ctx.restore();
}

export function drawGrid(ctx, camera, width, height) {
    const baseGridSize = 10;
    const zoom = camera.z;

    const left = camera.x - width / 2 / zoom;
    const right = camera.x + width / 2 / zoom;
    const top = camera.y + height / 2 / zoom;
    const bottom = camera.y - height / 2 / zoom;

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

export function screenToCanvas(x, y, canvasSize, camera) {
  const sx = x - canvasSize.width / 2;
  const sy = -(y - canvasSize.height / 2);
  return {
    x: sx / camera.z + camera.x,
    y: sy / camera.z + camera.y,
  };
}

export function isMouseOverCircle(x, y, cx, cy, r) {
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= r * r;
}

export function isMouseOverSquare(x, y, cx, cy, side) {
  return Math.abs(x - cx) < side / 2 && Math.abs(y - cy) < side / 2;
}

export function isMouseOverTriangle(x, y, cx, cy, side) {
  const h = (Math.sqrt(3) * side) / 2;
  const localX = x - cx;
  const localY = y - cy;
  const yMin = -h / 2;
  const yMax = h / 2;
  if (localY < yMin || localY > yMax) return false;
  const slope = h / side;
  return localX >= (localY - yMin) / -slope && localX <= (localY - yMin) / slope;
}

export function isMouseOverNode(x, y, node) {
  const cx = node.x;
  const cy = node.y;
  const geometry = node.geometry;

  if (geometry === Geometry.CIRCLE) {
    return isMouseOverCircle(x, y, cx, cy, SHAPE_SIZES.circle);
  } else if (geometry === Geometry.SQUARE) {
    return isMouseOverSquare(x, y, cx, cy, SHAPE_SIZES.square);
  } else if (geometry === Geometry.TRIANGLE) {
    return isMouseOverTriangle(x, y, cx, cy, SHAPE_SIZES.triangle);
  }
  return false;
}

export function isMouseOverSomeNode(x, y, nodes) {
    return nodes.some(node => isMouseOverNode(x, y, node));
}

export function isMouseOverEdge(x, y, edge, nodes) {
  const a = nodes.find(n => n.number === edge.origin);
  const b = nodes.find(n => n.number === edge.destination);
  if (!a || !b) return false;

  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return false;

  const ux = dx / len;
  const uy = dy / len;
  const px = x - a.x;
  const py = y - a.y;
  const proj = px * ux + py * uy;

  if (proj < 0 || proj > len) return false;

  const closestX = a.x + ux * proj;
  const closestY = a.y + uy * proj;
  const distSq = (x - closestX) ** 2 + (y - closestY) ** 2;

  return distSq <= 100;
}

export function isMouseOverSomeEdge(x, y, edges, nodes){
  return edges.some(edge => isMouseOverEdge(x, y, edge, nodes));
}