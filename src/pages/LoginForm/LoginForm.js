import { useNavigate } from "react-router-dom";
import EmailIcon from "../../assets/icons/EmailIcon/EmailIcon.js";
import KeyIcon from "../../assets/icons/KeyIcon/KeyIcon.js";
import styles from "./LoginForm.module.scss";
import { useState } from "react";

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleBack = () => navigate("/");

  function entrar() {
    const apiUrl = process.env.REACT_APP_API_URL;

    fetch(`${apiUrl}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          alert(data.erro || "Erro desconhecido no login.");
          return;
        }

        localStorage.setItem("token", data.token);
        navigate("/user/graphs");
      })
      .catch(() => {
        alert("Erro de conexão com o servidor.");
      });
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.formBox}>
        <h2>
          <strong>Entrar</strong>
        </h2>

        <div className={styles.inputGroup}>
          <span className={styles.icon}>
            <EmailIcon />
          </span>
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
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
            autoComplete="current-password"
            value={password}
            onChange={(s) => setPassword(s.target.value)}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.primaryBtn} onClick={entrar}>
            Entrar
          </button>
          <button className={styles.linkBtn}>Recuperar Senha</button>
          <button className={styles.linkBtn} onClick={handleBack}>
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
