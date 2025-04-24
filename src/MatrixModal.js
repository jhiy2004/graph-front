import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import "./MatrixModal.css"

function MyMatrixBorder({ tableHeight, left }) {
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


function MyRow({ rowElements }) {
    return (
        <tr>
            {rowElements.map((elem, index) => (
                <td key={index} align="center">{elem}</td>
            ))}
        </tr>
    );
}

function MyMatrix() {
    const size = 36;
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
        <div className="d-flex align-items-stretch" style={{ height: "auto" }}>
            <MyMatrixBorder tableHeight={tableSize} left={true} />
            
            <div style={{ minWidth: tableSize, width: tableSize }}>
                <table className="w-100" ref={tableRef}>
                    <tbody>
                        {matrix.map((row, index) => (
                            <MyRow key={index} rowElements={row} />
                        ))}
                    </tbody>
                </table>
            </div>
            
            <MyMatrixBorder tableHeight={tableSize} left={false} />
        </div>
    );
}

function MatrixModal({showMatrix, setShowMatrix}){
    const handleClose = () => {setShowMatrix(false)};

    return (
        <Modal show={showMatrix} onHide={handleClose} scrollable dialogClassName="modal-90w">
            <Modal.Header closeButton>
                <Modal.Title>Visualização matrix de adjacência</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ overflowX: 'auto' }}>
                    <MyMatrix />
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default MatrixModal;