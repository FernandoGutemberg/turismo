import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import { Col, Form, Row, Button } from 'react-bootstrap';

const Cadastromensagens = () => {
  const navigate = useNavigate();

  const [tituloMensagem, setTituloMensagem] = useState("");
  const [conteudoMensagem, setConteudoMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");
  const [anexos, setAnexos] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [avaliacao, setAvaliacao] = useState("");
  const [respostaComentarios, setRespostaComentarios] = useState("");

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
          setAnexos(data.anexos);
          setDataHora(data.dataHora);
          setAvaliacao(data.avaliacao);
          setRespostaComentarios(data.respostaComentarios);
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
      anexos,
      dataHora,
      avaliacao,
      respostaComentarios,
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

  const handleChangeAnexos = (event) => {
    setAnexos(event.target.value);
  };

  const handleChangeDataHora = (event) => {
    setDataHora(event.target.value);
  };

  const handleChangeAvaliacao = (event) => {
    setAvaliacao(event.target.value);
  };

  const handleChangeRespostaComentarios = (event) => {
    setRespostaComentarios(event.target.value);
  };

 
  return (
    <div>
      <h1>Cadastrar Mensagens</h1>
      <Form>
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
            <Form.Control as="textarea" rows={3} placeholder="Conteúdo da mensagem" value={conteudoMensagem} onChange={handleChangeConteudoMensagem} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">
            Tipo de Mensagem:
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" placeholder="Tipo de mensagem" value={tipoMensagem} onChange={handleChangeTipoMensagem} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">
            Anexos:
          </Form.Label>
          <Col sm="10">
            <Form.Control type="file" multiple onChange={handleChangeAnexos} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">
            Data e Hora:
          </Form.Label>
          <Col sm="10">
            <Form.Control type="datetime-local" value={dataHora} onChange={handleChangeDataHora} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">
            Avaliação:
          </Form.Label>
          <Col sm="10">
            <Form.Control type="number" placeholder="Avaliação" value={avaliacao} onChange={handleChangeAvaliacao} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">
            Resposta/Comentários:
          </Form.Label>
          <Col sm="10">
            <Form.Control as="textarea" rows={3} placeholder="Resposta/Comentários" value={respostaComentarios} onChange={handleChangeRespostaComentarios} />
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
