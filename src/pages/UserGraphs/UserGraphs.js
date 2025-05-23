import React, { useState } from "react";
import NavBarGraph from "../../components/NavbarGraph/NavbarGraph.js";
import UserGraphsHeader from "../../components/UserGraphsHeader/UserGraphsHeader.js";
import UserGraphsTable from "../../components/UserGraphsTable/UserGraphsTable.js";
import NameModal from "../../components/NameModal/NameModal.js";

import styles from "./UserGraphs.module.scss";
import { useGraphAPI } from "../DrawScreen/useGraphAPI.js";

function UserGraphs() {
  const [showNameModal, setShowNameModal] = useState(false);
  const [graphs, setGraphs] = useState([
    {
      "id": 1,
      "name": "Social Network",
      "date_modified": "2025-05-21T21:29:33.382Z",
      "user_name": "Alice",
      "vertices": [],
      "edges": []
    }
  ]);

  const { createGraph } = useGraphAPI(process.env.REACT_APP_API_URL);

  function handleCreateButton(){
    setShowNameModal(true);
  }

  async function handleNameModalSubmit(name){
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ3ODc2MDMyLCJleHAiOjE3NDc4NzYzMzJ9.RnR4UtopFRDTDnUPmT6mryLMA1bbUwUrRin5j_jtIc0';
    setShowNameModal(false);

    try{
      const graph = await createGraph(name, token);
      setGraphs([
        ...graphs,
        graph
      ])

      console.log(graph);
    } catch(e) {
      console.error("Error ao criar grafo.");
      alert("Error ao criar grafo.");
    }
  }

  return (
    <>
      <div className={styles.userGraphsPage}>
        <NavBarGraph logged={true} />
        <UserGraphsHeader handleCreateButton={handleCreateButton}/>
        <UserGraphsTable graphs={graphs} />
      </div>

      <NameModal
        showNameModal={showNameModal}
        setShowNameModal={setShowNameModal}
        handleNameModalSubmit={handleNameModalSubmit}
      />
    </>
  );
}

export default UserGraphs;
