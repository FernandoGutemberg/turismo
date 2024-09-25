import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import { Col, Form, Row, Button } from 'react-bootstrap';
import './Cadastros.css';


const Cadastroorcamento = () => {
  const navigate = useNavigate();

  const [tituloOrcamento, setTituloOrcamento] = useState("");
  const [custoAlimentacao, setCustoAlimentacao] = useState(0);
  const [custoAtividades, setCustoAtividades] = useState(0);
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



  const { localId, id } = useParams();  // Captura ambos os parâmetros

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
      fetch(`http://localhost:9000/getCadastroorcamentoFromId/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((data) => {
          setTituloOrcamento(data.tituloOrcamento);
          setCustoAlimentacao(data.custoAlimentacao);
          setCustoAtividades(data.custoAtividades);
        })
        .catch((error) => {
          console.error("Erro ao carregar dados do orçamento:", error);
        });
    }
  }, [id]);

  const handleOnClickSalvar = () => {
    const dados = {
      localId: localId || selectedLocal?.value,  // Usa localId da URL ou selecionado
      tituloOrcamento,
      custoAlimentacao: parseFloat(custoAlimentacao),
      custoAtividades: parseFloat(custoAtividades),
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


        // Redireciona para a página com os dados salvos usando o ID retornado
        const redirecionarId = data.localId || localId || selectedLocal?.value;
        navigate(`/Tabelaorcamento/${redirecionarId}`);
      })
      .catch(error => {
        console.error("Erro ao salvar dados:", error);
      });
  };


  const handleChangeTituloOrcamento = (event) => {
    setTituloOrcamento(event.target.value);
  };

  const handleChangeCustoAlimentacao = (event) => {
    setCustoAlimentacao(event.target.value);
  };

  const handleChangeCustoAtividades = (event) => {
    setCustoAtividades(event.target.value);
  };

  return (
    <div className="form-geral">
      <h1 className='titulo-principal'>Orçamento da Experiência de Viagem</h1>
      <Form className="form-container">

        <Form.Group as={Row} className="mb-3" controlId="formTituloOrcamento">
          <input type="hidden" name="localId" value={localId} />

          <Form.Label column sm="2">
            Título do Orçamento:
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              placeholder="Ex: Viagem para Paris - Novembro de 2024"
              value={tituloOrcamento}
              onChange={handleChangeTituloOrcamento}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formCustoAlimentacao">
          <Form.Label column sm="2">
            Custo Total Estimado de Alimentação:
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="number"
              placeholder="Valor estimado para alimentação"
              value={custoAlimentacao}
              onChange={handleChangeCustoAlimentacao}
              step="0.01"
              min="0"
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formCustoAtividades">
          <Form.Label column sm="2">
            Custo Total Estimado de Atividades/Turismo:
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="number"
              placeholder="Valor estimado para atividades e turismo"
              value={custoAtividades}
              onChange={handleChangeCustoAtividades}
              step="0.01"
              min="0"
            />
          </Col>
        </Form.Group>

        <Button
          variant="success"
          type="button"
          onClick={handleOnClickSalvar}>
          Salvar
        </Button>
        &nbsp;

        <Button
          variant="secondary"
          className='voltar'
          type='button'
          onClick={() => navigate(`/Tabelaorcamento/${localId}`)} // Redireciona corretamente
        >
          Voltar
        </Button>
        <ToastContainer />
      </Form>
    </div>
  );
};

export default Cadastroorcamento;
