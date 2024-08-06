import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import { Col, Form, Row, Button } from 'react-bootstrap';
import InputMask from "react-input-mask";

const Cadastroorcamento = () => {
  const navigate = useNavigate();

  const [nomeLocal, setNomeLocal] = useState("");
  const [descricao, setDescricao] = useState("");
  const [fotodolocal, setFotodoLocal] = useState("");
  const [avaliacao, setAvaliacao] = useState("");

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:9000/getCadastrolocaisFromId/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((data) => {
          setNomeLocal(data.nomedolocal);
          setDescricao(data.descricao);
          setFotodoLocal(data.fotodolocal);
          setAvaliacao(data.avaliacao);
        })
        .catch((error) => {
          console.error("Erro ao carregar dados do usuário:", error);
        });
    }
  }, [id]);

  const handleChangeNomeLocal = (event) => {
    setNomeLocal(event.target.value);
  };

  const handleChangeDescricao = (event) => {
    setDescricao(event.target.value);
  };

  const handleChangeFotodoLocal = (event) => {
    setFotodoLocal(event.target.value);
  };

  const handleChangeAvaliacao = (event) => {
    setAvaliacao(event.target.value);
  };


  const handleOnClickSalvar = () => {
    const dados = {
      nomeLocal,
      descricao,
      fotodolocal,
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

    fetch(`http://localhost:9000/Cadastroorcamento${id ? `/${id}` : ""}`, configuracaoEnvio)
      .then((response) => response.json())
      .then((data) => {
        console.log("Dados salvos:", data);
        localStorage.setItem("notificacao", "true");
        navigate('/Tabelausuarios');
      })
      .catch((error) => {
        console.error("Erro ao salvar dados:", error);
      });
  };

  return (
    <div>
      <h1>Orçamento dos locais visitados</h1>
      <Form>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Nome do Local:
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" placeholder="Seu nome do local" name="nome" value={nomeLocal} onChange={handleChangeNomeLocal} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Descricao:
          </Form.Label>
          <Col sm="10">
            <InputMask className="estilizacaoInputText" placeholder="000.000.000-00" mask="999.999.999-99" value={descricao} onChange={handleChangeDescricao} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Foto do local:
          </Form.Label>
          <Col sm="10">
          <Form.Control type="text" placeholder="Seu sexo" name="nome" value={fotodolocal} onChange={handleChangeFotodoLocal} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            avaliacao:
          </Form.Label>
          <Col sm="10">
            <InputMask className="estilizacaoInputText" placeholder="99999-9999" mask="99999-9999" value={avaliacao} onChange={handleChangeAvaliacao} />
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
          onClick={() => window.location.href = '/Tabelausuarios/'}
        >
          Voltar
        </Button>
        <ToastContainer />
      </Form>
    </div>
  );
};

export default Cadastroorcamento;
