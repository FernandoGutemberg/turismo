import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
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

  return (
    <>
      {!isLoginPage && (
        <Navbar  bg="dark" data-bs-theme="dark"variant="dark" expand="lg">
          <Navbar.Brand>Turismo</Navbar.Brand>
          <Nav className="mr-auto">
            {/* <Nav.Link as={Link} to="/Cadastrousuarios">Cadastrar Usuário</Nav.Link>
            <Nav.Link as={Link} to="/Cadastrolocais">Cadastrar Local</Nav.Link>
            <Nav.Link as={Link} to="/Cadastrofotolocais">Cadastrar foto(s)</Nav.Link>
            <Nav.Link as={Link} to="/Cadastroorcamento">Cadastrar Orçamento</Nav.Link>
            <Nav.Link as={Link} to="/Cadastromensagens">Cadastrar Mensagens</Nav.Link> */}
            <Nav.Link as={Link} to="/Tabelausuarios">Tabela de Usuários</Nav.Link>
            <Nav.Link as={Link} to="/Tabelalocais">Tabela Locais</Nav.Link>
            <Nav.Link as={Link} to="/Tabelafotos">Tabela Fotos</Nav.Link>
            <Nav.Link as={Link} to="/Tabelaorcamento">Tabela Orçamento</Nav.Link>
            <Nav.Link as={Link} to="/Tabelamensagens">Tabela Mensagens</Nav.Link>
            <Nav.Link as={Link} to="/Geolocalizacao">Geolocalização</Nav.Link>
          </Nav>
        </Navbar>
      )}
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/Cadastrousuarios/:id?" element={<Cadastrousuarios />} />
        <Route path="/Cadastrolocais/:id?" element={<Cadastrolocais />} />
        <Route path="/Cadastrofotolocais/:id?" element={<Cadastrofotolocais />} />
        <Route path="/Cadastroorcamento/:id?" element={<Cadastroorcamento />} />
        <Route path="/Cadastromensagens/:id?" element={<Cadastromensagens />} />
        <Route path="/Geolocalizacao" element={<Geolocalizacao />} />
        <Route path="/Tabelausuarios" element={<Tabelausuarios />} />
        <Route path="/Tabelalocais" element={<Tabelalocais />} />
        <Route path="/Tabelafotos" element={<Tabelafotos />} />
        <Route path="/Tabelaorcamento" element={<Tabelaorcamento />} />
        <Route path="/Tabelamensagens" element={<Tabelamensagens />} />
      </Routes>
    </>
  );
}

export default App;
