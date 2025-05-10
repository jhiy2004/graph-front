import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Matrix from '../Matrix/Matrix.js';
import "../../styles/largeModal.css"

function MatrixModal({showMatrix, setShowMatrix}){
    const handleClose = () => {setShowMatrix(false)};

    return (
        <Modal
            show={showMatrix}
            onHide={handleClose}
            scrollable
            dialogClassName="large-modal"
            contentClassName="large-modal-content"
            centered
        >

            <Modal.Header closeButton>
                <Modal.Title>Visualização matrix de adjacência</Modal.Title>
            </Modal.Header>
            <Modal.Body className="d-block overflow-x-auto">
                <Matrix />
            </Modal.Body>
        </Modal>
    );
}

export default MatrixModal;