import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Cadastrousuarios from './Cadastrousuarios';
import Cadastrolocais from './Cadastrolocais';
import Cadastrofotolocais from './Cadastrofotolocais';
import Cadastroorcamento from './Cadastroorcamento';
import Cadastromensagens from './Cadastromensagens';
import Login from './Login';
import Tabelausuarios from "./Tabelausuarios";
import Tabelalocais from "./Tabelalocais";
import Tabelafotos from "./Tabelafotos";
import Tabelaorcamento from "./Tabelaorcamento";
import Tabelamensagens from "./Tabelamensagens";
import ProtectedRoute from './ProtectedRoute'; 
import { Button } from 'react-bootstrap';
import Graficos from './Graficos';

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
            <Nav.Link as={Link} to="/Tabelausuarios">Usuários</Nav.Link>
            <Nav.Link as={Link} to="/Tabelalocais">Locais</Nav.Link>
            <Nav.Link as={Link} to="/Graficos">Graficos</Nav.Link>


            {/* <Nav.Link as={Link} to="/Tabelafotos">Fotos</Nav.Link> */}
            {/* <Nav.Link as={Link} to="/Tabelaorcamento">Orçamento</Nav.Link> */}
            {/* <Nav.Link as={Link} to="/Tabelamensagens">Mensagens</Nav.Link> */}
          </Nav>
          <Button variant="warning" onClick={handleLogout} className="ms-auto">Sair</Button>
        </Navbar>
      )}
      <Routes>

        {/* AQUI Uma rota para abrir direto nos gráficos */}


        <Route path="/" element={<Login />} />
        
        <Route path="/Graficos/:id?" element={<ProtectedRoute element={Graficos} />} />
        <Route path="/Graficos/:localId" element={<ProtectedRoute element={Graficos} />} />


        <Route path="/Cadastrousuarios/:id?" element={<ProtectedRoute element={Cadastrousuarios} />} />
        <Route path="/Cadastrolocais/:id?" element={<ProtectedRoute element={Cadastrolocais} />} />
        
        {/* preparando para pegar o localId para atualizar a entidade Fotos assiaciado a um local.  */}
        <Route path="/Cadastrofotolocais/:localId/:id?" element={<ProtectedRoute element={Cadastrofotolocais} />} />

        <Route path="/Cadastroorcamento/:localId/:id?" element={<ProtectedRoute element={Cadastroorcamento} />} />
        <Route path="/Cadastromensagens/:localId/:id?" element={<ProtectedRoute element={Cadastromensagens} />} />
        <Route path="/Tabelausuarios" element={<ProtectedRoute element={Tabelausuarios} />} />
        <Route path="/Tabelalocais" element={<ProtectedRoute element={Tabelalocais} />} />
        <Route path="/Tabelafotos/:localId/:id?"element={<ProtectedRoute element={Tabelafotos} />} />
        <Route path="/Tabelaorcamento/:localId/:id?" element={<ProtectedRoute element={Tabelaorcamento} />} />
        <Route path="/Tabelamensagens/:localId/:id?" element={<ProtectedRoute element={Tabelamensagens} />} />
      </Routes>
    </>
  );
}

export default App;
