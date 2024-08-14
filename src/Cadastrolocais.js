import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import { Col, Form, Row, Button } from 'react-bootstrap';

const Cadastrolocais = () => {
  const navigate = useNavigate();

  const [paisLocal, setPaisLocal] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [foto, setFoto] = useState("");
  const [avaliacao, setAvaliacao] = useState("");
  const [descricao, setDescricao] = useState("");

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
          setPaisLocal(data.paislocal);
          setEstado(data.estado);
          setCidade(data.cidade);
          setBairro(data.bairro);
          setFoto(data.foto);
          setAvaliacao(data.avaliacao);
          setDescricao(data.descricao);

        })
        .catch((error) => {
          console.error("Erro ao carregar dados dos locais:", error);
        });
    }
  }, [id]);

  const handleChangePaisLocal = (event) => {
    setPaisLocal(event.target.value);
  };

  const handleChangeEstado = (event) => {
    setEstado(event.target.value);
  };

  const handleChangeCidade = (event) => {
    setCidade(event.target.value);
  };

  const handleChangeBairro = (event) => {
    setBairro(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFoto(file); // Armazena o arquivo no estado
  };


  const handleChangeAvaliacao = (event) => {
    setAvaliacao(event.target.value);
  };

  const handleChangeDescricao = (event) => {
    setDescricao(event.target.value);
  };


  const handleOnClickSalvar = () => {
    const dados = {
      paisLocal,
      estado,
      cidade,
      bairro,
      foto,
      avaliacao,
      descricao,
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

    fetch(`http://localhost:9000/Cadastrolocais${id ? `/${id}` : ""}`, configuracaoEnvio)
      .then((response) => response.json())
      .then((data) => {
        console.log("Dados salvos:", data);
        localStorage.setItem("notificacao", "true");
        navigate('/Tabelalocais');
      })
      .catch((error) => {
        console.error("Erro ao salvar dados:", error);
      });
  };
 

  return (
    <div>
      <h1>Cadastro dos Locais de Turismo</h1>

      <Form>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            País:
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" placeholder="Nome do País visitado" name="nome" value={paisLocal} onChange={handleChangePaisLocal} />
          </Col>
        </Form.Group>


        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Estado:
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" placeholder="Nome do Estado visitado" name="nome" value={estado} onChange={handleChangeEstado} />
          </Col>
        </Form.Group>


        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Cidade:
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" placeholder="Nome da cidade visitada" name="nome" value={cidade} onChange={handleChangeCidade} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Bairro:
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" placeholder="Nome do bairro visitado" name="nome" value={bairro} onChange={handleChangeBairro} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formFile">
          <Form.Label column sm="2">
            Foto do Local:
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="file"
              name="foto"
              onChange={handleFileChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Avaliação:
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" placeholder="Avaliação de 1 a 5" name="nome" value={avaliacao} onChange={handleChangeAvaliacao} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Descrição:
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" placeholder="Descrição ou experiência do local visitado" name="nome" value={descricao} onChange={handleChangeDescricao} />
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
          onClick={() => window.location.href = '/Tabelalocais/'}
        >
          Voltar
        </Button>
        <ToastContainer />
      </Form>
    </div>
  );
};

export default Cadastrolocais;
