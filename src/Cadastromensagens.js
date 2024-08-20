import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import { Col, Form, Row, Button } from 'react-bootstrap';
import Select from 'react-select';


const Cadastromensagens = () => {
  const navigate = useNavigate();

  const [tituloMensagem, setTituloMensagem] = useState("");
  const [conteudoMensagem, setConteudoMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");
  const [avaliacao, setAvaliacao] = useState("");

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:9000/getCadastromensagensFromId/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((data) => {
          setTituloMensagem(data.tituloMensagem);
          setConteudoMensagem(data.conteudoMensagem);
          setTipoMensagem(data.tipoMensagem);
          setAvaliacao(data.avaliacao);
        })
        .catch((error) => {
          console.error("Erro ao carregar dados da mensagem:", error);
        });
    }
  }, [id]);

  const handleOnClickSalvar = () => {
    const dados = {
      tituloMensagem,
      conteudoMensagem,
      tipoMensagem,
      avaliacao,
    };

    const configuracaoEnvio = {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    };

    if (!id) {
      configuracaoEnvio.method = "POST";
    } else {
      configuracaoEnvio.method = "PATCH";
    }

    fetch(`http://localhost:9000/Cadastromensagens${id ? `/${id}` : ""}`, configuracaoEnvio)
      .then((response) => response.json())
      .then((data) => {
        console.log("Dados salvos:", data);
        localStorage.setItem("notificacao", "true");
        navigate('/Tabelamensagens');
      })
      .catch((error) => {
        console.error("Erro ao salvar dados:", error);
      });
  };

  const handleChangeTituloMensagem = (event) => {
    setTituloMensagem(event.target.value);
  };

  const handleChangeConteudoMensagem = (event) => {
    setConteudoMensagem(event.target.value);
  };

  const handleChangeTipoMensagem = (event) => {
    setTipoMensagem(event.target.value);
  };


  const handleChangeAvaliacao = (event) => {
    setAvaliacao(event.target.value);
  };


  return (
    <div>
      <h1>Cadastrar Experiência da Viagem</h1>
      <Form>
        <Form.Group as={Row} className="mb-3" controlId="formLocationSelect">
          <Form.Label column sm="2">
            Selecionar Local:
          </Form.Label>
          <Col sm="10">
            <Select
              // Se houver uma lógica específica para o select, deve ser implementada aqui
              placeholder="Selecione um Local"
              className="react-select-container"
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">
            Título da Mensagem:
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" placeholder="Título da mensagem" value={tituloMensagem} onChange={handleChangeTituloMensagem} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">
            Conteúdo da Mensagem:
          </Form.Label>
          <Col sm="10">
            <Form.Control as="textarea" rows={3} placeholder="Feedback sobre um hotel, dica de restaurante" value={conteudoMensagem} onChange={handleChangeConteudoMensagem} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">
            Tipo de Mensagem:
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" placeholder="Pergunta - Dica - Comentário - Crítica" value={tipoMensagem} onChange={handleChangeTipoMensagem} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">
            Avaliação:
          </Form.Label>
          <Col sm="10">
            <Form.Control type="number" placeholder="Avaliação de 1 a 5" value={avaliacao} onChange={handleChangeAvaliacao} />
          </Col>
        </Form.Group>


        <Button type="button" onClick={handleOnClickSalvar}>
          Salvar
        </Button>
        &nbsp;

        <Button
          variant="dark"
          className='voltar'
          type='button'
          onClick={() => window.location.href = '/Tabelamensagens/'}
        >
          Voltar
        </Button>
        <ToastContainer />
      </Form>
    </div>
  );
};

export default Cadastromensagens;
