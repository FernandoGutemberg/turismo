import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";




const Graficos = () => {
  const [dados, setDados] = useState([]);


  return (
    <ResponsiveContainer>
      <LineChart>
        <CartesianGrid />
        <XAxis />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line />


      </LineChart>
    </ResponsiveContainer>

  );
};

export default Graficos;
