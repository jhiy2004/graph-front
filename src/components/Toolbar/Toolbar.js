import React from "react";
import Stack from "react-bootstrap/Stack";
import ToolButton from '../ToolButton/ToolButton.js';

import './Toolbar.css';

function Toolbar({setZoomAction, dragMode, setDragMode, setDragPreviewNode, lastNodeNumber}) {
    function onDragStart(e, type){
        e.dataTransfer.setData("application/json", JSON.stringify({ id: null, label: "New node", number: lastNodeNumber+1, x: 0, y: 0, geometry: type, color: "#FFFFFF"}));

        const img = document.createElement('canvas');
        img.width = img.height = 1;
        e.dataTransfer.setDragImage(img, 0, 0);
    }

    function onDragEnd(e){
        setDragPreviewNode(null);
    }

    return (
        <Stack className="toolbar rounded-3">
            <ToolButton icon='circle' draggable onDragStart={(e) => onDragStart(e, 'circle')} onDragEnd={onDragEnd}/>
            <ToolButton icon='square' draggable onDragStart={(e) => onDragStart(e, 'square')} onDragEnd={onDragEnd} />
            <ToolButton icon='triangle' draggable onDragStart={(e) => onDragStart(e, 'triangle')} onDragEnd={onDragEnd}/>
            <ToolButton icon='edge'/>
            <ToolButton icon='drag' active={dragMode} onClick={() => setDragMode(!dragMode)}/>
            <ToolButton icon='zoomin' onClick={() => setZoomAction('zoomIn')}/>
            <ToolButton icon='zoomout' onClick={() => setZoomAction('zoomOut')}/>
        </Stack>
    )
}

export default Toolbar;
