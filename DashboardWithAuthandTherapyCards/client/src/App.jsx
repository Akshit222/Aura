import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import TherapyCards from "./Pages/TherapyCards"; // Import TherapyCards
import { useAuth } from "./contexts/AuthContext";
import { Navigate } from "react-router-dom";
const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Default route to Dashboard */}
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        {/* Login route */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        {/* Register route */}
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
        />
        {/* Dashboard route */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        {/* TherapyCards route, accessible without authentication */}
        <Route
          path="/therapycards"
          element={<TherapyCards />}
        />

      </Routes>
    </Router>
  );
};

export default App;
