import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import { Col, Form, Row, Button } from 'react-bootstrap';
import Select from 'react-select';
import './Cadastros.css';



const Cadastromensagens = () => {
  const navigate = useNavigate();

  const [tituloMensagem, setTituloMensagem] = useState("");
  const [conteudoMensagem, setConteudoMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");
  const [avaliacao, setAvaliacao] = useState("");
  const [locais, setLocais] = useState([]);
  const [selectedLocal, setSelectedLocal] = useState(null);

  const [tokenValido, setTokenValido] = useState(false);

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
      localId: selectedLocal?.value, // ID do local selecionado
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

        // Redireciona para a página com os dados salvos usando o ID retornado
        const localId = data.localId || selectedLocal?.value;
        navigate(`/Tabelamensagens/${localId}`);
      })
      .catch(error => {
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
  <div className="form-geral">
    <h1 className='titulo-principal'>Cadastrar Experiência da Viagem</h1>
    <Form className="form-container">
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
