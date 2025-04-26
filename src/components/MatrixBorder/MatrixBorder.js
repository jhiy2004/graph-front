import React from 'react';

function MatrixBorder({ tableHeight, left }) {
    const x = left ? 1 : 9;  // Inner vertical line
    const edgeX = left ? 10 : 0;

    return (
        <svg width="10" height={tableHeight} preserveAspectRatio="none" style={{ display: 'block' }}>
            <line
                x1={x} y1="1"
                x2={edgeX} y2="1"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <line
                x1={x} y1="0"
                x2={x} y2={tableHeight}
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <line
                x1={x} y1={tableHeight - 1}
                x2={edgeX} y2={tableHeight - 1}
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

export default MatrixBorder;
