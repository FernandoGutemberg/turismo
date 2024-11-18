import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Graficos = () => {
  const [dadosLocais, setDadosLocais] = useState([]);
  const [dadosOrcamentos, setDadosOrcamento] = useState([]);
  const [dadosMensagens, setDadosMensagens] = useState([]);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        // Locais
        console.log("Buscando dados de Locais...");
        const respostaLocais = await fetch("http://localhost:9000/Tabelalocais");
        if (!respostaLocais.ok) throw new Error("Erro ao buscar dados de Locais");
        const locais = await respostaLocais.json();
        console.log("Dados de Locais recebidos (array):", locais);

        const contagemMensalLocais = {};
        locais.forEach((local) => {
          const data = new Date(local.dataCadastro);
          const anoMes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
          contagemMensalLocais[anoMes] = (contagemMensalLocais[anoMes] || 0) + 1;
        });
        console.log("Contagem Mensal de Locais:", contagemMensalLocais);

        setDadosLocais(
          Object.entries(contagemMensalLocais).map(([mes, total]) => ({ mes, total }))
        );

        // Orçamentos
        console.log("Buscando dados de Orçamentos...");
        const respostaOrcamento = await fetch("http://localhost:9000/Tabelaorcamento");
        if (!respostaOrcamento.ok) throw new Error("Erro ao buscar dados de Orçamento");
        const orcamentos = await respostaOrcamento.json();
        console.log("Dados de Orçamentos recebidos:", orcamentos);

        if (Array.isArray(orcamentos)) {
          const contagemMensalOrcamento = {};
          orcamentos.forEach((orcamento) => {
            const data = new Date(orcamento.dataCadastro);
            const anoMes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
            contagemMensalOrcamento[anoMes] = (contagemMensalOrcamento[anoMes] || 0) + 1;
          });
          console.log("Contagem Mensal de Orçamentos:", contagemMensalOrcamento);

          setDadosOrcamento(
            Object.entries(contagemMensalOrcamento).map(([mes, total]) => ({ mes, total }))
          );
        } else {
          console.error("Erro: Dados de Orçamentos não estão no formato de array", orcamentos);
        }

        // Mensagens
        console.log("Buscando dados de Mensagens...");
        const respostaMensagens = await fetch("http://localhost:9000/Tabelamensagens");
        if (!respostaMensagens.ok) throw new Error("Erro ao buscar dados de Mensagens");
        const mensagens = await respostaMensagens.json();
        console.log("Dados de Mensagens recebidos:", mensagens);

        if (Array.isArray(mensagens)) {
          const contagemMensalMensagens = {};
          mensagens.forEach((mensagem) => {
            const data = new Date(mensagem.dataCadastro);
            const anoMes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
            contagemMensalMensagens[anoMes] = (contagemMensalMensagens[anoMes] || 0) + 1;
          });
          console.log("Contagem Mensal de Mensagens:", contagemMensalMensagens);

          setDadosMensagens(
            Object.entries(contagemMensalMensagens).map(([mes, total]) => ({ mes, total }))
          );
        } else {
          console.error("Erro: Dados de Mensagens não estão no formato de array", mensagens);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    buscarDados();
  }, []);


  return (
    <div>
      <h2>Gráfico de Locais</h2>
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

      <h2>Gráfico de Orçamentos</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dadosOrcamentos}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" label={{ value: "Mês", position: "insideBottomRight", offset: -5 }} />
          <YAxis label={{ value: "Total de Orçamentos", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="total" stroke="#82ca9d" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>

      <h2>Gráfico de Mensagens</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dadosMensagens}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" label={{ value: "Mês", position: "insideBottomRight", offset: -5 }} />
          <YAxis label={{ value: "Total de Mensagens", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="total" stroke="#ffc658" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>

  );
};

export default Graficos;
