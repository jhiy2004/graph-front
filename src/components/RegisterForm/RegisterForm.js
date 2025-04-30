import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";

function RegisterForm() {
  const navigate = useNavigate();

  const handleBack = () => navigate("/");

  return (
    <div className="auth-container">
      <div className="form-box">
        <h2>Criar conta</h2>

        <div className="input-group">
          <span className="icon">👤</span>
          <input type="text" placeholder="Nome" />
        </div>

        <div className="input-group">
          <span className="icon">✉️</span>
          <input type="email" placeholder="Email" />
        </div>

        <div className="input-group">
          <span className="icon">🔑</span>
          <input type="password" placeholder="Senha" />
        </div>

        <button className="primary-btn">Criar Conta</button>
        <button className="link-btn" onClick={handleBack}>
          Voltar
        </button>
      </div>
    </div>
  );
}

export default RegisterForm;
