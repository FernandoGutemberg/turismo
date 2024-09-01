import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Cadastrousuarios from './Cadastrousuarios';
import Cadastrolocais from './Cadastrolocais';
import Cadastrofotolocais from './Cadastrofotolocais';
import Cadastroorcamento from './Cadastroorcamento';
import Cadastromensagens from './Cadastromensagens';
import Geolocalizacao from './Geolocalizacao';
import Login from './Login';
import Tabelausuarios from "./Tabelausuarios";
import Tabelalocais from "./Tabelalocais";
import Tabelafotos from "./Tabelafotos";
import Tabelaorcamento from "./Tabelaorcamento";
import Tabelamensagens from "./Tabelamensagens";
import ProtectedRoute from './ProtectedRoute'; 
import { Button } from 'react-bootstrap';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const navigate = useNavigate();

  // Função de logout
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate('/');
  };

  return (
    <>
      {!isLoginPage && (
        <Navbar bg="dark" data-bs-theme="dark" variant="dark" expand="lg">
          <Navbar.Brand>Turismo</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/Tabelausuarios">Tabela de Usuários</Nav.Link>
            <Nav.Link as={Link} to="/Tabelalocais">Tabela Locais</Nav.Link>
            <Nav.Link as={Link} to="/Tabelafotos">Tabela Fotos</Nav.Link>
            <Nav.Link as={Link} to="/Tabelaorcamento">Tabela Orçamento</Nav.Link>
            <Nav.Link as={Link} to="/Tabelamensagens">Tabela Mensagens</Nav.Link>
            <Nav.Link as={Link} to="/Geolocalizacao">Geolocalização</Nav.Link>
          </Nav>
          <Button variant="warning" onClick={handleLogout} className="ms-auto">Sair</Button>
        </Navbar>
      )}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Cadastrousuarios/:id?" element={<ProtectedRoute element={Cadastrousuarios} />} />
        <Route path="/Cadastrolocais/:id?" element={<ProtectedRoute element={Cadastrolocais} />} />
        <Route path="/Cadastrofotolocais/:id?" element={<ProtectedRoute element={Cadastrofotolocais} />} />
        <Route path="/Cadastroorcamento/:id?" element={<ProtectedRoute element={Cadastroorcamento} />} />
        <Route path="/Cadastromensagens/:id?" element={<ProtectedRoute element={Cadastromensagens} />} />
        <Route path="/Geolocalizacao" element={<ProtectedRoute element={Geolocalizacao} />} />
        <Route path="/Tabelausuarios" element={<ProtectedRoute element={Tabelausuarios} />} />
        <Route path="/Tabelalocais" element={<ProtectedRoute element={Tabelalocais} />} />
        <Route path="/Tabelafotos" element={<ProtectedRoute element={Tabelafotos} />} />
        <Route path="/Tabelaorcamento" element={<ProtectedRoute element={Tabelaorcamento} />} />
        <Route path="/Tabelamensagens" element={<ProtectedRoute element={Tabelamensagens} />} />
      </Routes>
    </>
  );
}

export default App;
