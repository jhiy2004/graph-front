import React from "react";
import styles from "./UserGraphsRow.module.scss";

function UserGraphsRow({ nome, autor, criacao, modificacao, onClick }) {
  return (
    <tr className={styles.graphRow} onClick={onClick}>
      <td>{nome}</td>
      <td>{autor}</td>
      <td>{criacao}</td>
      <td>{modificacao}</td>
    </tr>
  );
}

export default UserGraphsRow;
