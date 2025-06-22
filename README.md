
# business_trip

## Übersicht

Diese Applikation unterstützt die Organisation und Verwaltung von Geschäftsreisen. Sie besteht aus einem Java Spring Boot Backend und einem React-Frontend. Die wichtigsten Funktionen sind das Verwalten von Kassenbons, das Generieren von Packlisten mit KI-Unterstützung, die Teilnehmerverwaltung und ein integrierter Währungsrechner.

## Hauptfunktionen

### 1. Benutzerverwaltung
- **Registrierung:** Neue Nutzer können sich registrieren und ein Benutzerkonto anlegen.
- **Login/Logout:** Nutzer können sich anmelden und abmelden. Die Authentifizierung erfolgt über Token.
- **Rollen:** Es gibt verschiedene Benutzerrollen (z.B. Teamlead, Mitarbeiter).

### 2. Kassenbons (Reisekosten)
- **Erfassen von Ausgaben:** Nutzer können während der Reise ihre Ausgaben eintragen, inklusive Kategorie und Betrag.
- **Übersicht:** Alle Ausgaben einer Reise werden übersichtlich angezeigt und summiert.

### 3. Packliste (AI-gestützt)
- **Packliste generieren:** Für jede Reise kann automatisch eine individuelle Packliste mit Hilfe von KI erstellt werden. Die Liste berücksichtigt Reisedauer, Zielort, Jahreszeit und Besonderheiten.
- **Packlisten verwalten:** Nutzer können Packlisten einsehen, bearbeiten, einzelne Items abhaken, hinzufügen, bearbeiten oder löschen.

### 4. Teilnehmerverwaltung
- **Miglieder:** Mitarbeiter können ihre Daten (E-Mail, Telefon, Name...) angeben und von den anderen anschauen.
- **Export:** Die Mitarbeiterliste kann als CSV-Datei exportiert werden.

### 5. Währungsrechner
- **Wechselkurse:** Ein integrierter Währungsrechner hilft, Ausgaben in verschiedenen Währungen zu vereinheitlichen.

## API-Endpunkte (Auszug)

- **/login** – Nutzer-Login
- **/register** – Nutzer-Registrierung
- **/logout** – Nutzer-Logout
- **/PackingList** – Packliste abrufen
- **/PackingList/Generate** – Packliste generieren (AI)
- **/PackingList/addItem** – Item zur Packliste hinzufügen
- **/PackingList/editItem/{id}** – Item in Packliste bearbeiten
- **/PackingList/{id}** – Item aus Packliste löschen
- **/PackingList/** – Komplette Packliste löschen

## Technologie-Stack

- **Backend:** Java, Spring Boot, SQL-Datenbank
- **Frontend:** React
- **Versionskontrolle:** GitHub

## Hinweise

- Die Applikation ist modular aufgebaut, sodass weitere Features (z.B. Restaurant- und Hotelempfehlungen) einfach ergänzt werden können.
- Die Kommunikation zwischen Frontend und Backend erfolgt über REST-APIs.
