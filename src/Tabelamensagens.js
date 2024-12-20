import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Modal, Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import "./Tabela.css";
import { Trash, Pencil, ArrowRight, ArrowLeft, ArrowCounterclockwise } from 'react-bootstrap-icons';

// ESSA ALTER 
import { useParams } from 'react-router-dom';

const Tabelamensagens = () => {
  const navigate = useNavigate();
  const { localId } = useParams();
  const notifyCadastro = () => toast("Mensagem salva com sucesso!");
  const [mensagens, setMensagens] = useState([]);
  const [tokenValido, setTokenValido] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      fetch('http://localhost:9000/verificarToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.validado) {
            setTokenValido(true);
          } else {
            setTokenValido(false);
            alert('Token inválido. Redirecionando para a tela de login.');
            navigate('/');
          }
        })
        .catch(error => {
          console.error('Erro:', error);
        });

    } else {
      alert('Token não encontrado. Redirecionando para a tela de login.');
      navigate('/');
    }
  }, [navigate]);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
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
      });

      setMensagens(mensagens.filter(mensagem => mensagem._id !== mensagemIdToDelete));
      setShowDeleteModal(false);
      toast("Mensagem deletada com sucesso!");

    } catch (error) {
      console.error('Erro ao tentar deletar a mensagem', error);
    }
  };

  const redirecionarParaCadastroMensagens = () => {
    navigate(`/Cadastromensagens/${localId}`); // Usando crases para interpolar a variável

  };

  const redirecionarParaTabelalocais = () => {
    navigate('/Tabelalocais');
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = mensagens.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(mensagens.length / usersPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    fetchMensagensPorLocal(localId);  // Chama a função de buscar fotos com o localId
  }, [localId]);

  const fetchMensagensPorLocal = async (localId) => {
    try {
      const response = await fetch(`http://localhost:9000/Tabelamensagens?localId=${localId}`);  // Passa o localId na query string
      const data = await response.json();
      setMensagens(data);
    } catch (error) {
      console.error(error);
    }
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
    <div className="table-container">
      <Button onClick={redirecionarParaTabelalocais} variant="secondary" className="botao-tabela-voltar">
        <ArrowCounterclockwise /> Locais
      </Button>

      <h2 className='titulo-principal'>Mensagens</h2>
      <Button onClick={redirecionarParaCadastroMensagens} className="botao-cadastrar">Cadastrar Mensagem</Button>

      <Table striped bordered hover className="usuario-table">
        <thead className="usuario-table-header">
          <tr className="tr-color">
            <th>#</th>
            <th>Local</th>
            <th>Título da Mensagem</th>
            <th>Conteúdo da Mensagem</th>
            <th>Tipo de Mensagem</th>
            <th>Avaliação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((mensagem, index) => (
            <tr key={index}>
              <td>{index + indexOfFirstUser + 1}</td>
              <td>{mensagem.localInfo || 'Nome não disponível'}</td>
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
                  <Trash />
                </Button>
                <Button
                  className='update'
                  type='button'
                  onClick={() => navigate(`/Cadastromensagens/${localId}/${mensagem._id}`)}
                >
                  <Pencil />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="pagination-info">
        Página {currentPage} de {totalPages}
      </div>

      <div className="table-navigation">
        <Button variant="secondary" onClick={prevPage} disabled={currentPage === 1}>
          <ArrowLeft />
        </Button>
        <Button
          variant="secondary"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          <ArrowRight />
        </Button>
      </div>
      <ToastContainer />
      <DeleteModal show={showDeleteModal} handleClose={() => setShowDeleteModal(false)} />
    </div>
  );
};

export default Tabelamensagens;
