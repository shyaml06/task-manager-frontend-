import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from "recharts";

export default function StatusChart({ data }) {

  const COLORS = ["#3b82f6", "#f59e0b", "#22c55e"];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>

        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          outerRadius={90}
          label
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip />

      </PieChart>
    </ResponsiveContainer>
  );
}
