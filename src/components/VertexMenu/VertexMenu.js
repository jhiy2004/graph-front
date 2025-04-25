import React from 'react';
import Form from 'react-bootstrap/Form';

function VertexMenu({nodes, selectedNodeNumber, setNodes}){
  const selectedNode = nodes.find(node => node.number === selectedNodeNumber);

function onChange(field, value) {
  setNodes(nodes.map(node => {
    if (node.number === selectedNodeNumber) {
      if (['x', 'y', 'number'].includes(field)) {
        if (value === '' || value === '-' || value === '+') {
          return { ...node, [field]: value }; // Let user type freely
        }

        const parsed = Number(value);
        if (!Number.isNaN(parsed)) {
          return { ...node, [field]: parsed };
        }

        return node; // Invalid value, do nothing
      }

      return {
        ...node,
        [field]: value
      };
    }
    return node;
  }));
}
  
  return(
    <section className="p-2 border border-primary bg-white">
      <p className="fw-bold">Atributos</p>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label className="mb-0">Numero</Form.Label>
          <Form.Control type="number"
            className="form-control-sm"
            value={selectedNode?.number}
            onChange={e => onChange('number', e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mb-0">Nome</Form.Label>
          <Form.Control type="text"
            className="form-control-sm"
            value={selectedNode?.label}
            onChange={e => onChange('label', e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mb-0">X</Form.Label>
          <Form.Control type="number"
            className="form-control-sm"
            value={selectedNode?.x}
            onChange={e => onChange('x', e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mb-0">Y</Form.Label>
          <Form.Control type="number"
            className="form-control-sm"
            value={selectedNode?.y} 
            onChange={e => onChange('y', e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mb-0">Geometria</Form.Label>
          <Form.Select
            className="form-select-sm"
            value={selectedNode?.geometry ?? 'circle'}
            onChange={e => onChange('geometry', e.target.value)}
          >
            <option value="circle">Circulo</option>
            <option value="square">Quadrado</option>
            <option value="triangle">Triangulo</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mb-0">Cor</Form.Label>
          <Form.Control
            type="color"
            className="ms-auto form-control-sm"
            value={
              '#' + (selectedNode?.color?.toString(16).padStart(6, '0') ?? '000000')
            }
            onChange={e =>
              onChange('color', parseInt(e.target.value.replace('#', ''), 16))
            }
          />
        </Form.Group>
      </Form>

    </section>
  );
}

export default VertexMenu;
