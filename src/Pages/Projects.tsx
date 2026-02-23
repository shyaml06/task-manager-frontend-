import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Projects.css"; // Import the CSS file here!

const API = "http://localhost:8000";

export default function Projects() {
  const navigate = useNavigate();

  // States
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form State
  const [form, setForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: ""
  });

  const [submitting, setSubmitting] = useState(false);

  // ==========================
  // Fetch Projects
  // ==========================
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API}/projects/`, {
          withCredentials: true
        });
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

  // ==========================
  // Handle Input
  // ==========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ==========================
  // Add Project
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await axios.post(`${API}/projects/add/`, form, {
        withCredentials: true
      });

      // Clear form
      setForm({
        name: "",
        description: "",
        start_date: "",
        end_date: ""
      });

      // Reload projects
      const res = await axios.get(`${API}/projects/`, {
        withCredentials: true
      });

      setProjects(res.data.data || res.data);
    } catch (err) {
      setError("Failed to add project");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <h3 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h3>;
  }

  return (
    <div className="projects-container">
      
      <div className="projects-header">
        <button
          onClick={() => navigate("/dashboard")}
          className="btn-back"
        >
          ⬅ Back
        </button>
        <h2>📁 Projects</h2>
      </div>

      {/* Error */}
      {error && <p className="projects-error">{error}</p>}

      <div className="projects-grid">
        
        {/* Project List */}
        <div className="projects-card">
          <h3>Existing Projects</h3>

          {projects.length === 0 ? (
            <p className="no-projects">No projects yet</p>
          ) : (
            <ul className="projects-list">
              {projects.map((p) => (
                <li key={p.id} className="project-item">
                  <b>{p.name}</b>
                  <small>Started: {p.start_date}</small>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add Project */}
        <div className="projects-card">
          <h3>Add New Project</h3>

          <form onSubmit={handleSubmit} className="project-form">
            <input
              type="text"
              name="name"
              placeholder="Project Name"
              value={form.name}
              onChange={handleChange}
              required
              className="form-input"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="form-input"
            />

            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              required
              className="form-input"
            />

            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              className="form-input"
            />

            <button
              type="submit"
              disabled={submitting}
              className="btn-submit"
            >
              {submitting ? "Adding..." : "Add Project"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}