// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { CompleteProfile } from "./pages/auth/CompleteProfile";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> 
          <Route path="/complete-profile" element={<CompleteProfile />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;