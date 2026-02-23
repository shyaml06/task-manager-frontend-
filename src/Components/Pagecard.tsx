import { useNavigate } from "react-router-dom";
import axios  from "axios";
export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  const handletask=()=>{
    

  }

  return (
    <div style={styles.card}>

      {/* Project Info */}
      <h4>{project.name}</h4>

      <p style={styles.desc}>
        {project.description || "No description"}
      </p>

      <small>
        Start: {project.start_date}
      </small>

      <br />

      {/* View Tasks Button */}
      <button
        style={styles.btn}
        onClick={() => navigate(`/projects/${project.id}/tasks`)}
      >
        View Tasks
      </button>

    </div>
  );
}

/* Styling */
const styles = {
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "250px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  desc: {
    color: "#555",
    fontSize: "14px"
  },

  btn: {
    marginTop: "auto",
    padding: "8px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  }
};
