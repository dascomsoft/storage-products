



// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import EmployerApp from "./pages/EmployerApp"; // nom de ta page employé
import DashboardBoss from "./pages/DashboardBoss"; // patron

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<EmployerApp />} />
        <Route path="/dashboard-boss" element={<DashboardBoss />} />
      </Routes>
    </Router>
  );
}

