import { useNavigate } from "react-router";
import NameIcon from "../../assets/icons/NameIcon/NameIcon.js";
import EmailIcon from "../../assets/icons/EmailIcon/EmailIcon.js";
import KeyIcon from "../../assets/icons/KeyIcon/KeyIcon.js";
import { useState } from "react";
import styles from "./RegisterForm.module.scss";

function RegisterForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleBack = () => navigate("/");

  function registrar() {
    const apiUrl = process.env.REACT_APP_API_URL;

    fetch(`${apiUrl}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          alert(data.erro || "Erro desconhecido no registro.");
          return;
        }
        alert("Conta cadastrada com sucesso!");

        navigate("/login");
      })
      .catch(() => {
        alert("Erro de conexão com o servidor.");
      });
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.formBox}>
        <h2>
          <strong>Criar conta</strong>
        </h2>

        <div className={styles.inputGroup}>
          <span className={styles.icon}>
            <NameIcon />
          </span>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(n) => setName(n.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <span className={styles.icon}>
            <EmailIcon />
          </span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <span className={styles.icon}>
            <KeyIcon />
          </span>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(p) => setPassword(p.target.value)}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.primaryBtn} onClick={registrar}>
            Criar Conta
          </button>
          <button className={styles.linkBtn} onClick={handleBack}>
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
