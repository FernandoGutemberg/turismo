import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import { Trash, Pencil, ArrowCounterclockwise } from 'react-bootstrap-icons';
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
  const [selectedFoto, setSelectedFoto] = useState(null);
  const [tokenValido, setTokenValido] = useState(false);
  const [showModal, setShowModal] = useState(false);


  /*FLuxo do Código 
  /1. useEffect para verificar o Token:
  /Carregando o componente, o useEffect roda para verificar se o token de autenticação é válido. Isso é feito 
  através de uma requisição ao backend. Se o token for inválido ou não existir, o usuário é redirecionado para login
  */
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

  /* 2. Busca das Fotos por Local
  Outro useEffect é disparado para buscar as fotos associadas ao local atual (localId). Uma requisição é feita
  para buscar essas fotos do backend, e os dados retornados são salvos no estado "fotos".
   */
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

  const handleFotoClick = (foto) => {
    setSelectedFoto(foto);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFoto(null);
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

  //Configuração do Carousel
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

      {/* 3. Renderização do Carousel
      Após as fotos serem buscadas e armazenadas no estado fotos, o carroussel é renderizado com essas fotos
      O Carousel exibe as fotos como slides, com os detalhes da foto (nome e descrição) e os botões de ação.     
      */}


      {/* Ter fotos também em branco caso não tenha foto cadastrada.  */}

      <Carousel responsive={responsive} showDots={true}>
        {fotos.map((foto, index) => (
          <div key={index} className="carousel-item-custom">
            <img
              src={foto.uploadfoto}
              alt={`Foto ${index + 1}`}
              style={{ width: "100%", height: "300px", objectFit: "cover", cursor: 'pointer' }}
              onClick={() => handleFotoClick(foto)} //Aqui é para abrir a foto em tamanho maior
            />
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


      {selectedFoto && (
        <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
          <Modal.Body>
            <img
              src={selectedFoto.uploadfoto}
              alt="Foto do local"
              style={{ width: '100%', height: 'auto' }}
            />
          </Modal.Body>
        </Modal>
      )}

      <DeleteModal show={showDeleteModal} handleClose={() => setShowDeleteModal(false)} />
    </div>
  );
};

export default Tabelafotos;