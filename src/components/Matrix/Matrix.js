import React, { useEffect, useRef, useState } from 'react';
import MatrixBorder from '../MatrixBorder/MatrixBorder.js';
import MatrixRow from '../MatrixRow/MatrixRow.js';

function Matrix() {
    const size = 64;
    const matrix = Array.from({ length: size }, () => Array(size).fill(0));
    const tableRef = useRef(null);
    const [tableSize, setTableSize] = useState(0);

    useEffect(() => {
        if (tableRef.current) {
            const height = tableRef.current.offsetHeight;
            setTableSize(height);
        }
    }, [matrix]);

    return (
        <div className="d-flex align-items-stretch" style={{ minWidth: tableSize + 20, height: "auto" }}>
            <MatrixBorder tableHeight={tableSize} left={true} />
            
            <div style={{ minWidth: tableSize }}>
                <table className="w-100" ref={tableRef}>
                    <tbody>
                        {matrix.map((row, index) => (
                            <MatrixRow key={index} rowElements={row} />
                        ))}
                    </tbody>
                </table>
            </div>
            
            <MatrixBorder tableHeight={tableSize} left={false} />
        </div>
    );
}

export default Matrix;
