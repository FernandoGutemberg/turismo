import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import { Col, Form, Row, Button } from 'react-bootstrap';

const Cadastrofotolocais = () => {
  const navigate = useNavigate();

  const [uploadfoto, setUploadFoto] = useState("");
  const [local, setLocal] = useState("");
  const [descricao, setDescricao] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [adicionadopor, setAdicionadoPor] = useState("");
  const [criadoem, setCriadoEm] = useState("");

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:9000/getCadastrofotolocaisFromId/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((data) => {
          setUploadFoto(data.uploadfoto);
          setLocal(data.local);
          setDescricao(data.descricao);
          setLocalizacao(data.localizacao);
          setAdicionadoPor(data.adicionadopor);
          setCriadoEm(data.criadoem);

        })
        .catch((error) => {
          console.error("Erro ao carregar dados do usuário:", error);
        });
    }
  }, [id]);

  const handleChangeUploadFoto = (event) => {
    setUploadFoto(event.target.value);
  };

  const handleChangeLocal = (event) => {
    setLocal(event.target.value);
  };

  const handleChangeDescricao = (event) => {
    setDescricao(event.target.value);
  };

  const handleChangeLocalizacao = (event) => {
    setLocalizacao(event.target.value);
  };

  const handleChangeAdicionadoPor = (event) => {
    setAdicionadoPor(event.target.value);
  };

  const handleChangeCriadoEm = (event) => {
    setCriadoEm(event.target.value);
  };

  const handleOnClickSalvar = () => {
    const dados = {
      uploadfoto,
      local,
      descricao,
      localizacao,
      adicionadopor,
      criadoem     

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

    fetch(`http://localhost:9000/Cadastrofotolocais${id ? `/${id}` : ""}`, configuracaoEnvio)
      .then((response) => response.json())
      .then((data) => {
        console.log("Dados salvos:", data);
        localStorage.setItem("notificacao", "true");
        navigate('/Tabelafotos');
      })
      .catch((error) => {
        console.error("Erro ao salvar dados:", error);
      });
  };

  return (
    <div>
      
      <h1>Foto dos locais</h1>
      
      <Form>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Inserir Foto(s):
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" placeholder="Foto do local" name="nome" value={uploadfoto} onChange={handleChangeUploadFoto} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Local:
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" placeholder="Foto do local" name="nome" value={local} onChange={handleChangeLocal} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Foto do local:
          </Form.Label>
          <Col sm="10">
          <Form.Control type="text" placeholder="Foto do local" name="nome" value={descricao} onChange={handleChangeDescricao} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Localizacao:
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" placeholder="Localização" name="nome" value={localizacao} onChange={handleChangeLocalizacao} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Adicionado Por:
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" placeholder="Adicionado Por" name="nome" value={adicionadopor} onChange={handleChangeAdicionadoPor} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Criado em:
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" placeholder="Adicione o dia que foi criado" name="nome" value={criadoem} onChange={handleChangeCriadoEm} />
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
          onClick={() => window.location.href = '/Tabelafotos/'}
        >
          Voltar
        </Button>
        <ToastContainer />
      </Form>
    </div>
  );
};

export default Cadastrofotolocais;
