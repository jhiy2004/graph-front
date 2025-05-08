import React from 'react';
import Button from 'react-bootstrap/Button'

import AddIcon from '../../assets/icons/AddIcon/AddIcon.js';
import ImportIcon from '../../assets/icons/ImportIcon/ImportIcon.js';

import './GraphHeaderButton.css'

function GraphHeaderButton({ type, onClick }){
    const types = {
        add: {
            icon: AddIcon,
            text: "Novo Grafo"
        },
        import: {
           icon: ImportIcon,
           text: "Importar Grafo"
        }
    };

    const getType = (type) => {
        return types[type] || type["add"];
    }
    const buttonType = getType(type);

    return (
        <>
            <Button variant="outline-lightblue" onClick={onClick}>
                <buttonType.icon />
                <p className="m-0 fw-bold">{buttonType.text}</p>
            </Button>
        </>
    )
}

export default GraphHeaderButton;