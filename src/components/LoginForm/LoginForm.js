import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginForm() {
  const navigate = useNavigate();

  const handleBack = () => navigate("/");

  return (
    <div className="auth-container">
      <div className="form-box">
        <h2>Entrar</h2>

        <div className="input-group">
          <span className="icon">✉️</span>
          <input type="email" placeholder="Email" />
        </div>

        <div className="input-group">
          <span className="icon">🔑</span>
          <input type="password" placeholder="Senha" />
        </div>

        <button className="primary-btn">Entrar</button>
        <button className="link-btn">Recuperar Senha</button>
        <button className="link-btn" onClick={handleBack}>
          Voltar
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
