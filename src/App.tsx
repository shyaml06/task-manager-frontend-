import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Deshboard from "./Pages/Dashboard";
import ViewTasks from "./Pages/ViewTasks";
import AddTask from "./Pages/AddTask";
import Projects from "./Pages/Projects";
import ViewProjectTasks from "./Pages/ViewProjectTasks";
import AdminRoutes from "./admin/AdminRoutes";
import Landing from "./Pages/LandingPage";
import KanbanBoard from "./admin/KanBoard";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import LoginActivityDashboard from "./Pages/LoginActivity";

// 1. Import QueryClient instead of useQueryClient
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

// 2. Create the client instance outside the component
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        
        {/* If AdminRoutes contains UI like a Navbar, it's fine here. 
            If it contains <Route> tags, move it INSIDE the <Routes> block below! */}
        <AdminRoutes />

        <Routes>
          {/* Changed path="" to path="/" for standard convention */}
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Deshboard />} />
          <Route path="/tasks" element={<ViewTasks />} />
          <Route path="/tasks/add" element={<AddTask />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:project_id/tasks" element={<ViewProjectTasks />} />
          <Route path="/vis" element={<KanbanBoard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:uid/:token"
            element={<ResetPassword />}
          />
          <Route
            path="/admin/loginreport"
            element={<LoginActivityDashboard />}
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;