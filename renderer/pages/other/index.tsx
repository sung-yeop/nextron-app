import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const rechartsData = [
  { name: "Jan", value: 400, value2: 240 },
  { name: "Feb", value: 300, value2: 139 },
  { name: "Mar", value: 200, value2: 980 },
  { name: "Apr", value: 278, value2: 390 },
  { name: "May", value: 189, value2: 480 },
  { name: "Jun", value: 239, value2: 380 },
];

export default function index() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">차트 샘플 페이지1</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recharts - Line Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={rechartsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="value2"
                stroke="#82ca9d"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Recharts - Bar Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rechartsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
              <Bar dataKey="value2" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
