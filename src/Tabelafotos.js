import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Modal, Button } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import "./App.css";

const Tabelafotos = () => {
  const navigate = useNavigate();
  const [fotos, setFotos] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fotoIdToDelete, setFotoIdToDelete] = useState('');

  useEffect(() => {
    if (localStorage.getItem("notificacao") === "true") {
      localStorage.setItem("notificacao", null);
      setTimeout(() => toast("Foto cadastrada com sucesso!"), 500);
    }
    fetchFotos();
  }, []);

  const fetchFotos = async () => {
    try {
      const response = await fetch('http://localhost:9000/tabelafotos');
      const data = await response.json();
      setFotos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (fotoId) => {
    setShowDeleteModal(true);
    setFotoIdToDelete(fotoId);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await fetch(`http://localhost:9000/tabelafotos/${fotoIdToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      fetchFotos();
      setShowDeleteModal(false);
      toast("Foto deletada com sucesso!");
    } catch (error) {
      console.error('Erro ao tentar deletar a foto', error);
    }
  };

  const redirecionarParaCadastroFotos = () => {
    navigate('/Cadastrofotolocais');
  };

  const DeleteModal = ({ show, handleClose }) => (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Exclusão</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Deseja realmente excluir esta foto?</p>
        <Button variant="danger" onClick={handleDeleteConfirmed}>Excluir</Button>
        <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
      </Modal.Body>
    </Modal>
  );

  return (
    <div>
      <h2 className='titulo-principal'>Tabela de Fotos</h2>
      <Button onClick={redirecionarParaCadastroFotos}>Cadastrar Foto</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Local</th>
            <th>Foto do Local</th>
            <th>Descrição</th>
            <th>Ação Deletar</th>
            <th>Ação Editar</th>
          </tr>
        </thead>
        <tbody>
          {fotos.map((foto, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{foto.localInfo || 'Nome não disponível'}</td>
              <td>
                <img 
                  src={foto.uploadfoto} 
                  alt="Foto do local" 
                  style={{ width: "100px", height: "auto" }} 
                />
              </td>
              <td>{foto.descricao}</td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(foto._id)}>Deletar</Button>
              </td>
              <td>
                <Button onClick={() => navigate(`/Cadastrofotolocais/${foto._id}`)}>Editar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ToastContainer />
      <DeleteModal show={showDeleteModal} handleClose={() => setShowDeleteModal(false)} />
    </div>
  );
};

export default Tabelafotos;
