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
  // State to hold the image as a base64 string
  const [fotoBase64, setFotoBase64] = useState("");

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
          setPaisLocal(data.paisLocal);
          setEstado(data.estado);
          setCidade(data.cidade);
          setFotoBase64(data.foto); // Assuming 'foto' is already stored as base64 in MongoDB

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


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);   

    reader.onloadend = () => {
      setFotoBase64(reader.result);
    };
  };



  const handleOnClickSalvar = () => {
    const dados = {
      paisLocal,
      estado,
      cidade,
      foto: fotoBase64, // Send the base64 string to the backend
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
      <h1 className='titulo-principal'>Cadastro dos Locais de Turistado</h1>

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
