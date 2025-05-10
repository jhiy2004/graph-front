import { Geometry } from "../utils/geometry";

export const SHAPE_SIZES = {
  circle: 10,
  square: 20,
  triangle: 20,
};

export function strokeCircleCenter(ctx, x, y, color, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
}

export function strokeSquareCenter(ctx, x, y, color, side) {
  const newX = x - side / 2;
  const newY = y - side / 2;
  ctx.fillStyle = color;
  ctx.fillRect(newX, newY, side, side);
  ctx.strokeRect(newX, newY, side, side);
}

export function strokeTriangleCenter(ctx, x, y, color, side) {
  const height = (Math.sqrt(3) * side) / 2;
  const points = {
    left: { x: x - side / 2, y: y - height / 2 },
    upper: { x: x, y: y + height / 2 },
    right: { x: x + side / 2, y: y - height / 2 }
  };
  ctx.beginPath();
  ctx.moveTo(points.left.x, points.left.y);
  ctx.lineTo(points.upper.x, points.upper.y);
  ctx.lineTo(points.right.x, points.right.y);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
}

export function drawGraphNode(ctx, node, isSelected, isEdgeOrigin, isExporting) {
  const { x, y, color, label, geometry } = node;

  ctx.save();
  if (isSelected && !isExporting) {
    ctx.strokeStyle = "#0E95DD";
    ctx.lineWidth = 1;
  }

  if(isEdgeOrigin && !isExporting) {
    ctx.strokeStyle = "#27AE60";
    ctx.lineWidth = 1;
  }

  if (geometry === Geometry.CIRCLE) {
    strokeCircleCenter(ctx, x, y, color, SHAPE_SIZES.circle);
  } else if (geometry === Geometry.SQUARE) {
    strokeSquareCenter(ctx, x, y, color, SHAPE_SIZES.square);
  } else if (geometry === Geometry.TRIANGLE) {
    strokeTriangleCenter(ctx, x, y, color, SHAPE_SIZES.triangle);
  }
  ctx.restore();

  ctx.save();
  ctx.scale(1, -1);
  ctx.font = "6px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const verticalAdjust = geometry === Geometry.TRIANGLE ? SHAPE_SIZES.triangle * 0.1 : 0;
  ctx.fillText(label, x, -y + verticalAdjust);
  ctx.restore();
}

export function connectNodes(ctx, a, b) {
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}