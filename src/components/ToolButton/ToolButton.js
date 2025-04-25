import React from 'react';
import Button from 'react-bootstrap/Button';

import SquareIcon from '../../assets/icons/SquareIcon/SquareIcon.js';
import TriangleIcon from '../../assets/icons/TriangleIcon/TriangleIcon.js';
import EdgeIcon from '../../assets/icons/EdgeIcon/EdgeIcon.js';
import DragIcon from '../../assets/icons/DragIcon/DragIcon.js';
import ZoominIcon from '../../assets/icons/ZoominIcon/ZoominIcon.js';
import ZoomoutIcon from '../../assets/icons/ZoomoutIcon/ZoomoutIcon.js';
import CircleIcon from '../../assets/icons/CircleIcon/CircleIcon.js';

import './ToolButton.css'

function ToolButton({icon, onClick, active=false, draggable=false, onDragStart, onDragEnd }){
    const icons = {
        'square': <SquareIcon/>,
        'triangle': <TriangleIcon/>,
        'circle': <CircleIcon/>,
        'edge': <EdgeIcon/>,
        'drag': <DragIcon/>,
        'zoomin': <ZoominIcon/>,
        'zoomout': <ZoomoutIcon/>,
    }

    const getIcons = (icon) => {
        return icons[icon] || null;
    }

    const ToolIcon = getIcons(icon);

    return (
        <Button draggable={draggable}
            variant={(!active) ? 'tool' : 'tool-active'}
            onClick={onClick}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
        >
            {ToolIcon}
        </Button>
    );
}

export default ToolButton;
