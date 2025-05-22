import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function NameModal({ showNameModal, setShowNameModal, handleNameModalSubmit }) {
    const [name, setName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        handleNameModalSubmit(name);
        setShowNameModal(false);
        setName("");
    };

    return (
        <Modal
            show={showNameModal}
            onHide={() => setShowNameModal(false)}
        >
            <Modal.Header closeButton>
                <Modal.Title>Criar novo grafo</Modal.Title>
            </Modal.Header>
            <Modal.Body className="d-block">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            size="sm"
                            type="text"
                            placeholder="Novo Grafo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>
                    <button type="submit" className="btn btn-primary btn-sm">Criar</button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default NameModal;
