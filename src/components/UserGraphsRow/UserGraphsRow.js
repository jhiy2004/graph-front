import React from "react";
import "./UserGraphsRow.css";

function UserGraphsRow({ nome, autor, criacao, modificacao, onClick }) {
  return (
    <tr className="graph-row" onClick={onClick}>
      <td>{nome}</td>
      <td>{autor}</td>
      <td>{criacao}</td>
      <td>{modificacao}</td>
    </tr>
  );
}

export default UserGraphsRow;
