import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useParams } from 'react-router-dom';


const Graficos = () => {
  const { id } = useParams();
  console.log("ID recebido:", id);

  const [dadosLocais, setDadosLocais] = useState([]);
  const [dadosOrcamentos, setDadosOrcamentos] = useState([]);
  const [dadosMensagens, setDadosMensagens] = useState([]);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        // Locais
        const respostaLocais = await fetch("http://localhost:9000/Tabelalocais");
        console.log("dados da resposta locais", respostaLocais);

        if (!respostaLocais.ok) throw new Error("Erro ao buscar dados de Locais");
        const locais = await respostaLocais.json();
        console.log("Resposta de locais", respostaLocais);

        const contagemMensalLocais = {};
        locais.forEach((local) => {
          const data = new Date(local.dataCadastro);
          const anoMes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
          contagemMensalLocais[anoMes] = (contagemMensalLocais[anoMes] || 0) + 1;
        });
        console.log("Resposta contagemMensalLocais de locais aqui", contagemMensalLocais);

        setDadosLocais(
          Object.entries(contagemMensalLocais).map(([mes, total]) => ({ mes, total }))
        );
        console.log("Resposta de locais", setDadosLocais);


        // Buscar dados de orçamentos
        const respostaOrcamentos = await fetch("http://localhost:9000/Tabelaorcamentosgraficos");
        if (!respostaOrcamentos.ok) throw new Error("Erro ao buscar dados de Orçamentos");
        const orcamentos = await respostaOrcamentos.json();
        setDadosOrcamentos(orcamentos);

        // Buscar dados de mensagens
        const respostaMensagens = await fetch("http://localhost:9000/Tabelamensagensgraficos");
        if (!respostaMensagens.ok) throw new Error("Erro ao buscar dados de Mensagens");
        const mensagens = await respostaMensagens.json();
        setDadosMensagens(mensagens);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    buscarDados();
  }, []);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#d84a38", "#4a90e2"];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div>
      <h2 className='titulo-principal'>Gráfico de Locais</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={dadosLocais}
            dataKey="total"
            nameKey="mes"
            cx="50%"
            cy="50%"
            outerRadius={150}
            label={renderCustomizedLabel}
            fill="#8884d8"
          >
            {dadosLocais.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <h2 className='titulo-principal'>Gráfico de Orçamentos</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={dadosOrcamentos}
            dataKey="total"
            nameKey="mes"
            cx="50%"
            cy="50%"
            outerRadius={150}
            label={renderCustomizedLabel}
            fill="#82ca9d"
            
          >

            {dadosOrcamentos.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>


      <h2 className='titulo-principal'>Gráfico de Mensagens</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={dadosMensagens}
            dataKey="total"
            nameKey="mes"
            cx="50%"
            cy="50%"
            outerRadius={150}
            label={renderCustomizedLabel}
            fill="#ffc658"
          >

            {dadosMensagens.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      console.log("Resposta de locais", dadosMensagens);

    </div>
    
  );
};

export default Graficos;
