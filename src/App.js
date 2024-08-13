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
import Tabelausuarios from "./Tabelausuarios";
import Tabelalocais from "./Tabelalocais";
import Tabelafotos from "./Tabelafotos";
import Tabelaorcamento from "./Tabelaorcamento";
import Tabelamensagens from "./Tabelamensagens";

function App() {
  return (

    <Router>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>Turismo</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/Cadastrousuarios/">Cadastrar Usuário</Nav.Link>
          <Nav.Link as={Link} to="/cadastrolocais">Cadastrar Local</Nav.Link>
          <Nav.Link as={Link} to="/Cadastrofotolocais">Cadastrar foto(s)</Nav.Link>
          <Nav.Link as={Link} to="/Cadastroorcamento">Cadastrar Orcamento</Nav.Link>
          <Nav.Link as={Link} to="/Cadastromensagens">Cadastrar Mensagens</Nav.Link>
          <Nav.Link as={Link} to="/Geolocalizacao">Geolocalizacao</Nav.Link>

          <Nav.Link as={Link} to="/Tabelausuarios">Tabela Usuarios</Nav.Link>
          <Nav.Link as={Link} to="/Tabelalocais">Tabela Locais</Nav.Link>
          <Nav.Link as={Link} to="/Tabelafotos">Tabela Fotos</Nav.Link>
          <Nav.Link as={Link} to="/Tabelaorcamento">Tabela Orcamento</Nav.Link>
          <Nav.Link as={Link} to="/Tabelamensagens">Tabela Mensagens</Nav.Link>

        </Nav>
      </Navbar>
      <Routes>
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
    </Router>

  );
}

export default App;
