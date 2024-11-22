import * as React from "react";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";

const dayMapping = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const orderedDays = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];
const colors = ["#FF5B5B", "#F7C604"];

export default function BasicBars() {
  const { token } = useAuth();
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("/entrance/recent", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const transformedData = response.data.data.map((item) => ({
        name: dayMapping[item.day],
        Ingresos: item.entrances,
        color: item.entrances > 0 ? "#F7C604" : "#FF5B5B",
      }));

      const sortedData = orderedDays.map((day, index) => {
        const item = transformedData.find((d) => d.name === day);
        return {
          ...item,
          color: colors[index % colors.length], 
        };
      });

      setData(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barSize={35}>
        <CartesianGrid
          strokeDasharray="1 1"
          strokeWidth={0.7}
          horizontal={true}
          vertical={false}
        />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="Ingresos" fill="#8884d8" shape={<RenderShape />} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function RenderShape(props) {
  const { fill, x, y, width, height } = props;

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      style={{ fill: props.payload.color }}
    />
  );
}
