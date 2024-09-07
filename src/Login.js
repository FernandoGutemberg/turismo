import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import backgroundImage from './images/Esto.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  // Função que lida com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();

    // Faz uma requisição para o servidor de login com os parâmetros email e senha
    fetch(`http://localhost:9000/login?email=${email}&senha=${senha}`)
      .then(response => response.json())
      .then(data => {
        if (data.sucesso) {
          sessionStorage.setItem('token', data.token);
          navigate('/Tabelalocais');
        } else {
          toast.error('Usuário ou senha incorreto!');
        }
      })
      .catch(error => {
        console.error('Erro:', error);
        toast.error('Erro ao conectar com o servidor.');
      });
  };

  return (
    <div
      className="App"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="container-center">
        <div className="login">
          <div className="login-area">
          </div>

          <form className="login-senha" onSubmit={handleSubmit}>
            <h1>Turismo</h1>
            <input
              type="email"
              name="email"
              placeholder="email@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="********"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <button type="submit">Entrar</button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
