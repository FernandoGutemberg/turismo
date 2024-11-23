import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const Graficos = () => {
  const [dadosLocais, setDadosLocais] = useState([]);
  const [dadosOrcamentos, setDadosOrcamento] = useState([]);
  const [dadosMensagens, setDadosMensagens] = useState([]);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        // Locais
        const respostaLocais = await fetch("http://localhost:9000/Tabelalocais");
        if (!respostaLocais.ok) throw new Error("Erro ao buscar dados de Locais");
        const locais = await respostaLocais.json();
        const contagemMensalLocais = {};
        locais.forEach((local) => {
          const data = new Date(local.dataCadastro);
          const anoMes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
          contagemMensalLocais[anoMes] = (contagemMensalLocais[anoMes] || 0) + 1;
        });
        setDadosLocais(
          Object.entries(contagemMensalLocais).map(([mes, total]) => ({ mes, total }))
        );

        // Orçamentos
        const orcamentos = [
          { mes: "2024-01", total: 5 },
          { mes: "2024-02", total: 8 },
        ];
        setDadosOrcamento(orcamentos);

        // Mensagens
        const respostaMensagens = await fetch("http://localhost:9000/Tabelamensagens");
        if (!respostaMensagens.ok) throw new Error("Erro ao buscar dados de Mensagens");
        const mensagens = await respostaMensagens.json();
        const contagemMensalMensagens = {};
        mensagens.forEach((mensagem) => {
          const data = new Date(mensagem.dataCadastro);
          const anoMes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
          contagemMensalMensagens[anoMes] = (contagemMensalMensagens[anoMes] || 0) + 1;
        });
        setDadosMensagens(
          Object.entries(contagemMensalMensagens).map(([mes, total]) => ({ mes, total }))
        );
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
    </div>
  );
};

export default Graficos;
