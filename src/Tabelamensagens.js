import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Modal, Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

const Tabelamensagens = () => {
  const navigate = useNavigate();

  const notifyDelete = () => toast("Mensagem deletada com sucesso!");
  const notifyCadastro = () => toast("Mensagem salva com sucesso!");

  const [mensagens, setMensagens] = useState([]);

  const fetchMensagens = async () => {
    try {
      const response = await fetch('http://localhost:9000/tabelamensagens');
      const data = await response.json();
      setMensagens(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("notificacao") === "true") {
      localStorage.setItem("notificacao", null);
      setTimeout(() => {
        notifyCadastro();
      }, 500);
    }

    fetchMensagens();
  }, []);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mensagemIdToDelete, setMensagemIdToDelete] = useState('');

  const handleDelete = async (mensagemId) => {
    setShowDeleteModal(true);
    setMensagemIdToDelete(mensagemId);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await fetch(`http://localhost:9000/tabelamensagens/${mensagemIdToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
        .then(() => {
          fetchMensagens();
          setShowDeleteModal(false);
          notifyDelete();
        })
        .catch(error => {
          console.error('Erro durante a exclusão', error);
        });
    } catch (error) {
      console.error('Erro ao tentar deletar a mensagem', error);
    }
  };

  const redirecionarParaCadastroMensagens = () => {
    window.location.href = '/Cadastromensagens'; // Redireciona para a página de cadastro de mensagens
  };

  const DeleteModal = ({ show, handleClose }) => {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <p>Deseja realmente excluir a mensagem?</p>
            <Button variant="danger" onClick={handleDeleteConfirmed}>
              Excluir
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <div>
      <h2 className='titulo-principal'>Tabela de Mensagens</h2>
      <Button onClick={redirecionarParaCadastroMensagens}>Cadastrar Mensagem</Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Título da Mensagem</th>
            <th>Conteúdo da Mensagem</th>
            <th>Tipo de Mensagem</th>
            <th>Avaliação</th>
            <th>Ação Deletar</th>
            <th>Ação Editar</th>
          </tr>
        </thead>
        <tbody>
          {mensagens.map((mensagem, index) => (
            <tr key={index}>
              <td>{index}</td>
              <td>{mensagem.tituloMensagem}</td>
              <td>{mensagem.conteudoMensagem}</td>
              <td>{mensagem.tipoMensagem}</td>
              <td>{mensagem.avaliacao}</td>
              <td>
                <Button
                  variant="danger"
                  className='delete'
                  type='button'
                  onClick={() => handleDelete(mensagem._id)}
                >
                  DELETAR
                </Button>
              </td>
              <td>
                <Button
                  className='update'
                  type='button'
                  onClick={() => window.location.href = '/Cadastromensagens/' + mensagem._id}
                >
                  EDITAR
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

export default Tabelamensagens;
