import React from "react";
import Stack from "react-bootstrap/Stack";
import ToolButton from '../ToolButton/ToolButton.js';

import './Toolbar.css';

function Toolbar({setZoomAction, dragMode, setDragMode}) {
    return (
        <Stack className="toolbar rounded-3">
            <ToolButton icon='square'/>
            <ToolButton icon='triangle'/>
            <ToolButton icon='circle'/>
            <ToolButton icon='edge'/>
            <ToolButton icon='drag' active={dragMode} onClick={() => setDragMode(!dragMode)}/>
            <ToolButton icon='zoomin' onClick={() => setZoomAction('zoomIn')}/>
            <ToolButton icon='zoomout' onClick={() => setZoomAction('zoomOut')}/>
        </Stack>
    )
}

export default Toolbar;
