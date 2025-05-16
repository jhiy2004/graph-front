import React from "react";
import NavBarGraph from "../../components/NavbarGraph/NavbarGraph.js";
import UserGraphsHeader from "../../components/UserGraphsHeader/UserGraphsHeader.js";
import UserGraphsTable from "../../components/UserGraphsTable/UserGraphsTable.js";
import styles from "./UserGraphs.module.scss";

function UserGraphs() {
  const graphs = [
    {
      nome: "Grafo_1",
      autor: "Vitor",
      criacao: "08/04/2025",
      modificacao: "12/04/2025",
    },
    {
      nome: "Grafo_2",
      autor: "Vitor",
      criacao: "10/04/2025",
      modificacao: "11/04/2025",
    },
    {
      nome: "Grafo_1",
      autor: "Vitor",
      criacao: "08/04/2025",
      modificacao: "12/04/2025",
    },
    {
      nome: "Grafo_2",
      autor: "Vitor",
      criacao: "10/04/2025",
      modificacao: "11/04/2025",
    },
    {
      nome: "Grafo_1",
      autor: "Vitor",
      criacao: "08/04/2025",
      modificacao: "12/04/2025",
    },
    {
      nome: "Grafo_2",
      autor: "Vitor",
      criacao: "10/04/2025",
      modificacao: "11/04/2025",
    },
    {
      nome: "Grafo_1",
      autor: "Vitor",
      criacao: "08/04/2025",
      modificacao: "12/04/2025",
    },
    {
      nome: "Grafo_2",
      autor: "Vitor",
      criacao: "10/04/2025",
      modificacao: "11/04/2025",
    },
    {
      nome: "Grafo_1",
      autor: "Vitor",
      criacao: "08/04/2025",
      modificacao: "12/04/2025",
    },
    {
      nome: "Grafo_2",
      autor: "Vitor",
      criacao: "10/04/2025",
      modificacao: "11/04/2025",
    },
    {
      nome: "Grafo_1",
      autor: "Vitor",
      criacao: "08/04/2025",
      modificacao: "12/04/2025",
    },
    {
      nome: "Grafo_2",
      autor: "Vitor",
      criacao: "10/04/2025",
      modificacao: "11/04/2025",
    },
    {
      nome: "Grafo_1",
      autor: "Vitor",
      criacao: "08/04/2025",
      modificacao: "12/04/2025",
    },
    {
      nome: "Grafo_2",
      autor: "Vitor",
      criacao: "10/04/2025",
      modificacao: "11/04/2025",
    },
    {
      nome: "Grafo_1",
      autor: "Vitor",
      criacao: "08/04/2025",
      modificacao: "12/04/2025",
    },
    {
      nome: "Grafo_2",
      autor: "Vitor",
      criacao: "10/04/2025",
      modificacao: "11/04/2025",
    },
    {
      nome: "Grafo_1",
      autor: "Vitor",
      criacao: "08/04/2025",
      modificacao: "12/04/2025",
    },
    {
      nome: "Grafo_2",
      autor: "Vitor",
      criacao: "10/04/2025",
      modificacao: "11/04/2025",
    },
    {
      nome: "Grafo_1",
      autor: "Vitor",
      criacao: "08/04/2025",
      modificacao: "12/04/2025",
    },
    {
      nome: "Grafo_2",
      autor: "Vitor",
      criacao: "10/04/2025",
      modificacao: "11/04/2025",
    },
    {
      nome: "Grafo_1",
      autor: "Vitor",
      criacao: "08/04/2025",
      modificacao: "12/04/2025",
    },
    {
      nome: "Grafo_2",
      autor: "Vitor",
      criacao: "10/04/2025",
      modificacao: "11/04/2025",
    },
  ];

  return (
    <div className={styles.userGraphsPage}>
      <NavBarGraph logged={true} />
      <UserGraphsHeader />
      <UserGraphsTable graphs={graphs} />
    </div>
  );
}

export default UserGraphs;

