import { Routes, Route } from "react-router-dom";

import AdminLayout from "./AdminLayout";
import AdminDashboard from "./AdminDashboard";
import AdminUsers from "./AdminUsers";


export default function AdminRoutes() {

  return (
    <Routes>

      <Route path="/admin" element={<AdminLayout />}>

        <Route index element={<AdminDashboard />} />

        <Route path="users" element={<AdminUsers />} />

      </Route>

    </Routes>
  );
}
