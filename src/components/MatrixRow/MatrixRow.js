import React from 'react';

function MatrixRow({ rowElements }) {
    return (
        <tr>
            {rowElements.map((elem, index) => (
                <td key={index} align="center">{elem}</td>
            ))}
        </tr>
    );
}

export default MatrixRow;
