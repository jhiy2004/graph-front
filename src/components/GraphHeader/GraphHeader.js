import React from 'react';
import Button from 'react-bootstrap/Button';
import './GraphHeader.css';
import Dropdown from 'react-bootstrap/Dropdown';

function GraphHeader({exportPNG, exportDOT}){
  return (
    <header className="graph-header">
      <div className="header-text">
        <p className="fw-bold mb-0">Nome do grafo</p>
        <p className="text-md-start mb-0">Ultima modificacao: 09/04/2024 as 20:43</p>
      </div>
      <div className="header-buttons">
        <Dropdown>
          <Dropdown.Toggle className="btn btn-outline-lb fw-bold">
            Exportar
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={exportPNG}>PNG</Dropdown.Item>
            <Dropdown.Item onClick={exportDOT}>DOT</Dropdown.Item>
          </Dropdown.Menu>

        </Dropdown>
        <Button variant="outline-lb" className="fw-bold">Salvar</Button>
      </div>
    </header>
  );
}

export default GraphHeader;
