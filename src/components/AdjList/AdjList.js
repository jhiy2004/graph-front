import React from "react";
import "./AdjList.css";
import RightArrow from "../../assets/icons/RightArrow/RightArrow.js";

const AdjList = ({ adjacencyList }) => {
  return (
    <div className="adj-list-container">
      {adjacencyList.map((neighbors, vertex) => (
        <div key={vertex} className="adj-list-row">
          <span className="vertex-label">V[{vertex}]</span>
          <RightArrow />
          {neighbors.map((neighbor, i) => (
            <span key={i} className="adj-node">
              <span className="node-box">{neighbor.vertex}</span>
              <span className="node-box">{neighbor.weight}</span>
              <RightArrow />
            </span>
          ))}
          <span className="null-label">NULL</span>
        </div>
      ))}
    </div>
  );
};

export default AdjList;
