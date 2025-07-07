import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StudentList from "./components/StudentList";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<StudentList />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
