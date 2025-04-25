import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Matrix from '../Matrix/Matrix.js';
import "./MatrixModal.css"

function MatrixModal({showMatrix, setShowMatrix}){
    const handleClose = () => {setShowMatrix(false)};

    return (
        <Modal show={showMatrix} onHide={handleClose} scrollable dialogClassName="width-90w height-90h">
            <Modal.Header closeButton>
                <Modal.Title>Visualização matrix de adjacência</Modal.Title>
            </Modal.Header>
            <Modal.Body className="height-90h overflow-x-auto">
                <Matrix />
            </Modal.Body>
        </Modal>
    );
}

export default MatrixModal;
