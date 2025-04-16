import React from 'react';
import Button from 'react-bootstrap/Button';
import './GraphHeader.css';

function GraphHeader(){
  return (
    <header className="graph-header">
      <div className="header-text">
        <p className="fw-bold mb-0">Nome do grafo</p>
        <p className="text-md-start mb-0">Ultima modificacao: 09/04/2024 as 20:43</p>
      </div>
      <div className="header-buttons">
        <Button variant="outline-lb" className="fw-bold">Exportar</Button>
        <Button variant="outline-lb" className="fw-bold">Salvar</Button>
      </div>
    </header>
  );
}

export default GraphHeader;
