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
  const [locais, setLocais] = useState([]);
  const [selectedLocal, setSelectedLocal] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    fetch('http://localhost:9000/Tabelalocais')
      .then(response => response.json())
      .then(data => {
        const options = data.map(local => ({
          value: local._id,
          label: `${local.paisLocal} - ${local.estado} - ${local.cidade}`
        }));
        setLocais(options);
      })
      .catch(error => console.error('Erro ao buscar locais:', error));
  }, []);

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
      localId: selectedLocal?.value, // ID do local selecionado
      uploadfoto: uploadfoto,
      descricao,
    };

    const configuracaoEnvio = {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    };

    configuracaoEnvio.method = id ? "PATCH" : "POST";

    fetch(`http://localhost:9000/Cadastrofotolocais${id ? `/${id}` : ""}`, configuracaoEnvio)
      .then(response => response.json())
      .then(data => {
        console.log("Dados salvos:", data);
        localStorage.setItem("notificacao", "true");
        navigate('/Tabelafotos');
      })
      .catch(error => {
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
              options={locais}
              onChange={(option) => setSelectedLocal(option)}
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
              onChange={handleChangeUploadFoto}
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
