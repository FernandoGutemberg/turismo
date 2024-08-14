import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import { Col, Form, Row, Button } from 'react-bootstrap';

const Cadastroorcamento = () => {
  const navigate = useNavigate();

  const [tituloOrcamento, setTituloOrcamento] = useState("");
  const [dataViagem, setDataViagem] = useState("");
  const [moeda, setMoeda] = useState("");
  const [custoTransporte, setCustoTransporte] = useState("");
  const [custoHospedagem, setCustoHospedagem] = useState("");
  const [custoAlimentacao, setCustoAlimentacao] = useState("");
  const [custoAtividades, setCustoAtividades] = useState("");
  const [outrosCustos, setOutrosCustos] = useState("");
  const [observacao, setObservacao] = useState("");

  const { id } = useParams();

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
          setDataViagem(data.dataViagem);
          setMoeda(data.moeda);
          setCustoTransporte(data.custoTransporte);
          setCustoHospedagem(data.custoHospedagem);
          setCustoAlimentacao(data.custoAlimentacao);
          setCustoAtividades(data.custoAtividades);
          setOutrosCustos(data.outrosCustos);
          setObservacao(data.observacao);
        })
        .catch((error) => {
          console.error("Erro ao carregar dados do orçamento:", error);
        });
    }
  }, [id]);


  const handleOnClickSalvar = () => {
    const dados = {
      tituloOrcamento,
      dataViagem,
      moeda,
      custoTransporte,
      custoHospedagem,
      custoAlimentacao,
      custoAtividades,
      outrosCustos,
      observacao,
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

  const handleChangeDataViagem = (event) => {
    setDataViagem(event.target.value);
  };

  const handleChangeMoeda = (event) => {
    setMoeda(event.target.value);
  };

  const handleChangeCustoTransporte = (event) => {
    setCustoTransporte(event.target.value);
  };

  const handleChangeCustoHospedagem = (event) => {
    setCustoHospedagem(event.target.value);
  };

  const handleChangeCustoAlimentacao = (event) => {
    setCustoAlimentacao(event.target.value);
  };

  const handleChangeCustoAtividades = (event) => {
    setCustoAtividades(event.target.value);
  };

  const handleChangeOutrosCustos = (event) => {
    setOutrosCustos(event.target.value);
  };

  const handleChangsetObservacao = (event) => {
    setObservacao(event.target.value);
  };

  return (
    <div>
      <h1>Orçamento de Viagem</h1>
      <Form>
        <Form.Group as={Row} className="mb-3" controlId="formTituloOrcamento">
          <Form.Label column sm="2">
            Título do Orçamento:
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              placeholder="Viagem para Paris - Verão 2024"
              value={tituloOrcamento}
              onChange={handleChangeTituloOrcamento}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formDataViagem">
          <Form.Label column sm="2">
            Data da Viagem:
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              placeholder="Data de início e término da viagem"
              value={dataViagem}
              onChange={handleChangeDataViagem}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formMoeda">
          <Form.Label column sm="2">
            Moeda:
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              placeholder="USD, EUR, BRL"
              value={moeda}
              onChange={handleChangeMoeda}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formCustoTransporte">
          <Form.Label column sm="2">
            Custo Total Estimado de Transporte:
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              placeholder="Valor estimado para transporte"
              value={custoTransporte}
              onChange={handleChangeCustoTransporte}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formCustoHospedagem">
          <Form.Label column sm="2">
            Custo Total Estimado de Hospedagem:
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              placeholder="Valor estimado para hospedagem"
              value={custoHospedagem}
              onChange={handleChangeCustoHospedagem}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formCustoAlimentacao">
          <Form.Label column sm="2">
            Custo Total Estimado de Alimentação:
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              placeholder="Valor estimado para alimentação"
              value={custoAlimentacao}
              onChange={handleChangeCustoAlimentacao}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formCustoAtividades">
          <Form.Label column sm="2">
            Custo Total Estimado de Atividades/Turismo:
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              placeholder="Valor estimado para atividades e turismo"
              value={custoAtividades}
              onChange={handleChangeCustoAtividades}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formOutrosCustos">
          <Form.Label column sm="2">
            Outros Custos:
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              placeholder="Outros custos estimados"
              value={outrosCustos}
              onChange={handleChangeOutrosCustos}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formObservacao">
          <Form.Label column sm="2">
            Observação:
          </Form.Label>
          <Col sm="10">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Observações adicionais sobre o orçamento"
              value={observacao}
              onChange={handleChangsetObservacao}
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
