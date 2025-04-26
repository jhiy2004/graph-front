import React from "react";
import Stack from "react-bootstrap/Stack";
import ToolButton from '../ToolButton/ToolButton.js';
import { Geometry } from '../../utils/geometry.js';
import { Modes } from "../../utils/modes.js";

import './Toolbar.css';

function Toolbar({setZoomAction,
    activeMode,
    handleModeChange,
    setDragPreviewTemplate,
    lastNodeNumber,
}) {
    function onDragStart(e, type){
        const newNumber = lastNodeNumber+1;
        setDragPreviewTemplate({ id: null, label: `${newNumber}`, number: newNumber, x: 0, y: 0, geometry: type, color: "#FFFFFF"});

        const img = document.createElement('canvas');
        img.width = img.height = 1;
        e.dataTransfer.setDragImage(img, 0, 0);
    }

    function onDragEnd(e){
        setDragPreviewTemplate(null);
    }

    return (
        <Stack className="toolbar rounded-3">
            <ToolButton icon='circle' draggable onDragStart={(e) => onDragStart(e, Geometry.CIRCLE)} onDragEnd={onDragEnd}/>
            <ToolButton icon='square' draggable onDragStart={(e) => onDragStart(e, Geometry.SQUARE)} onDragEnd={onDragEnd} />
            <ToolButton icon='triangle' draggable onDragStart={(e) => onDragStart(e, Geometry.TRIANGLE)} onDragEnd={onDragEnd}/>
            <ToolButton icon='edge' active={activeMode === Modes.EDGE} onClick={() => handleModeChange(Modes.EDGE)}/>
            <ToolButton icon='drag' active={activeMode === Modes.DRAG} onClick={() => handleModeChange(Modes.DRAG)}/>
            <ToolButton icon='zoomin' onClick={() => setZoomAction('zoomIn')}/>
            <ToolButton icon='zoomout' onClick={() => setZoomAction('zoomOut')}/>
        </Stack>
    )
}

export default Toolbar;