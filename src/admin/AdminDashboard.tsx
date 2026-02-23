import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:8000/admin";

export default function AdminDashboard() {

  const [stats, setStats] = useState(null);
  const navigate=useNavigate()
  useEffect(() => {

    const loadStats = async () => {

      try{const res = await axios.get(
        `${API}/stats/`,
        { withCredentials: true }
      );
    
    setStats(res.
      data);
    }
      catch(err){
        if(err.status===401){
          navigate("/login");

        }
        console.log(err)

      }

      
    };

    loadStats();

  }, []);


  if (!stats) return <h3>Loading...</h3>;


  return (
    <div>

      <h2>Admin Dashboard</h2>

      <div style={styles.grid}>

        <Card title="Users" value={stats.total_users} />
        <Card title="Projects" value={stats.total_projects} />
        <Card title="Tasks" value={stats.total_tasks} />
        <Card title="Completed" value={stats.completed_tasks} />

      </div>

    </div>
  );
}


/* KPI Card */
function Card({ title, value }) {

  return (
    <div style={styles.card}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}


const styles = {

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
    gap: "20px",
    marginTop: "20px"
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "6px",
    textAlign: "center",
    boxShadow: "0 0 5px rgba(0,0,0,0.1)"
  }
};
