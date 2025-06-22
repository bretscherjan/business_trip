import React from "react";

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h4>Business Trip Management</h4>
          <p>
            Eine moderne Lösung für die Verwaltung von Geschäftsreisen, 
            Spesen und Packlisten.
          </p>
        </div>
        
        <div className="footer-section">
          <h4>Funktionen</h4>
          <ul>
            <li>Dashboard & Übersicht</li>
            <li>Teilnehmerverwaltung</li>
            <li>Geschäftsreisen</li>
            <li>Spesenverwaltung</li>
            <li>Währungsrechner</li>
            <li>KI-Packlisten</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Entwicklung</h4>
          <p>
            Diese Anwendung wurde für Demonstrationszwecke erstellt und 
            bietet keine echten Produkte oder Dienstleistungen an.
          </p>
          <p className="copyright">&copy; Bretscher Jan, Brunner Fiona, Seitz Cyril</p>
        </div>
      </div>
    </footer>
  );
}
