import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import { Col, Form, Row, Button } from 'react-bootstrap';
import Select from 'react-select';

const Cadastrofotolocais = () => {
  const navigate = useNavigate();
  const [uploadfoto, setUploadFoto] = useState("");
  const [descricao, setDescricao] = useState("");

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
          setDescricao(data.descricao);
        })
        .catch((error) => {
          console.error("Erro ao carregar dados do usuário:", error);
        });
    }
  }, [id]);

  const handleChangeUploadFoto = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setUploadFoto(reader.result); // Converte a imagem para base64
    };
  };

  const handleChangeDescricao = (event) => {
    setDescricao(event.target.value);
  };

  const handleOnClickSalvar = () => {
    const dados = {
      uploadfoto: uploadfoto, // A imagem em base64
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
      <h1>Cadastrar foto dos locais</h1>

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

        <Form.Group as={Row} className="mb-3" controlId="formFile">
          <Form.Label column sm="2">
            Inserir Foto(s):
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="file"
              name="foto"
              onChange={handleChangeUploadFoto} // Não há valor controlado aqui
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Descrição da foto:
          </Form.Label>
          <Col sm="10">
            <Form.Control 
              type="text" 
              placeholder="Foto do local" 
              name="nome" 
              value={descricao} 
              onChange={handleChangeDescricao} 
            />
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
