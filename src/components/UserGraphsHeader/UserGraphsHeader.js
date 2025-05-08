import React from 'react';
import Stack from 'react-bootstrap/Stack';
import GraphIcon from '../../assets/icons/GraphIcon/GraphIcon.js';
import GraphHeaderButton from '../GraphHeaderButton/GraphHeaderButton.js';

import './UserGraphsHeader.css'

function UserGraphsHeader() {
    return (
        <header className="user-graphs-header p-1">
            <Stack direction="horizontal" className="px-5 py-2">
                <Stack direction="horizontal" gap={1}>
                    <GraphIcon className="me-2" />
                    <p className="fw-bold mb-0">Grafos</p>
                </Stack>
                <Stack direction="horizontal" gap={3} className="ms-auto">
                    <GraphHeaderButton type="add" onClick={() => {console.log("Clicou em novo grafo")}}/>
                    <GraphHeaderButton type="import" onClick={() => {console.log("Clicou em importar")}}/>
                </Stack>
            </Stack>
        </header>
    );
}

export default UserGraphsHeader;