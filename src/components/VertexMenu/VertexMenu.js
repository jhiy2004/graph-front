import React from 'react';
import Form from 'react-bootstrap/Form';
import { Geometry } from '../../utils/geometry.js';

function VertexMenu({ nodes, selectedNodeNumber, updateNodeField }) {
  const selectedNode = nodes.find(node => node.number === selectedNodeNumber);

  function onChange(field, value) {
    updateNodeField(field, value, selectedNodeNumber);
  }

  return (
    <section className="p-2 border border-primary bg-white">
      <p className="fw-bold">Atributos</p>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label className="mb-0">Numero</Form.Label>
          <Form.Control
            disabled
            type="number"
            className="form-control-sm"
            value={
              typeof selectedNode?.number === 'number'
                ? Math.trunc(selectedNode.number)
                : selectedNode?.number ?? ''
            }
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mb-0">Nome</Form.Label>
          <Form.Control
            type="text"
            className="form-control-sm"
            value={selectedNode?.label ?? ''}
            onChange={e => onChange('label', e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mb-0">X</Form.Label>
          <Form.Control
            type="number"
            className="form-control-sm"
            value={
              typeof selectedNode?.x === 'number'
                ? Math.trunc(selectedNode.x)
                : selectedNode?.x ?? ''
            }
            onChange={e => onChange('x', e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mb-0">Y</Form.Label>
          <Form.Control
            type="number"
            className="form-control-sm"
            value={
              typeof selectedNode?.y === 'number'
                ? Math.trunc(selectedNode.y)
                : selectedNode?.y ?? ''
            }
            onChange={e => onChange('y', e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mb-0">Geometria</Form.Label>
          <Form.Select
            className="form-select-sm"
            value={selectedNode?.geometry ?? Geometry.CIRCLE}
            onChange={e => onChange('geometry', e.target.value)}
          >
            <option value={Geometry.CIRCLE}>Circulo</option>
            <option value={Geometry.SQUARE}>Quadrado</option>
            <option value={Geometry.TRIANGLE}>Triangulo</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mb-0">Cor</Form.Label>
          <Form.Control
            type="color"
            className="ms-auto form-control-sm"
            value={selectedNode?.color ?? '#000000'}
            onChange={e => onChange('color', e.target.value)}
          />
        </Form.Group>
      </Form>
    </section>
  );
}

export default VertexMenu;
