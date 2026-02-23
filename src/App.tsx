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
function App() {
  return (
    <BrowserRouter>
      <AdminRoutes />
      <Routes>
        <Route path="" element={<Landing/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Deshboard/> }/>
        <Route path="/tasks" element={<ViewTasks />} />
        <Route path="/tasks/add" element={<AddTask />} />
        <Route path="/projects" element={< Projects/>} />
        <Route path="/projects/:project_id/tasks" element={<ViewProjectTasks/>}/>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
