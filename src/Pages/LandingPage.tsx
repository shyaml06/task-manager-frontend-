import { useNavigate } from "react-router-dom";
import "../styles/Landing.css"; // Import the CSS file here!

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">

      {/* Navbar */}
      <nav className="landing-nav">
        <h2 className="landing-logo">TaskFlow</h2>

        <div>
          <button
            className="btn-login"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="btn-signup"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>
        </div>
      </nav>


      {/* Hero Section */}
      <section className="landing-hero">
        <h1>Manage Projects. Track Tasks. Grow Faster.</h1>
        <p>
          A simple project management platform for teams,
          admins, and managers.
        </p>
        <button
          className="btn-cta"
          onClick={() => navigate("/register")}
        >
          Start Free 🚀
        </button>
      </section>


      {/* Features */}
      <section className="landing-features">
        <h2>Why Choose TaskFlow?</h2>
        <div className="feature-grid">
          <FeatureCard
            title="📋 Project Management"
            desc="Create, track, and organize all your projects."
          />
          <FeatureCard
            title="✅ Task Tracking"
            desc="Monitor task progress in real-time."
          />
          <FeatureCard
            title="📊 Analytics"
            desc="Get insights with charts and reports."
          />
          <FeatureCard
            title="🔐 Role Based Access"
            desc="Admin, Manager, and Employee permissions."
          />
        </div>
      </section>


      {/* Roles */}
      <section className="landing-roles">
        <h2>User Roles</h2>
        <div className="role-grid">
          <RoleCard
            title="Admin"
            points={[
              "Manage users",
              "Assign roles",
              "View analytics",
              "System control"
            ]}
          />
          <RoleCard
            title="Manager"
            points={[
              "Create projects",
              "Assign tasks",
              "Track progress"
            ]}
          />
          <RoleCard
            title="Employee"
            points={[
              "View tasks",
              "Update status",
              "Submit work"
            ]}
          />
        </div>
      </section>


      {/* Call To Action */}
      <section className="landing-cta-section">
        <h2>Ready to Boost Productivity?</h2>
        <p>Join hundreds of teams using TaskFlow</p>
        <button
          className="btn-cta"
          onClick={() => navigate("/register")}
        >
          Create Account
        </button>
      </section>


      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 TaskFlow | Built by Shyam 🚀</p>
      </footer>

    </div>
  );
}


/* ==============================
   Reusable Components
============================== */

function FeatureCard({ title, desc }) {
  return (
    <div className="landing-card">
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  );
}

function RoleCard({ title, points }) {
  return (
    <div className="landing-card">
      <h3>{title}</h3>
      <ul>
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
  );
}