import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/viewprojecttasks.css"
 // Ensure this import points to your new CSS file!

const API = "http://localhost:8000";

export default function ViewProjectTasks() {
  const { project_id } = useParams();
  const navigate = useNavigate();

  // States
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Task Form State
  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: ""
  });

  const [submitting, setSubmitting] = useState(false);

  // ==========================
  // Fetch Tasks
  // ==========================
  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `${API}/projects/${project_id}/tasks/`,
        { withCredentials: true }
      );
      setTasks(res.data.data || res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to load tasks");
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // On Load
  // ==========================
  useEffect(() => {
    fetchTasks();
  }, [project_id]);

  // ==========================
  // Handle Form Change
  // ==========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ==========================
  // Add Task
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await axios.post(
        `${API}/projects/task/add/`,
        {
          project_id,
          title: form.title,
          description: form.description,
          due_date: form.due_date
        },
        { withCredentials: true }
      );

      // Clear form
      setForm({
        title: "",
        description: "",
        due_date: ""
      });

      // Reload tasks
      fetchTasks();
    } catch (err) {
      setError("Failed to add task");
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================
  // Loading
  // ==========================
  if (loading) {
    return <h3 style={{ textAlign: "center" }}>Loading...</h3>;
  }

  return (
    <div className="tasks-container">
      <h2>📋 Project Tasks</h2>

      <button
        onClick={() => navigate("/projects")}
        className="back-btn"
      >
        ⬅ Back
      </button>

      {error && <p className="error-message">{error}</p>}

      {/* ======================
          Add Task Form
      ====================== */}
      <div className="tasks-card">
        <h3>Add New Task</h3>
        <form onSubmit={handleSubmit} className="task-form">
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
          <input
            type="date"
            name="due_date"
            value={form.due_date}
            onChange={handleChange}
          />
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Adding..." : "Add Task"}
          </button>
        </form>
      </div>

      {/* ======================
          Tasks Table
      ====================== */}
      <div className="tasks-card">
        <h3>Task List</h3>
        {tasks.length === 0 ? (
          <p>No tasks found</p>
        ) : (
          <table className="tasks-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.title}</td>
                  <td>{t.status}</td>
                  <td>{t.due_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}