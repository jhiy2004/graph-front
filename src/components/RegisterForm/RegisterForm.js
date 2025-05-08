import { useNavigate } from "react-router-dom";
import NameIcon from "../../assets/icons/NameIcon/NameIcon.js";
import EmailIcon from "../../assets/icons/EmailIcon/EmailIcon.js";
import KeyIcon from "../../assets/icons/KeyIcon/KeyIcon.js";
import styles from "./RegisterForm.module.scss";

function RegisterForm() {
  const navigate = useNavigate();

  const handleBack = () => navigate("/");

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
          <input type="text" placeholder="Nome" />
        </div>

        <div className={styles.inputGroup}>
          <span className={styles.icon}>
            <EmailIcon />
          </span>
          <input type="email" placeholder="Email" />
        </div>

        <div className={styles.inputGroup}>
          <span className={styles.icon}>
            <KeyIcon />
          </span>
          <input type="password" placeholder="Senha" />
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.primaryBtn}>Criar Conta</button>
          <button className={styles.linkBtn} onClick={handleBack}>
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
