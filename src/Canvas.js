import React, { useEffect, useRef, useState } from "react";

class Camera{
    x;
    y;
    z;
    width;
    height;

    constructor(x, y, z, width, height){
        this.x = x;
        this.y = y;
        this.z = z;

        this.width = width;
        this.height = height;
    }

    moveLeft(offset){
        this.x += offset;
    }

    moveRight(offset){
        this.x -= offset;
    }

    moveUp(offset){
        this.y -= offset;
    }

    moveDown(offset){
        this.y += offset;
    }

    zoomIn(factor) {
        this.z *= factor;
    }
    
    zoomOut(factor) {
        this.z /= factor;
    }
}

function Canvas({ width = 600, height = 600 }) {
    const canvasRef = useRef(null);
    const [nodes, setNodes] = useState([
        { label: "A", number: 0, x: -100, y: 50 },
        { label: "B", number: 1, x:  100, y: -50 },
        { label: "C", number: 2, x:  -1000, y: -500 },
    ]);
    const [edges, setEdges] = useState([
        { origin: 0, destination: 1 },
        { origin: 2, destination: 0 }
    ]);

    const draggingNodeRef = useRef(null);
    const lastPosRef = useRef({
        x: 0,
        y: 0
    });
    const [selectedNode, setSelectedNode] = useState(null);

    const radius = 50;

    const cameraRef = useRef(new Camera(0, 0, 1, width, height));

    function drawCenterCross(ctx) {
        ctx.save();
    
        const crossSize = 25;

        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 1 / cameraRef.current.z;
    
        // Flip Y back since your canvas uses ctx.scale(1, -1)
        ctx.scale(1, -1);
    
        ctx.beginPath();
        // Horizontal line
        ctx.moveTo(-crossSize, 0);
        ctx.lineTo(crossSize, 0);
        // Vertical line
        ctx.moveTo(0, -crossSize);
        ctx.lineTo(0, crossSize);
        ctx.stroke();
    
        ctx.restore();
    }
    

    function drawGrid(ctx) {
        const camera = cameraRef.current;
        const baseGridSize = 50; // Size of grid square in world space
    
        const zoom = camera.z;
        const scaledGridSize = baseGridSize;
    
        // Determine visible world bounds
        const left = camera.x - width / 2 / zoom;
        const right = camera.x + width / 2 / zoom;
        const top = camera.y + height / 2 / zoom;
        const bottom = camera.y - height / 2 / zoom;
    
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "#e0e0e0";
        ctx.lineWidth = 1 / zoom; // scale stroke with zoom
    
        // Vertical lines
        let startX = Math.floor(left / scaledGridSize) * scaledGridSize;
        for (let x = startX; x < right; x += scaledGridSize) {
            ctx.moveTo(x, bottom);
            ctx.lineTo(x, top);
        }
    
        // Horizontal lines
        let startY = Math.floor(bottom / scaledGridSize) * scaledGridSize;
        for (let y = startY; y < top; y += scaledGridSize) {
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
        const x = node.x;
        const y = node.y;
        const label = node.label;

        ctx.save();
        if (
            selectedNode?.x === node.x &&
            selectedNode?.y === node.y &&
            selectedNode?.label === node.label &&
            selectedNode?.number === node.number
        ) {
            ctx.strokeStyle = "#0E95DD";
            ctx.lineWidth = 5;
        }
        
        strokeCircleCenter(ctx, x, y, radius);
        ctx.restore();

        ctx.save();
        ctx.scale(1, -1); // Undo Y-axis flip for text

        const textMetrics = ctx.measureText(label);
        const textWidth = textMetrics.width;
        const ascent = textMetrics.actualBoundingBoxAscent;
        const descent = textMetrics.actualBoundingBoxDescent;
        const textHeight = ascent + descent;

        ctx.fillText(label, x - textWidth / 2, -y + textHeight / 2 - descent);
        ctx.restore();
    }

    function connectNodes(ctx, posA, posB) {
        const dx = posB.x - posA.x;
        const dy = posB.y - posA.y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);

        const unitX = dx / distance;
        const unitY = dy / distance;

        const startX = posA.x + unitX * radius;
        const startY = posA.y + unitY * radius;
        const endX = posB.x - unitX * radius;
        const endY = posB.y - unitY * radius;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }

    function draw(ctx) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        ctx.clearRect(0, 0, width, height);
        ctx.restore();

        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.scale(1, -1);

        ctx.scale(cameraRef.current.z, cameraRef.current.z);
        ctx.translate(-cameraRef.current.x, -cameraRef.current.y);

        ctx.font = "24px serif";

        drawGrid(ctx);
        drawCenterCross(ctx);

        for (const edge of edges) {
            const origin = nodes[edge.origin];
            const destination = nodes[edge.destination];
            if (origin && destination) {
                connectNodes(ctx, origin, destination);
            }
        }

        for (const node of nodes) {
            drawGraphNode(ctx, node);
        }

        ctx.restore();
    }

    function screenToCanvas(x, y) {
        const screenX = x - width / 2;
        const screenY = -(y - height / 2);
    
        return {
            x: screenX / cameraRef.current.z + cameraRef.current.x,
            y: screenY / cameraRef.current.z + cameraRef.current.y,
        };
    }

    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");
        draw(ctx);
    }, [selectedNode, nodes, edges]);


    function isMouseOverNode(mouse) {
        for (const node of nodes) {
            const dx = mouse.x - node.x;
            const dy = mouse.y - node.y;
            if (dx ** 2 + dy ** 2 <= radius ** 2) {
                return true;
            }
        }
        return false;
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
    
            const closestX = a.x + (proj / abLength) * abx;
            const closestY = a.y + (proj / abLength) * aby;
    
            const distSq = (closestX - mouse.x) ** 2 + (closestY - mouse.y) ** 2;
            if (distSq <= 10 ** 2) { // 10 px threshold
                return true;
            }
        }
    
        return false;
    }

    function onMouseDown(e) {
        e.preventDefault();
        const pressed = e.button;
        if(pressed === 0){
            const mouse = screenToCanvas(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
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
        
            setSelectedNode(found); // set selected or null
        }else if(pressed === 1){
            console.log("Middle");
            lastPosRef.current.x = e.clientX;
            lastPosRef.current.y = e.clientY;
        }
    }

    function onMouseMove(e) {
        const pressed = e.buttons;

        const mouse = screenToCanvas(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        const overNode = isMouseOverNode(mouse);
        const overEdge = isMouseOverEdge(mouse);

        // Debug
        console.log(`Mouse pos x: ${mouse.x}`);        
        console.log(`Mouse pos y: ${mouse.y}`);        
        
        if (overNode) {
            canvasRef.current.style.cursor = "pointer";
        } else if (overEdge) {
            canvasRef.current.style.cursor = "pointer";
        } else {
            canvasRef.current.style.cursor = "default";
        }

        if (pressed === 1) {
            if (!draggingNodeRef.current) return;
    
            const mouse = screenToCanvas(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    
            setNodes(prev => {
                return prev.map(node => {
                    if (node.number === draggingNodeRef.current?.number) {
                        const updatedNode = { ...node, x: mouse.x, y: mouse.y };
                        draggingNodeRef.current = updatedNode;
                        setSelectedNode(updatedNode);
                        return updatedNode;
                    }
                    return node;
                });
            });
        }
        else if (pressed === 4) {
            console.log("Moving wheel click");
        
            const offsetX = (e.clientX - lastPosRef.current.x)/cameraRef.current.z;
            const offsetY = (e.clientY - lastPosRef.current.y)/cameraRef.current.z;
        
            lastPosRef.current.x = e.clientX;
            lastPosRef.current.y = e.clientY;
        
            const camera = cameraRef.current;
        
            if (offsetX > 0) {
                camera.moveRight(offsetX);
            } else if (offsetX < 0) {
                camera.moveLeft(-offsetX); // flip sign
            }
        
            if (offsetY > 0) {
                camera.moveDown(offsetY);
            } else if (offsetY < 0) {
                camera.moveUp(-offsetY); // flip sign
            }
        
            console.log(`Cam x: ${camera.x}\nCam y: ${camera.y}`);
        
            draw(canvasRef.current.getContext("2d")); // Force redraw after camera movement
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
        const camera = cameraRef.current;
    
        if (direction > 0) {
            camera.zoomOut(zoomFactor);
        } else {
            camera.zoomIn(zoomFactor);
        }
    
        const after = screenToCanvas(mouseX, mouseY);
        camera.x += before.x - after.x;
        camera.y += before.y - after.y;
    
        draw(canvasRef.current.getContext("2d"));
    }

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onWheel={onWheel}
            style={{ border: "1px solid black", cursor: "pointer" }}
        />
    );
}

export default Canvas;