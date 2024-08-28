import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import { Col, Form, Row, Button } from 'react-bootstrap';
import Select from 'react-select';

const Cadastroorcamento = () => {
  const navigate = useNavigate();

  const [tituloOrcamento, setTituloOrcamento] = useState("");
  const [custoAlimentacao, setCustoAlimentacao] = useState(0);
  const [custoAtividades, setCustoAtividades] = useState(0);
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
      localId: selectedLocal?.value, // ID do local selecionado
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
        navigate('/Tabelaorcamento');
      })
      .catch((error) => {
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
    <div>
      <h1 className='titulo-principal'>Orçamento da Experiência de Viagem</h1>
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

        <Form.Group as={Row} className="mb-3" controlId="formTituloOrcamento">
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

        <Button type="button" onClick={handleOnClickSalvar}>
          Salvar
        </Button>
        &nbsp;

        <Button
          variant="dark"
          className='voltar'
          type='button'
          onClick={() => window.location.href = '/Tabelaorcamento/'}
        >
          Voltar
        </Button>
        <ToastContainer />
      </Form>
    </div>
  );
};

export default Cadastroorcamento;
