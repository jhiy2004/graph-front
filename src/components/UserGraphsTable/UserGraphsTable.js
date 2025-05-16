import React from "react";
import UserGraphsRow from "../UserGraphsRow/UserGraphsRow";

function UserGraphsTable({ graphs }) {
  return (
    <div className="px-5">
      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Autor</th>
            <th>Criação</th>
            <th>Última Modificação</th>
          </tr>
        </thead>
        <tbody>
          {graphs.map((graph, index) => (
            <UserGraphsRow
              key={index}
              nome={graph.nome}
              autor={graph.autor}
              criacao={graph.criacao}
              modificacao={graph.modificacao}
              onClick={() => console.log("Clicou no grafo", graph.nome)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserGraphsTable;
