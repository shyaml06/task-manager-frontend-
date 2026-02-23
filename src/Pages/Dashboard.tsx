import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ProjectChart } from "@/Components/Barchart";
import StatusChart from "@/Components/Piechart";
import "../styles/Dashboard.css"; // Import the CSS file here!

const API = "http://localhost:8000";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [role, setRole] = useState("");
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${API}/projects/analytics/`, {
        withCredentials: true,
      });
      setAnalytics(res.data);
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    }
  };

  // ==============================
  // Fetch Dashboard Data
  // ==============================
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [projectRes, statsRes] = await Promise.all([
          axios.get(`${API}/projects/`, { withCredentials: true }),
          // axios.get(`${API}/dashboard/stats/`, { withCredentials: true })
        ]);

        setProjects(projectRes.data.data || projectRes.data);
        if (statsRes) setStats(statsRes.data);

      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          // setError("Failed to load dashboard");
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchrole = async () => {
      try {
        const response = await axios.get("http://localhost:8000/admin/role", {
          withCredentials: true,
        });
        setRole(response.data.Role);
      } catch (err) {
        console.error("Failed to fetch role", err);
      }
    };

    fetchDashboard();
    fetchAnalytics();
    fetchrole();
  }, [navigate]);

  // ==============================
  // Logout
  // ==============================
  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout/`, {}, { withCredentials: true });
    } catch {}
    navigate("/login");
  };

  if (loading) {
    return <h3 className="dashboard-center">Loading...</h3>;
  }

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <Navbar
        onLogout={handleLogout}
        onProjects={() => navigate("/projects")}
        onTasks={() => navigate("/tasks")}
        role={role}
      />

      {error && <p className="dashboard-error">{error}</p>}

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KpiCard title="Projects" value={stats.total_projects || 0} />
        <KpiCard title="Tasks" value={stats.total_tasks || 0} />
        <KpiCard title="Completed" value={stats.completed_tasks || 0} />
        <KpiCard title="Pending" value={stats.pending_tasks || 0} />
      </div>

      {/* Main Section */}
      <div className="main-grid">
        {/* Recent Projects */}
        <RecentProjects projects={projects} />

        {/* Summary */}
        <SummaryCard stats={stats} />
      </div>

      {/* Analytics Charts Section */}
      {analytics && (
        <div className="charts-grid">
          <div className="dashboard-card">
            <h4>Task Status</h4>
            <StatusChart data={analytics.status_summary} />
          </div>

          <div className="dashboard-card">
            <h4>Tasks per Project</h4>
            <ProjectChart data={analytics.tasks_per_project} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ==============================
   Components
============================== */

function Navbar({ onLogout, onProjects, onTasks, role }) {
  const navigate = useNavigate();
  
  function handleadmin() {
    navigate("/admin");
  }

  return (
    <div className="dashboard-navbar">
      <h3>📊 Dashboard</h3>

      <div className="nav-actions">
        <button onClick={onProjects} className="nav-btn">
          Projects
        </button>

        <button onClick={onTasks} className="nav-btn">
          Tasks
        </button>

        {role === "admin" && (
          <button onClick={handleadmin} className="nav-btn">
            Admin Panel
          </button>
        )}

        <button onClick={onLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </div>
  );
}

/* KPI Card */
function KpiCard({ title, value }) {
  return (
    <div className="kpi-card">
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

/* Recent Projects */
function RecentProjects({ projects }) {
  return (
    <div className="dashboard-card">
      <h4>Recent Projects</h4>

      {projects.length === 0 ? (
        <p className="no-data">No projects yet</p>
      ) : (
        <ul className="recent-projects-list">
          {projects.slice(0, 5).map((p) => (
            <li key={p.id}>
              <b>{p.name}</b>
              <small>{p.start_date}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* Summary */
function SummaryCard({ stats }) {
  return (
    <div className="dashboard-card">
      <h4>System Summary</h4>
      
      <div className="summary-item">
        <span>Projects</span>
        <span>{stats.total_projects || 0}</span>
      </div>
      <div className="summary-item">
        <span>Tasks</span>
        <span>{stats.total_tasks || 0}</span>
      </div>
      <div className="summary-item">
        <span>Completed</span>
        <span>{stats.completed_tasks || 0}</span>
      </div>
      <div className="summary-item">
        <span>Pending</span>
        <span>{stats.pending_tasks || 0}</span>
      </div>
    </div>
  );
}