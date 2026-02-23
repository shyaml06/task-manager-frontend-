import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export function ProjectChart({ data }) {

  return (
    <ResponsiveContainer width="100%" height={250}>

      <BarChart data={data}>

        <XAxis dataKey="project" />
        <YAxis />
        <Tooltip />

        <Bar dataKey="tasks" />

      </BarChart>

    </ResponsiveContainer>
  );
}
