import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function PathInputModal({ nodes, showPathInputModal, setShowPathInputModal, handleInputSubmit }) {
    const [localSource, setLocalSource] = useState(nodes[0]?.number || 0);
    const [localDestination, setLocalDestination] = useState(nodes[0]?.number || 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleInputSubmit(Number(localSource), Number(localDestination));
        setShowPathInputModal(false);
    };

    const nodesOptions = nodes.map(node => (
        <option key={node.number} value={node.number}>
            {node.number}
        </option>
    ));

    return (
        <Modal show={showPathInputModal} onHide={() => setShowPathInputModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Encontrar caminho</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Origem</Form.Label>
                        <Form.Select
                            className="form-select-sm"
                            value={localSource}
                            onChange={(e) => setLocalSource(Number(e.target.value))}
                        >
                            {nodesOptions}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Destino</Form.Label>
                        <Form.Select
                            className="form-select-sm"
                            value={localDestination}
                            onChange={(e) => setLocalDestination(Number(e.target.value))}
                        >
                            {nodesOptions}
                        </Form.Select>
                    </Form.Group>

                    <div className="d-flex justify-content-end">
                        <Button type="submit">Encontrar</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default PathInputModal;