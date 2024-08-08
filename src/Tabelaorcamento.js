// Importa as funções useState e useEffect do React
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Modal, Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom'; // Assumindo que você está usando react-router-dom para navegação

// Define o componente funcional Tabelausuarios
const Tabelaorcamento = () => {
  const navigate = useNavigate();


  const notifyDelete = () => toast("Usuário deletado com sucesso!");
  const notifyCadastro = () => toast("Usuário salvo com sucesso!");

  // const notify = () => toast("Usuário salvo com sucesso!");

  // Define um estado 'usuarios' usando o hook useState
  // O estado 'usuarios' é inicializado como um array vazio
  const [usuarios, setUsuarios] = useState([]);

  // Função assíncrona que busca os usuários do servidor
  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:9000/tabelaorcamento');
      // Faz uma requisição para 'http://localhost:9000/tabela' usando fetch API
      const data = await response.json();
      // Extrai os dados JSON da resposta
      setUsuarios(data);
      // Atualiza o estado 'usuarios' com os dados obtidos do servidor
    } catch (error) {
      console.error(error);
      // Se ocorrer um erro, ele será registrado no console
    }
  };

  // Hook useEffect que executa a função fetchUsuarios quando o componente é montado
  useEffect(() => {
    // if existir o localStorage x emita o notify
    // depois de emitir, limpe Ele 
    if (localStorage.getItem("notificacao") === "true") {

      localStorage.setItem("notificacao", null);

      setTimeout(() => {

        notifyCadastro();
      }, 500);

    }

    fetchUsuarios();
    // Chama a função fetchUsuarios quando o componente é montado
  }, []);

  // Função para lidar com a exclusão de um usuário

  // Estado para controlar o modal de confirmação de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Estado para armazenar o ID da categoria a ser excluída
  const [usuariosIdToDelete, setUsuariosIdToDelete] = useState('');

  // Função para lidar com a exclusão de uma categoria
  const handleDelete = async (usuarioId) => {
    // Exibe o modal de confirmação
    setShowDeleteModal(true);
    setUsuariosIdToDelete(usuarioId);
  };

  // Função para confirmar a exclusão da categoria
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
    window.location.href = '/Cadastrousuarios'; // Redireciona para a página de cadastro de usuários
  };


  // Modal de confirmação de exclusão
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

  //Retorna a estrutura JSX do componente Tabela
  return (
    <div>
      <h2>Tabela de Orçamento</h2>
      <Button onClick={redirecionarParaCadastroUsuarios}>Cadastrar Usuário</Button>

      <Table striped bordered hover >
        <thead>
          <tr>
            <th>#</th>
            <th>Nome Completo</th>
            <th>CPF</th>
            <th>Data de Nascimento</th>
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
              <td>{usuario.datanascimento}</td>
              <td>{usuario.telefone}</td>
              <td>{usuario.senha}</td>
              <td>{usuario.email}</td>

              {/* Botão para excluir um usuário */}
              <td>
                <Button
                  variant="danger"
                  className='delete'
                  type='button'
                  onClick={() => handleDelete(usuario._id)}
                >DELETAR
                </Button>
              </td>

              {/* Botão para editar um usuário */}

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
export default Tabelaorcamento;
