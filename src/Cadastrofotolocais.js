import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import { Col, Form, Row, Button } from 'react-bootstrap';
import './Cadastros.css';

const Cadastrofotolocais = () => {
  const navigate = useNavigate();
  
  const [uploadfoto, setUploadFoto] = useState("");
  const [descricao, setDescricao] = useState("");
  const [locais, setLocais] = useState([]);
  const [selectedLocal, setSelectedLocal] = useState(null);

  const [tokenValido, setTokenValido] = useState(false);

  // MUDANDO AQUI:
  // Captura de localId e id da URL
  const { localId, id } = useParams();  // Captura ambos os parâmetros

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
    fetch('http://localhost:9000/Tabelalocais')
      .then(response => response.json())
      .then(data => {
        const options = data.map(local => ({
          value: local._id,
          label: `${local.paisLocal} - ${local.local}`
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
          console.error("Erro ao carregar dados da foto:", error);
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

  // MUDANDO AQUI:

  const handleOnClickSalvar = () => {
    const dados = {
      localId: localId || selectedLocal?.value,  // Usa localId da URL ou selecionado
      uploadfoto: uploadfoto,
      descricao,
    };

    const configuracaoEnvio = {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
      method: id ? "PATCH" : "POST", // Define o método HTTP
    };

    fetch(`http://localhost:9000/Cadastrofotolocais${id ? `/${id}` : ""}`, configuracaoEnvio)
      .then(response => response.json())
      .then(data => {
        console.log("Dados salvos:", data);
        localStorage.setItem("notificacao", "true");

        // Redireciona para a página com os dados salvos usando o localId
        const redirecionarId = data.localId || localId || selectedLocal?.value;
        navigate(`/Tabelafotos/${redirecionarId}`);
      })
      .catch(error => {
        console.error("Erro ao salvar dados:", error);
      });
  };

  return (
    <div className="form-geral">
      <h1 className='titulo-principal'>Cadastrar foto dos locais</h1>

      {/* // MUDANDO AQUI: */}

      <Form className="form-container">
        <Form.Group as={Row} className="mb-3" controlId="formFile">
          {/* Campo hidden com o localId */}
          <input type="hidden" name="localId" value={localId} />
          <Form.Label column sm="2">Inserir Foto(s):</Form.Label>
          <Col sm="10">
            <Form.Control type="file" name="foto" onChange={handleChangeUploadFoto} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Descrição da foto:
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              placeholder="Descrição da foto"
              name="descricao"
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
          onClick={() => navigate(`/Tabelafotos/${localId}`)} // Redireciona corretamente
        >
          Voltar
        </Button>
        <ToastContainer />
      </Form>
    </div>
  );
};

export default Cadastrofotolocais;
