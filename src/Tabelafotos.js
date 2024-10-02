import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Modal, Button } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import "./App.css";
import "./Tabela.css";
import { Trash, Pencil, ArrowRight, ArrowLeft, ArrowCounterclockwise } from 'react-bootstrap-icons';
import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';



import { useParams } from 'react-router-dom';

const Tabelafotos = () => {
  const navigate = useNavigate();

  const { localId } = useParams();

  const [fotos, setFotos] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fotoIdToDelete, setFotoIdToDelete] = useState('');

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
      // Atualiza o estado removendo a foto excluída
      setFotos(fotos.filter(foto => foto._id !== fotoIdToDelete));
      setShowDeleteModal(false);
      toast("Foto deletada com sucesso!");
    } catch (error) {
      console.error('Erro ao tentar deletar a foto', error);
    }
  };



  const redirecionarParaCadastroFotos = () => {
    navigate(`/Cadastrofotolocais/${localId}`); // Usando crases para interpolar a variável
  };

  const redirecionarParaTabelalocais = () => {
    navigate('/Tabelalocais');
  };


  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = fotos.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(fotos.length / usersPerPage);

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
    fetchFotosPorLocal(localId);  // Chama a função de buscar fotos com o localId
  }, [localId]);

  const fetchFotosPorLocal = async (localId) => {
    try {
      const response = await fetch(`http://localhost:9000/tabelafotos?localId=${localId}`);  // Passa o localId na query string
      const data = await response.json();
      setFotos(data);
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
        <p>Deseja realmente excluir esta foto?</p>
        <Button variant="danger" onClick={handleDeleteConfirmed}>Excluir</Button>
        <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
      </Modal.Body>
    </Modal>
  );

  return (
    <div className="table-container">
      <Button onClick={redirecionarParaTabelalocais} variant="secondary" className="botao-tabela-voltar">
      <ArrowCounterclockwise /> Locais
        </Button>

      <h2 className='titulo-principal'>Fotos</h2>
      <Button onClick={redirecionarParaCadastroFotos} className="botao-cadastrar">Cadastrar Foto</Button>
      <Table striped bordered hover className="usuario-table">
        <thead className="usuario-table-header">
          <tr className="tr-color">
            <th>#</th>
            <th>Local</th>
            <th>Foto do Local</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((foto, index) => (
            <tr key={index}>
              <td>{index + indexOfFirstUser + 1}</td>
              <td>{foto.localInfo || 'Nome não disponível'}</td>
              <td>
                <img
                  src={foto.uploadfoto}
                  alt="Foto do local"
                  style={{ width: "150px", height: "100px" }}
                />
              </td>
              <td>{foto.descricao}</td>
              <td>
                {/* Inserir os botões abaixo como icon */}
                <Button variant="danger" onClick={() => handleDelete(foto._id)}>
                  <Trash />

                  {/*  MUDANDO AQUI: */}

                </Button>
                <Button onClick={() => navigate(`/Cadastrofotolocais/${localId}/${foto._id}`)}>
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

export default Tabelafotos;
