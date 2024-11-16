import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Graficos = () => {
  const [dadosLocais, setDadosLocais] = useState([]);
  const [dadosOrcamentos, setDadosOrcamentos] = useState([]);
  const [dadosMensagens, setDadosMensagens] = useState([]);


  useEffect(() => {
    const buscarDados = async () => {
      try {
        const resposta = await fetch("http://localhost:9000/Tabelalocais");
        if (!resposta.ok) {
          throw new Error("Erro ao buscar dados para o gráfico");
        }
        const locais = await resposta.json();

        // Formate os dados para o gráfico
        const contagemMensal = {};

        locais.forEach(local => {
          const data = new Date(local.dataCadastro);
          const anoMes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;

          // Incrementa o contador para o ano e mês específicos
          if (contagemMensal[anoMes]) {
            contagemMensal[anoMes] += 1;
          } else {
            contagemMensal[anoMes] = 1;
          }
        });

        // Converte o objeto em um array para o gráfico
        const dadosFormatados = Object.entries(contagemMensal).map(([mes, total]) => ({
          mes,
          total
        }));

        setDadosLocais(dadosFormatados);
      } catch (error) {
        console.error("Erro ao buscar dados para o gráfico:", error);
      }
    };

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
