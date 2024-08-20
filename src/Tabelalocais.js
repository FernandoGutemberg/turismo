import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Modal, Button} from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

const Tabelalocais = () => {
  const navigate = useNavigate();

  const notifyDelete = () => toast("Local deletado com sucesso!");
  const notifyCadastro = () => toast("Local salvo com sucesso!");

  const [locais, setLocais] = useState([]);

  const fetchLocais = async () => {
    try {
      const response = await fetch('http://localhost:9000/tabelalocais');
      const data = await response.json();
      setLocais(data);
    } catch (error) {
      console.error("Erro ao buscar os locais:", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("notificacao") === "true") {
      localStorage.setItem("notificacao", null);
      setTimeout(() => {
        notifyCadastro();
      }, 500);
    }
    fetchLocais();
  }, []);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [localIdToDelete, setLocalIdToDelete] = useState('');

  const handleDelete = (localId) => {
    setShowDeleteModal(true);
    setLocalIdToDelete(localId);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await fetch(`http://localhost:9000/tabelalocais/${localIdToDelete}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      fetchLocais();
      setShowDeleteModal(false);
      notifyDelete();
    } catch (error) {
      console.error('Erro ao deletar o local:', error);
    }
  };

  const DeleteModal = ({ show, handleClose }) => (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Exclusão</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Deseja realmente excluir este local?</p>
        <Button variant="danger" onClick={handleDeleteConfirmed}>
          Excluir
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
      </Modal.Body>
    </Modal>
  );

  // Redireciona para a página de cadastro de locais
  const redirecionarParaCadastroLocais = () => {
    navigate('/Cadastrolocais');
  };

  return (
    <div>
      <h2>Tabela de Locais</h2>
      <Button onClick={redirecionarParaCadastroLocais}>Cadastrar Local</Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>País</th>
            <th>Estado</th>
            <th>Cidade</th>
            <th>Bairro</th>
            <th>Foto</th>
            <th>Avaliação</th>
            <th>Descrição</th>
            <th>Ação Deletar</th>
            <th>Ação Editar</th>
          </tr>
        </thead>
        <tbody>
          {locais.map((local, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{local.paisLocal}</td>
              <td>{local.estado}</td>
              <td>{local.cidade}</td>
              <td>{local.bairro}</td>
              <td>
                <img src={local.foto} alt={`Foto de ${local.cidade}`} width="100" />
              </td>
              <td>{local.avaliacao}</td>
              <td>{local.descricao}</td>
              <td>
                <Button
                  variant="danger"
                  className='delete'
                  type='button'
                  onClick={() => handleDelete(local._id)}
                >DELETAR
                </Button>
              </td>
              <td>
                <Button
                  className='update'
                  type='button'
                  onClick={() => window.location.href = '/Cadastrolocais/' + local._id}
                >EDITAR
                </Button>
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

export default Tabelalocais;
