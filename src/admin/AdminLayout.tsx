import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/adminlayout.css"; // Ensure you import the CSS file!

const API = "http://localhost:8000/admin";

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post(
        `${API}/auth/logout/`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      // Navigate to login regardless of success/fail so the user isn't stuck
      navigate("/login"); 
    }
  };

  return (
    <div className="admin-wrapper">
      
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h3 className="admin-logo">Admin Panel</h3>

        <Link to="/admin" className="admin-link">Dashboard</Link>
        <Link to="/admin/users" className="admin-link">Users</Link>

        <button 
          onClick={logout} 
          className="admin-logout-btn"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="admin-main-content">
        {/* The Outlet renders whatever child route is currently active */}
        <Outlet /> 
      </div>

    </div>
  );
}