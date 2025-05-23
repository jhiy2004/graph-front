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
              nome={graph.name}
              autor={graph.user_name}
              criacao={graph.date_modified}
              modificacao={graph.date_modified}
              onClick={() => console.log("Clicou no grafo", graph.name)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserGraphsTable;
