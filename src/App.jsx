



// // src/App.jsx
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Signup from "./pages/Signup";
// import Login from "./pages/Login";
// import EmployerApp from "./pages/EmployerApp"; // nom de ta page employé
// import DashboardBoss from "./pages/DashboardBoss"; // patron

// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/app" element={<EmployerApp />} />
//         <Route path="/dashboard-boss" element={<DashboardBoss />} />
//       </Routes>
//     </Router>
//   );
// }









// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import EmployerApp from "./pages/EmployerApp";
import DashboardBoss from "./pages/DashboardBoss";
import Statistics from "./pages/Statistics"; // AJOUTER
import PrintReport from "./pages/PrintReport"; // AJOUTER

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<EmployerApp />} />
        <Route path="/dashboard-boss" element={<DashboardBoss />} />
        {/* AJOUTER CES ROUTES */}
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/print" element={<PrintReport />} />
      </Routes>
    </Router>
  );
}