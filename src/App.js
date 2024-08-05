import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Cadastrousuarios from './Cadastrousuarios';
import Cadastrolocais from './Cadastrolocais';

function App() {
  return (
    <Router>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>Turismo</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/cadastrousuarios">Cadastro de Usuários</Nav.Link>
          <Nav.Link as={Link} to="/cadastrolocais">Cadastrolocais</Nav.Link>
        </Nav>
      </Navbar>
      <Routes>
        <Route path="/cadastrousuarios" element={<Cadastrousuarios />} />
        <Route path="/cadastrolocais" element={<Cadastrolocais/>}/>
      </Routes>
    </Router>
  );
}

export default App;
