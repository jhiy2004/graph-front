import React from "react";
import Modal from "react-bootstrap/Modal";
import AdjList from "../AdjList/AdjList.js";
import "../../styles/largeModal.css";

function AdjListModal({ showAdjList, setShowAdjList, adjacencyList }) {
  const handleClose = () => setShowAdjList(false);

  return (
    <Modal
      show={showAdjList}
      onHide={handleClose}
      scrollable
      dialogClassName="large-modal"
      contentClassName="large-modal-content"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Visualização lista de adjacência</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-block overflow-x-auto">
        <AdjList adjacencyList={adjacencyList} />
      </Modal.Body>
    </Modal>
  );
}

export default AdjListModal;
