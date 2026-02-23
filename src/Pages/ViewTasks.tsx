import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProjectCard from "@/Components/Pagecard";
import "../styles/Viewtasks.css"; // Make sure to import the CSS file here!

export default function ViewTasks() {
  const API = "http://localhost:8000";
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // Fetch Projects on Mount
  // ==============================
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(
          `${API}/projects/`,
          { withCredentials: true }
        );

        setProjects(res.data.data || res.data);

      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to load projects");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [navigate]);

  // ==============================
  // Loading State
  // ==============================
  if (loading) {
    return <h3 style={{ textAlign: "center" }}>Loading...</h3>;
  }

  return (
    <div className="view-tasks-container">
      <h2>Projects</h2>
      
      <button
        onClick={() => navigate("/dashboard")}
        className="back-btn"
      >
        ⬅ Back
      </button>

      {error && <p className="error-message">{error}</p>}

      {projects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>
      )}
    </div>
  );
}