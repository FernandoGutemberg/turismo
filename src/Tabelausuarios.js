import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Modal, Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import "./App.css";
import "./Tabela.css";


const Tabelausuarios = () => {
  const navigate = useNavigate();

  const notifyDelete = () => toast("Usuário deletado com sucesso!");
  const notifyCadastro = () => toast("Usuário salvo com sucesso!");

  const [usuarios, setUsuarios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:9000/tabelausuarios');
      const data = await response.json();
      setUsuarios(data);
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

    fetchUsuarios();
  }, []);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [usuariosIdToDelete, setUsuariosIdToDelete] = useState('');

  const handleDelete = async (usuarioId) => {
    setShowDeleteModal(true);
    setUsuariosIdToDelete(usuarioId);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await fetch(`http://localhost:9000/tabelausuarios/${usuariosIdToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
        .then(() => {
          fetchUsuarios();
          setShowDeleteModal(false);
          notifyDelete();
        })
        .catch(error => {
          console.error('Erro durante a exclusão', error);
        });
    } catch (error) {
      console.error('Erro ao tentar deletar a categoria', error);
    }
  };

  const redirecionarParaCadastroUsuarios = () => {
    window.location.href = '/Cadastrousuarios';
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = usuarios.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(usuarios.length / usersPerPage);

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

  const DeleteModal = ({ show, handleClose }) => {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <p>Deseja realmente excluir a categoria?</p>
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
      <h2 className="titulo-principal">Tabela de Usuários</h2>
      <Button onClick={redirecionarParaCadastroUsuarios} className="botao-cadastrar">
        Cadastrar Usuário
      </Button>

      <Table striped bordered hover className="usuario-table">
        <thead className="usuario-table-header">
          <tr className="tr-color">
            <th>#</th>
            <th>Nome Completo</th>
            <th>CPF</th>
            <th>Telefone</th>
            <th>Senha</th>
            <th>Email</th>
            <th>Ação Deletar</th>
            <th>Ação Editar</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((usuario, index) => (
            <tr key={index}>
              <td>{index + indexOfFirstUser + 1}</td>
              <td>{usuario.nomecompleto}</td>
              <td>{usuario.cpf}</td>
              <td>{usuario.telefone}</td>
              <td>{usuario.senha}</td>
              <td>{usuario.email}</td>
              <td>
                <Button
                  variant="danger"
                  className="delete"
                  type="button"
                  onClick={() => handleDelete(usuario._id)}
                >
                  DELETAR
                </Button>
              </td>
              <td>
                <Button
                  className="update"
                  type="button"
                  onClick={() => (window.location.href = '/Cadastrousuarios/' + usuario._id)}
                >
                  EDITAR
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
          Tabela Anterior
        </Button>
        <Button
          variant="secondary"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          Próxima Tabela
        </Button>
      </div>

      <ToastContainer />
      <DeleteModal show={showDeleteModal} handleClose={() => setShowDeleteModal(false)} />
    </div>
  );
};

export default Tabelausuarios;
