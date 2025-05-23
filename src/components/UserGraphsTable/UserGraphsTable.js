import React from "react";
import UserGraphsRow from "../UserGraphsRow/UserGraphsRow";
import { useNavigate } from "react-router";

function UserGraphsTable({ graphs }) {
  const navigate = useNavigate();

  function handleClick(graphID) {
    navigate(`/draw/${graphID}`);
  }

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
              onClick={() => handleClick(graph.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserGraphsTable;
