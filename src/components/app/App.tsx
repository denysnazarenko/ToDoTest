import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../login/Login.tsx";
import Register from "../register/Register.tsx";
import TodoPage from "../../pages/TodoPage.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<TodoPage />} />
      </Routes>
    </Router>
  );
};

export default App;