import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Cadastrousuarios from './Cadastrousuarios';
import Cadastrolocais from './Cadastrolocais';
import Cadastrofotolocais from './Cadastrofotolocais';
import Cadastroorcamento from './Cadastroorcamento';
import Cadastromensagens from './Cadastromensagens';
import Geolocalizacao from './Geolocalizacao';


function App() {
  return (
    <Router>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>Turismo</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/cadastrousuarios">Cadastrar Usuário</Nav.Link>
          <Nav.Link as={Link} to="/cadastrolocais">Cadastrar Local</Nav.Link>
          <Nav.Link as={Link} to="/Cadastrofotolocais">Cadastrar foto(s)</Nav.Link>
          <Nav.Link as={Link} to="/Cadastroorcamento">Cadastrar Orcamento</Nav.Link>
          <Nav.Link as={Link} to="/Cadastromensagens">Cadastrar Mensagens</Nav.Link>
          <Nav.Link as={Link} to="/Geolocalizacao">Geolocalizacao</Nav.Link>




          {/* Cadastrar Orçamento */}
          {/* Cadastrar Mensagens/Avaliacao */}
          {/* Cadastrar Geolocalizacao*/}
          {/* Butão de Logout */}

          {/* Usuarios
          Locais
          Fotos
          Orçamento
          Mensagens
          Geolocalizacao */}

        </Nav>
      </Navbar>
      <Routes>
        <Route path="/cadastrousuarios" element={<Cadastrousuarios />} />
        <Route path="/cadastrolocais" element={<Cadastrolocais />} />
        <Route path="/Cadastrofotolocais" element={<Cadastrofotolocais />} />
        <Route path="/Cadastroorcamento" element={<Cadastroorcamento />} />
        <Route path="/Cadastromensagens" element={<Cadastromensagens />} />
        <Route path="/Geolocalizacao" element={<Geolocalizacao />} />




        {/* Cadastrar Orçamento */}
        {/* Cadastrar Mensagens/Avaliacao */}
        {/* Cadastrar Geolocalizacao*/}
        {/* Butão de Logout */}

        {/* Usuarios
          Locais
          Fotos
          Orçamento
          Mensagens
          Geolocalizacao */}

      </Routes>
    </Router>

  );
}

export default App;
