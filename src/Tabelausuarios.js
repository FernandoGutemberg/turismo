// Importa as funções useState e useEffect do React
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Modal, Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';


const Tabelausuarios = () => {
  const navigate = useNavigate();


  const notifyDelete = () => toast("Usuário deletado com sucesso!");
  const notifyCadastro = () => toast("Usuário salvo com sucesso!");

  const [usuarios, setUsuarios] = useState([]);

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
    <div>
      <h2>Tabela de Usuários</h2>
      <Button onClick={redirecionarParaCadastroUsuarios}>Cadastrar Usuário</Button>

      <Table striped bordered hover >
        <thead>
          <tr>
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

          {usuarios.map((usuario, index) => (
            <tr key={index}>
              <td>{index}</td>
              <td>{usuario.nomecompleto}</td>
              <td>{usuario.cpf}</td>
              <td>{usuario.telefone}</td>
              <td>{usuario.senha}</td>
              <td>{usuario.email}</td>

              <td>
                <Button
                  variant="danger"
                  className='delete'
                  type='button'
                  onClick={() => handleDelete(usuario._id)}
                >DELETAR
                </Button>
              </td>

              <td>
                <Button
                  className='update'
                  type='button'
                  onClick={() => window.location.href = '/Cadastrousuarios/' + usuario._id}
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
export default Tabelausuarios;
