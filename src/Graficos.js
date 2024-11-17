import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Graficos = () => {
  const [dadosLocais, setDadosLocais] = useState([]);
  const [dadosOrcamentos, setDadosOrcamento] = useState([]);
  const [dadosMensagens, setDadosMensagens] = useState([]);


  useEffect(() => {
    const buscarDados = async () => {
      try {
        // Buscando os Dados de Locais
        const respostaLocais = await fetch("http://localhost:9000/Tabelalocais");
        if (!respostaLocais.ok) throw new Error("Erro ao buscar dados de Locais");
        const locais = await respostaLocais.json();

        // Formatando os dados de Locais
        const contagemMensalLocais = {};
        locais.array.forEach((local) => {
          const data = new Data(local.dataCadastro);
          const anoMes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
          contagemMensalLocais[anoMes] = (contagemMensalLocais[anoMes] || 0) + 1;          
        });

        setDadosLocais(
          Object.entries(contagemMensalLocais).map(([mes, total]) => ({ mes, total}))
        );

        //Buscando os Dados de Orcamento
        const respostaOrcamento = await fetch("http://localhost:9000");
        if (!respostaOrcamento.ok) throw new Error("Erro ao buscar dados de Orçamento");
        const orcamentos = await respostaOrcamento.json();

        // Formata os dados de Orçamento
        const contagemMensalOrcamento = {};
        orcamentos.fetchEach((orcamento) => {
          const data = new Date(orcamento.dataCadastro);
          const anoMes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
          contagemMensalOrcamento[anoMes] = (contagemMensalOrcamento[anoMes] || 0) + 1;

        });

        setDadosOrcamento(
          Object.entries(contagemMensalOrcamento).map(([mes, total]) => ({ mes, total }))
        );



       

    buscarDados();
  }, []);

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dadosLocais}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" label={{ value: "Mês", position: "insideBottomRight", offset: -5 }} />
          <YAxis label={{ value: "Total de Locais", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>

      {/* Aqui vai ser o gráfico dos Orcamentos por mes */}

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dadosOrcamentos}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" label={{ value: "Mês", position: "insideBottomRight", offset: -5 }} />
          <YAxis label={{ value: "Total de Orçamentos Mês", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>

      {/* Aqui vai ser o gráfico das Mensagens por mes */}

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dadosMensagens}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" label={{ value: "Mês", position: "insideBottomRight", offset: -5 }} />
          <YAxis label={{ value: "Total de Mensagens Mês", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>




    </div>
  );
};

export default Graficos;
