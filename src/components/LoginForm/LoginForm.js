import { useNavigate } from "react-router-dom";
import EmailIcon from "../../assets/icons/EmailIcon/EmailIcon.js";
import KeyIcon from "../../assets/icons/KeyIcon/KeyIcon.js";
import styles from "./LoginForm.module.scss";

function LoginForm() {
  const navigate = useNavigate();

  const handleBack = () => navigate("/");

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
          <input type="email" placeholder="Email" autoComplete="email" />
        </div>

        <div className={styles.inputGroup}>
          <span className={styles.icon}>
            <KeyIcon />
          </span>
          <input
            type="password"
            placeholder="Senha"
            autoComplete="current-password"
          />
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.primaryBtn}>Entrar</button>
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
