import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Modal, Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

const Tabelaorcamento = () => {
  const navigate = useNavigate();
  const notifyDelete = () => toast("Orçamento deletado com sucesso!");
  const notifyCadastro = () => toast("Orçamento salvo com sucesso!");

  const [orcamentos, setOrcamentos] = useState([]);

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
        body: JSON.stringify({}),
      });
      fetchOrcamentos();
      setShowDeleteModal(false);
      notifyDelete();
    } catch (error) {
      console.error('Erro durante a exclusão', error);
    }
  };

  const redirecionarParaCadastroOrcamento = () => {
    window.location.href = '/Cadastroorcamento';
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
    <div>
      <h2>Tabela de Orçamento</h2>
      <Button onClick={redirecionarParaCadastroOrcamento}>Cadastrar Orçamento</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Título do Orçamento</th>
            <th>Data da Viagem</th>
            <th>Moeda</th>
            <th>Custo Transporte</th>
            <th>Custo Hospedagem</th>
            <th>Custo Alimentação</th>
            <th>Custo Atividades</th>
            <th>Outros Custos</th>
            <th>Observação</th>
            <th>Ação Deletar</th>
            <th>Ação Editar</th>
          </tr>
        </thead>
        <tbody>
          {orcamentos.map((orcamento, index) => (
            <tr key={index}>
              <td>{index}</td>
              <td>{orcamento.tituloOrcamento}</td>
              <td>{orcamento.dataViagem}</td>
              <td>{orcamento.moeda}</td>
              <td>{orcamento.custoTransporte}</td>
              <td>{orcamento.custoHospedagem}</td>
              <td>{orcamento.custoAlimentacao}</td>
              <td>{orcamento.custoAtividades}</td>
              <td>{orcamento.outrosCustos}</td>
              <td>{orcamento.observacao}</td>
              <td>
                <Button
                  variant="danger"
                  className='delete'
                  type='button'
                  onClick={() => handleDelete(orcamento._id)}
                >
                  DELETAR
                </Button>
              </td>
              <td>
                <Button
                  className='update'
                  type='button'
                  onClick={() => window.location.href = '/Cadastroorcamento/' + orcamento._id}
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

export default Tabelaorcamento;
