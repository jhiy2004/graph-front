import React from "react";
import "./AdjList.css";

const AdjList = ({ adjacencyList }) => {
  return (
    <div className="adj-list-container">
      {adjacencyList.map((neighbors, vertex) => (
        <div key={vertex} className="adj-list-row">
          <span className="vertex-label">V[{vertex}] →</span>
          {neighbors.map((neighbor, i) => (
            <span key={i} className="adj-node">
              <span className="node-box">{neighbor.vertex}</span>
              <span className="node-box">{neighbor.weight}</span>
              <span className="node-arrow">→</span>
            </span>
          ))}
          <span className="null-label">NULL</span>
        </div>
      ))}
    </div>
  );
};

export default AdjList;
