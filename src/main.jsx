import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)










// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// import App from './App.jsx';
// import Signup from './pages/Signup.jsx';
// import Login from './pages/Login.jsx';
// import Dashboard from './pages/DashboardBoss.jsx';
// import ProtectedRoute from './components/ProtectedRoute.jsx';

// import { AuthProvider } from "./contexts/AuthContext.jsx";
// import './index.css';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <AuthProvider>
//         <Routes>
//           {/* 🔁 Redirection de / vers /login */}
//           <Route path="/" element={<Navigate to="/login" />} />
          
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/app" element={
//             <ProtectedRoute>
//               <App />
//             </ProtectedRoute>
//           } />
//           <Route path="/dashboard" element={
//             <ProtectedRoute role="boss">
//               <Dashboard />
//             </ProtectedRoute>
//           } />
//         </Routes>
//       </AuthProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// );


