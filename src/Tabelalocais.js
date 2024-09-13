import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Modal, Button } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import "./Tabela.css";
import { Trash, Pencil, Camera, Calculator, Envelope } from 'react-bootstrap-icons';


const Tabelalocais = () => {
  const navigate = useNavigate();

  const notifyDelete = () => toast("Local deletado com sucesso!");
  const notifyCadastro = () => toast("Local salvo com sucesso!");

  const [locais, setLocais] = useState([]);
  

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

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = locais.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(locais.length / usersPerPage);

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



  // Redireciona para a página de cadastro de locais
  const redirecionarParaCadastroLocais = () => {
    navigate('/Cadastrolocais');
  };

  const handleNavigateToFotos = (localId) => {
    navigate(`/Tabelafotos/${localId}`);
  };

  return (
    <div className="table-container">
      <h2 className='titulo-principal'>Locais</h2>
      <Button onClick={redirecionarParaCadastroLocais} className="botao-cadastrar">Cadastrar Local</Button>

      <Table striped bordered hover className="usuario-table">
        <thead className="usuario-table-header">
          <tr className="tr-color">
            <th>#</th>
            <th>País</th>
            <th>Estado</th>
            <th>Cidade</th>
            <th>Foto</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {locais.map((local, index) => (
            <tr key={index}>
              <td>{index + indexOfFirstUser + 1}</td>
              <td>{local.paisLocal}</td>
              <td>{local.estado}</td>
              <td>{local.cidade}</td>
              <td>
                <img src={local.foto} alt={`Foto de ${local.cidade}`} width="200" />
              </td>
              <td>
                <Button
                  variant="danger"
                  className='delete'
                  type='button'
                  onClick={() => handleDelete(local._id)}
                >
                  <Trash />
                </Button>


                <Button
                  className='update'
                  type='button'
                  onClick={() => window.location.href = '/Cadastrolocais/' + local._id}
                >
                  <Pencil />


                </Button>

                <Button
                  variant="warning"
                  className='delete'
                  type='button'
                  onClick={() => handleNavigateToFotos(local._id)}
                >
                  <Camera />
                </Button>

                <Button
                  variant="warning"
                  className='delete'
                  type='button'
                >
                  <Calculator />
                </Button>

                <Button
                  variant="warning"
                  className='delete'
                  type='button'
                >
                  <Envelope />
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

export default Tabelalocais;
