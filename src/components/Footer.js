import React from "react";
import "../styles/App.css";

const Footer = () => (
  <footer className="footer py-3 mt-5" style={{ background: "#f8f9fa", borderTop: "1px solid #e0e0e0" }}>
    <div className="container text-center">
      <small className="text-muted">
        © {new Date().getFullYear()} <strong>Desenvolvimento de Software para Web</strong> <br />
        Professor Me. Benevaldo Pereira <br />
        Discentes: <span style={{ color: "#0d6efd" }}>Luana Aguiar</span> e <span style={{ color: "#0d6efd" }}>Matheus Lima</span>
      </small>
    </div>
  </footer>
);

export default Footer;
