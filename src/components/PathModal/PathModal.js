import React from 'react';
import Modal from 'react-bootstrap/Modal';
import PathCanvas from '../PathCanvas/PathCanvas.js';
import { Algorithms } from '../../utils/algorithms.js';

import '../../styles/largeModal.css';

function PathModal({ activeAlgorithm, setActiveAlgorithm, nodes, edges }) {
    const isVisible = activeAlgorithm !== Algorithms.NONE;

    const algorithmsTitle = {
        dijkstra: "Visualização do caminho por Dijkstra",
        bfs: "Visualização do caminho por BFS",
        dfs: "Visualização do caminho por DFS",
    };

    const getAlgorithmsTitle = (algorithm) => {
        return algorithmsTitle[algorithm] || "";
    };

    // placeholder
    const highlighted = [0, 1];
    const cost = 2;

    return (
        <Modal
            show={isVisible}
            onHide={() => setActiveAlgorithm(Algorithms.NONE)}
            dialogClassName="large-modal"
            contentClassName='large-modal-content'
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{getAlgorithmsTitle(activeAlgorithm)}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-0">
                    <PathCanvas
                        nodes={nodes}
                        edges={edges}
                        highlighted={highlighted}
                        cost={cost}
                    />
            </Modal.Body>
        </Modal>
    );
}

export default PathModal;
