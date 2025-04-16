import React, { useEffect, useRef, useState } from "react";

class Camera {
    x;
    y;
    z;
    width;
    height;

    constructor(x, y, z, width, height) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
    }

    moveLeft(offset) { this.x += offset; }
    moveRight(offset) { this.x -= offset; }
    moveUp(offset) { this.y -= offset; }
    moveDown(offset) { this.y += offset; }

    zoomIn(factor) { this.z *= factor; }
    zoomOut(factor) { this.z /= factor; }
}

function Canvas() {
    const canvasRef = useRef(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [nodes, setNodes] = useState([
        { label: "A", number: 0, x: -100, y: 50 },
        { label: "B", number: 1, x: 100, y: -50 },
        { label: "C", number: 2, x: -1000, y: -500 },
    ]);
    const [edges, setEdges] = useState([
        { origin: 0, destination: 1 },
        { origin: 2, destination: 0 }
    ]);

    const cameraRef = useRef(new Camera(0, 0, 1, 0, 0));
    const draggingNodeRef = useRef(null);
    const lastPosRef = useRef({ x: 0, y: 0 });
    const [selectedNode, setSelectedNode] = useState(null);

    const radius = 50;

    useEffect(() => {
        const canvas = canvasRef.current;

        const resize = () => {
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;
            setCanvasSize({ width, height });

            const cam = cameraRef.current;
            cam.width = width;
            cam.height = height;

            draw(canvas.getContext("2d"));
        };

        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");
        draw(ctx);
    }, [selectedNode, nodes, edges, canvasSize]);

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

    function strokeCircleCenter(ctx, x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    function drawGraphNode(ctx, node) {
        const { x, y, label } = node;

        ctx.save();
        if (
            selectedNode?.label === label &&
            selectedNode?.number === node.number
        ) {
            ctx.strokeStyle = "#0E95DD";
            ctx.lineWidth = 5;
        }

        strokeCircleCenter(ctx, x, y, radius);
        ctx.restore();

        ctx.save();
        ctx.scale(1, -1);
        const textMetrics = ctx.measureText(label);
        const textWidth = textMetrics.width;
        const ascent = textMetrics.actualBoundingBoxAscent;
        const descent = textMetrics.actualBoundingBoxDescent;
        const textHeight = ascent + descent;
        ctx.fillText(label, x - textWidth / 2, -y + textHeight / 2 - descent);
        ctx.restore();
    }

    function connectNodes(ctx, a, b) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / dist;
        const uy = dy / dist;

        const startX = a.x + ux * radius;
        const startY = a.y + uy * radius;
        const endX = b.x - ux * radius;
        const endY = b.y - uy * radius;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
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

    function isMouseOverNode(mouse) {
        return nodes.some(node => {
            const dx = mouse.x - node.x;
            const dy = mouse.y - node.y;
            return dx ** 2 + dy ** 2 <= radius ** 2;
        });
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

        if (pressed === 0) {
            let found = null;
            for (const node of nodes) {
                const dx = mouse.x - node.x;
                const dy = mouse.y - node.y;
                if (dx ** 2 + dy ** 2 <= radius ** 2) {
                    draggingNodeRef.current = node;
                    found = node;
                    break;
                }
            }
            setSelectedNode(found);
        } else if (pressed === 1) {
            lastPosRef.current.x = e.clientX;
            lastPosRef.current.y = e.clientY;
        }
    }

    function onMouseMove(e) {
        const pressed = e.buttons;
        const mouse = screenToCanvas(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        const overNode = isMouseOverNode(mouse);
        const overEdge = isMouseOverEdge(mouse);

        canvasRef.current.style.cursor = overNode || overEdge ? "pointer" : "default";

        if (pressed === 1 && draggingNodeRef.current) {
            setNodes(prev =>
                prev.map(node =>
                    node.number === draggingNodeRef.current?.number
                        ? { ...node, x: mouse.x, y: mouse.y }
                        : node
                )
            );
        } else if (pressed === 4) {
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

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onWheel={onWheel}
        />
    );
}

export default Canvas;
