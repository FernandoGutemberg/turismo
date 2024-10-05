import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import { Trash, Pencil, ArrowRight, ArrowLeft, ArrowCounterclockwise } from 'react-bootstrap-icons';
import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';
import { useParams } from 'react-router-dom';
import "./App.css";
import "./Tabela.css";

const Tabelafotos = () => {
  const navigate = useNavigate();
  const { localId } = useParams();

  const [fotos, setFotos] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fotoIdToDelete, setFotoIdToDelete] = useState('');
  const [tokenValido, setTokenValido] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

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

  useEffect(() => {
    fetchFotosPorLocal(localId);
  }, [localId]);

  const fetchFotosPorLocal = async (localId) => {
    try {
      const response = await fetch(`http://localhost:9000/tabelafotos?localId=${localId}`);
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
        headers: { 'Content-Type': 'application/json' },
      });
      setFotos(fotos.filter(foto => foto._id !== fotoIdToDelete));
      setShowDeleteModal(false);
      toast("Foto deletada com sucesso!");
    } catch (error) {
      console.error('Erro ao tentar deletar a foto', error);
    }
  };

  const redirecionarParaCadastroFotos = () => {
    navigate(`/Cadastrofotolocais/${localId}`);
  };

  const redirecionarParaTabelalocais = () => {
    navigate('/Tabelalocais');
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

  // Configuração do Carousel
  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 5 },
    desktop: { breakpoint: { max: 1024, min: 768 }, items: 3 },
    tablet: { breakpoint: { max: 768, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  return (
    <div className="table-container">
      <Button onClick={redirecionarParaTabelalocais} variant="secondary" className="botao-tabela-voltar">
        <ArrowCounterclockwise /> Locais
      </Button>

      <h2 className='titulo-principal'>Fotos</h2>
      <Button onClick={redirecionarParaCadastroFotos} className="botao-cadastrar">Cadastrar Foto</Button>

      {/* Implementação do Carousel */}
      <Carousel responsive={responsive} showDots={true}>
        {fotos.map((foto, index) => (
          <div key={index} className="carousel-item-custom">
            <img src={foto.uploadfoto} alt={`Foto ${index + 1}`} style={{ width: "100%", height: "300px", objectFit: "cover" }} />
            <div className="carousel-caption">
              <h5>{foto.localInfo || 'Nome não disponível'}</h5>
              <p>{foto.descricao}</p>
              <Button variant="danger" onClick={() => handleDelete(foto._id)}>
                <Trash />
              </Button>
              <Button onClick={() => navigate(`/Cadastrofotolocais/${localId}/${foto._id}`)}>
                <Pencil />
              </Button>
            </div>
          </div>
        ))}
      </Carousel>

      <ToastContainer />
      <DeleteModal show={showDeleteModal} handleClose={() => setShowDeleteModal(false)} />
    </div>
  );
};

export default Tabelafotos;
