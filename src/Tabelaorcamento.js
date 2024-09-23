import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Modal, Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import "./App.css";
import "./Tabela.css";
import { Trash, Pencil, ArrowRight, ArrowLeft } from 'react-bootstrap-icons';

import { useParams } from 'react-router-dom';

const Tabelaorcamento = () => {
  const navigate = useNavigate();

  const { localId } = useParams();

  const notifyCadastro = () => toast("Orçamento salvo com sucesso!");

  const [orcamentos, setOrcamentos] = useState([]);
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


  const fetchOrcamentos = async () => {
    try {
      const response = await fetch('http://localhost:9000/tabelaorcamento');
      const data = await response.json();
      setOrcamentos(data);
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
    fetchOrcamentos();
  }, []);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orcamentoIdToDelete, setOrcamentoIdToDelete] = useState('');

  const handleDelete = async (orcamentoId) => {
    setShowDeleteModal(true);
    setOrcamentoIdToDelete(orcamentoId);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await fetch(`http://localhost:9000/tabelaorcamento/${orcamentoIdToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setOrcamentos(orcamentos.filter(orcamentos => orcamentos._id !== orcamentoIdToDelete));
      setShowDeleteModal(false);
      toast("Orçamento deletado com sucesso!");
    } catch (error) {
      console.error('Erro durante a exclusão', error);
    }
  };

  const redirecionarParaCadastroOrcamento = () => {
    navigate(`/Cadastroorcamento/${localId}`); // Usando crases para interpolar a variável

  };

  const redirecionarParaTabelalocais = () => {
    navigate('/Tabelalocais');
  };


  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = orcamentos.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(orcamentos.length / usersPerPage);

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
    fetchOrcamentoPorLocal(localId);  // Chama a função de buscar fotos com o localId
  }, [localId]);

  const fetchOrcamentoPorLocal = async (localId) => {
    try {
      const response = await fetch(`http://localhost:9000/tabelaorcamento?localId=${localId}`);  // Passa o localId na query string
      const data = await response.json();
      setOrcamentos(data);
    } catch (error) {
      console.error(error);
    }
  };




  const DeleteModal = ({ show, handleClose }) => (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Exclusão</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <p>Deseja realmente excluir o orçamento?</p>
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

  return (
    <div className="table-container">
      <Button onClick={redirecionarParaTabelalocais} className="botao-tabela-voltar">Voltar para Locais</Button>

      <h2 className='titulo-principal'>Orçamentos</h2>
      <Button onClick={redirecionarParaCadastroOrcamento} className="botao-cadastrar">Cadastrar Orçamento</Button>
      <Table striped bordered hover className="usuario-table">
        <thead className="usuario-table-header">
          <tr className="tr-color">
            <th>#</th>
            <th>Local</th>
            <th>Título do Orçamento</th>
            <th>Custo Alimentação</th>
            <th>Custo Atividades</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((orcamento, index) => (
            <tr key={index}>
              <td>{index + indexOfFirstUser + 1}</td>
              <td>{orcamento.localInfo || 'Nome não disponível'}</td>
              <td>{orcamento.tituloOrcamento}</td>
              <td>{orcamento.custoAlimentacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              <td>{orcamento.custoAtividades.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              <td>
                <Button
                  variant="danger"
                  className='delete'
                  type='button'
                  onClick={() => handleDelete(orcamento._id)}
                >
                  <Trash />
                </Button>
                <Button
                  className='update'
                  type='button'
                  onClick={() => navigate(`/Cadastroorcamento/${localId}/${orcamento._id}`)}
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

export default Tabelaorcamento;
