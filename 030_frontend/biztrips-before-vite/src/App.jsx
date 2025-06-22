import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";
import "./App.css";
import Footer from "./Footer";
import Header from "./Header";
import { login as loginApi, register as registerApi } from "./services/authService";
import { fetchUsers, exportUsersCsv } from "./services/userService";
import { fetchTrips, createTrip, updateTrip, deleteTrip } from "./services/tripService";
import { fetchExpenses, createExpense, deleteExpense } from "./services/expenseService";
import { fetchConvertedSums } from "./services/currencyService";
import { 
  fetchPackingList, 
  generatePackingList,
  addPackingItem,
  editPackingItem,
  deletePackingItem,
} from "./services/packingListService";

const trips = [
  {
    id: 1,
    title: "BT01",
    description: "San Francisco World Trade Center on new Server/IOT/Client ",
    startTrip: [2021, 2, 13, 0, 0],
    endTrip: [2021, 2, 15, 16, 56],
    meetings: [
      {
        id: 1,
        title: "One Conference",
        description: "Key Note on One Conference",
      },
      {
        id: 2,
        title: "Zero Conference",
        description: "Workshop Zero on One Conference",
      },
    ],
  },
  {
    id: 2,
    title: "BT02",
    description: "Santa Clara Halley on new Server/IOT/Client",
    startTrip: [2021, 6, 23, 9, 0],
    endTrip: [2021, 6, 27, 16, 56],
    meetings: [
      {
        id: 3,
        title: "One Conference",
        description: "HandsOn on One Conference",
      },
      {
        id: 4,
        title: "One Conference",
        description: "Key Note on One Conference",
      },
    ],
  },
  {
    id: 3,
    title: "BT03",
    description: "San Cose City Halley on Docker/IOT/Client",
    startTrip: [2021, 12, 13, 9, 0],
    endTrip: [2021, 12, 15, 16, 56],
    meetings: [
      {
        id: 5,
        title: "One Conference",
        description: "Key Note on One Conference",
      },
    ],
  },
];

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await loginApi(username, password);
      onLogin(res.token, res.role);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main>
      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Benutzername</label>
            <input value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Passwort</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="btn w-full" type="submit">Login</button>
          {error && <div className="alert alert-error" role="alert">{error}</div>}
        </form>
      </div>
    </main>
  );
}

function Register({ onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("MITARBEITER");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await registerApi(username, password, email, phoneNumber, role);
      onRegister(res.token, res.role);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main>
      <div className="form-container">
        <h2>Registrieren</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Benutzername</label>
            <input value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Passwort</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>E-Mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Telefonnummer</label>
            <input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Rolle</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="MITARBEITER">Mitarbeiter</option>
              <option value="TEAMLEAD">Teamlead</option>
            </select>
          </div>
          <button className="btn w-full" type="submit">Registrieren</button>
          {error && <div className="alert alert-error" role="alert">{error}</div>}
        </form>
      </div>
    </main>
  );
}

function Dashboard() {
  return (
    <main>
      <h1>BusinessTrip Dashboard</h1>
      <div className="dashboard-grid">
        <Tile to="/users" label="Teilnehmerverwaltung" icon="👥" />
        <Tile to="/trips" label="Geschäftsreisen" icon="🧳" />
        <Tile to="/expenses" label="Spesen/Kassenbons" icon="💸" />
        <Tile to="/currency" label="Währungsrechner" icon="💱" />
        <Tile to="/packinglist" label="Packliste" icon="📦" />
      </div>
    </main>
  );
}

function Tile({ to, label, icon }) {
  return (
    <Link to={to} className="dashboard-tile">
      <span className="icon">{icon}</span>
      <h3>{label}</h3>
    </Link>
  );
}

function Users({ token, role }) {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [csvLoading, setCsvLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    fetchUsers(token)
      .then(setUsers)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleExport() {
    setCsvLoading(true);
    try {
      const csv = await exportUsersCsv(token);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "teilnehmerliste.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } finally {
      setCsvLoading(false);
    }
  }

  if (loading) return <main><div className="loading"><span className="spinner"></span> Lade Teilnehmer...</div></main>;
  if (error) return <main><div className="alert alert-error" role="alert">{error}</div></main>;

  return (
    <main>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Teilnehmerverwaltung</h2>
          {role === "TEAMLEAD" && (
            <button className="btn" onClick={handleExport} disabled={csvLoading}>
              {csvLoading ? <span className="spinner"></span> : ""}
              {csvLoading ? "Exportiere..." : "Export als CSV"}
            </button>
          )}
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Benutzername</th>
                <th>E-Mail</th>
                <th>Telefon</th>
                <th>Rolle</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.phoneNumber || "-"}</td>
                  <td>
                    <span className={`role-badge ${u.role.toLowerCase()}`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function Trips({ token }) {
  const [trips, setTrips] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [showForm, setShowForm] = React.useState(false);
  const [editTrip, setEditTrip] = React.useState(null);
  const [form, setForm] = React.useState({ title: "", description: "", startDate: "", endDate: "", destination: "" });
  const [formError, setFormError] = React.useState("");

  React.useEffect(() => {
    setLoading(true);
    fetchTrips(token)
      .then(setTrips)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  function handleNew() {
    setEditTrip(null);
    setForm({ title: "", description: "", startDate: "", endDate: "", destination: "" });
    setShowForm(true);
    setFormError("");
  }
  function handleEdit(trip) {
    setEditTrip(trip);
    setForm({
      title: trip.title,
      description: trip.description,
      startDate: trip.startDate,
      endDate: trip.endDate,
      destination: trip.destination
    });
    setShowForm(true);
    setFormError("");
  }
  async function handleDelete(id) {
    if (!window.confirm("Geschäftsreise wirklich löschen?")) return;
    await deleteTrip(id, token);
    setLoading(true);
    fetchTrips(token)
      .then(setTrips)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    try {
      if (editTrip) {
        await updateTrip(editTrip.id, form, token);
      } else {
        await createTrip(form, token);
      }
      setShowForm(false);
      setLoading(true);
      fetchTrips(token)
        .then(setTrips)
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    } catch (err) {
      setFormError(err.message);
    }
  }

  if (loading) return <main><div className="loading"><span className="spinner"></span> Lade Geschäftsreisen...</div></main>;
  if (error) return <main><div className="alert alert-error" role="alert">{error}</div></main>;

  return (
    <main>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Geschäftsreisen</h2>
          <button className="btn" onClick={handleNew}>
            Neue Geschäftsreise
          </button>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Titel</th>
                <th>Beschreibung</th>
                <th>Start</th>
                <th>Ende</th>
                <th>Zielort</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {trips.map(trip => (
                <tr key={trip.id}>
                  <td><strong>{trip.title}</strong></td>
                  <td>{trip.description}</td>
                  <td>{trip.startDate}</td>
                  <td>{trip.endDate}</td>
                  <td>{trip.destination}</td>
                  <td>
                    <div className="flex gap-8">
                      <button className="btn btn-secondary" onClick={() => handleEdit(trip)}>
                        Bearbeiten
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(trip.id)}>
                        Löschen
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {showForm && (
        <div className="form-container">
          <h3>{editTrip ? "Geschäftsreise bearbeiten" : "Neue Geschäftsreise"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Titel</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Beschreibung</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Startdatum</label>
              <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Enddatum</label>
              <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Zielort</label>
              <input value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} required />
            </div>
            <div className="flex gap-8">
              <button className="btn" type="submit">{editTrip ? "Speichern" : "Anlegen"}</button>
              <button className="btn btn-secondary" type="button" onClick={() => setShowForm(false)}>Abbrechen</button>
            </div>
            {formError && <div className="alert alert-error" role="alert">{formError}</div>}
          </form>
        </div>
      )}
    </main>
  );
}

function Expenses({ token, role }) {
  const [trips, setTrips] = React.useState([]);
  const [selectedTrip, setSelectedTrip] = React.useState("");
  const [expenses, setExpenses] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ amount: "", currency: "CHF", description: "" });
  const [formError, setFormError] = React.useState("");

  React.useEffect(() => {
    fetchTrips(token).then(setTrips).catch(() => {});
  }, [token]);

  React.useEffect(() => {
    if (selectedTrip) {
      setLoading(true);
      fetchExpenses(token, selectedTrip)
        .then(setExpenses)
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    } else {
      setExpenses([]);
    }
  }, [selectedTrip, token]);

  async function handleDelete(id) {
    if (!window.confirm("Spese wirklich löschen?")) return;
    await deleteExpense(token, id);
    setExpenses(expenses => expenses.filter(e => e.id !== id));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    try {
      await createExpense(token, { ...form, tripId: selectedTrip });
      setShowForm(false);
      setForm({ amount: "", currency: "CHF", description: "" });
      setLoading(true);
      fetchExpenses(token, selectedTrip)
        .then(setExpenses)
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    } catch (err) {
      setFormError(err.message);
    }
  }

  const isTeamlead = role === "TEAMLEAD";

  return (
    <main>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Spesen/Kassenbons</h2>
        </div>
        
        {isTeamlead && (
          <div className="alert alert-info">
            <strong>Teamlead-Ansicht:</strong> Sie sehen alle Spesen aller Mitarbeiter für die ausgewählte Reise.
          </div>
        )}
        
        <div className="form-group">
          <label>Geschäftsreise auswählen:</label>
          <div className="flex gap-16 items-center">
            <select value={selectedTrip} onChange={e => setSelectedTrip(e.target.value)}>
              <option value="">Bitte wählen...</option>
              {trips.map(t => (
                <option key={t.id} value={t.id}>{t.title} ({t.destination})</option>
              ))}
            </select>
            {selectedTrip && (
              <button className="btn" onClick={() => setShowForm(true)}>
                Neue Spese
              </button>
            )}
          </div>
        </div>
        
        {loading && <div className="loading"><span className="spinner"></span> Lade Spesen...</div>}
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        
        {selectedTrip && !loading && !error && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  {isTeamlead && <th>Mitarbeiter</th>}
                  <th>Betrag</th>
                  <th>Währung</th>
                  <th>Beschreibung</th>
                  <th>Datum</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((e, idx) => (
                  <tr key={e.id ?? idx}>
                    {isTeamlead && (
                      <td>
                        <span className="role-badge mitarbeiter">
                          User {e.userId}
                        </span>
                      </td>
                    )}
                    <td><strong>{e.amount}</strong></td>
                    <td>{e.currency}</td>
                    <td>{e.description}</td>
                    <td>{e.date}</td>
                    <td>
                      {e.id ? (
                        <button className="btn btn-danger" onClick={() => handleDelete(e.id)}>
                          Löschen
                        </button>
                      ) : (
                        <span style={{ color: 'gray' }}>Keine ID</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {expenses.length > 0 && (
              <div className="alert alert-success">
                <strong>Gesamtsumme:</strong> {expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)} {expenses[0]?.currency || 'CHF'}
              </div>
            )}
          </div>
        )}
      </div>
      
      {showForm && (
        <div className="form-container">
          <h3>Neue Spese</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Betrag</label>
              <input type="number" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Währung</label>
              <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}>
                <option value="CHF">CHF</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div className="form-group">
              <label>Beschreibung</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="flex gap-8">
              <button className="btn" type="submit">Anlegen</button>
              <button className="btn btn-secondary" type="button" onClick={() => setShowForm(false)}>Abbrechen</button>
            </div>
            {formError && <div className="alert alert-error" role="alert">{formError}</div>}
          </form>
        </div>
      )}
    </main>
  );
}

function Currency({ token }) {
  const [amount, setAmount] = React.useState("");
  const [fromCurrency, setFromCurrency] = React.useState("CHF");
  const [toCurrency, setToCurrency] = React.useState("EUR");
  const [convertedAmount, setConvertedAmount] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleCalculate() {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Bitte geben Sie einen gültigen Betrag ein");
      return;
    }

    if (fromCurrency === toCurrency) {
      setConvertedAmount(amount);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:8080/currency/convert`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          fromCurrency: fromCurrency,
          toCurrency: toCurrency
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Währungsumrechnung fehlgeschlagen");
      }
      
      const result = await response.json();
      setConvertedAmount(result.convertedAmount.toFixed(2));
    } catch (err) {
      setError("Fehler bei der Währungsumrechnung: " + err.message);
      setConvertedAmount("");
    } finally {
      setLoading(false);
    }
  }

  // Automatische Berechnung bei Änderungen
  React.useEffect(() => {
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      handleCalculate();
    } else {
      setConvertedAmount("");
    }
  }, [amount, fromCurrency, toCurrency]);

  return (
    <main>
      <div className="currency-converter">
        <h2>Währungsrechner</h2>
        
        <div className="form-group">
          <label>Betrag eingeben:</label>
          <div className="currency-input-group">
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              <option value="CHF">CHF</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>

        <div className="currency-arrow">
          ↓
        </div>

        <div className="form-group">
          <label>Umrechnung in:</label>
          <div className="currency-input-group">
            <input
              type="text"
              value={convertedAmount}
              readOnly
              placeholder="0.00"
            />
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              <option value="EUR">EUR</option>
              <option value="CHF">CHF</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="loading">
            <span className="spinner"></span> Berechne...
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {convertedAmount && !loading && !error && (
          <div className="currency-result">
            <strong>
              {amount} {fromCurrency} = {convertedAmount} {toCurrency}
            </strong>
          </div>
        )}
      </div>
    </main>
  );
}

function PackingList({ token }) {
  const [trips, setTrips] = React.useState([]);
  const [selectedTrip, setSelectedTrip] = React.useState("");
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [newItemName, setNewItemName] = React.useState("");
  const [generationData, setGenerationData] = React.useState({
    zielohrt: "",
    geschlecht: "männlich",
    startDatum: "",
    endDatum: "",
    besonderheiten: ""
  });

  useEffect(() => {
    fetchTrips(token).then(setTrips).catch(err => setError("Reisen konnten nicht geladen werden."));
  }, [token]);

  const fetchList = React.useCallback(async () => {
    if (!selectedTrip) {
      setItems([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await fetchPackingList(token, selectedTrip);
      setItems(data);
    } catch (err) {
      console.error("Fehler beim Laden der Packliste:", err);
      setError("Packliste konnte nicht geladen werden: " + err.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token, selectedTrip]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  async function handleGenerate(e) {
    e.preventDefault();
    if (!selectedTrip) return;
    setLoading(true);
    setError("");
    try {
      // Konvertiere Datums-Strings zu LocalDate-Objekten
      const dataToSend = {
        ...generationData,
        startDatum: generationData.startDatum ? new Date(generationData.startDatum) : null,
        endDatum: generationData.endDatum ? new Date(generationData.endDatum) : null
      };
      
      await generatePackingList(token, selectedTrip, dataToSend);
      await fetchList();
      // Reset form
      setGenerationData({
        zielohrt: "",
        geschlecht: "männlich",
        startDatum: "",
        endDatum: "",
        besonderheiten: ""
      });
    } catch (err) {
      console.error("Fehler beim Generieren der Packliste:", err);
      setError("Packliste konnte nicht generiert werden: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddItem(e) {
    e.preventDefault();
    if (!newItemName || !selectedTrip) return;
    setError("");
    try {
      await addPackingItem(token, selectedTrip, { name: newItemName, tickedOff: false });
      setNewItemName("");
      await fetchList();
    } catch (err) {
      console.error("Fehler beim Hinzufügen des Items:", err);
      setError("Item konnte nicht hinzugefügt werden: " + err.message);
    }
  }

  async function handleDeleteItem(itemId) {
    setError("");
    try {
      await deletePackingItem(token, selectedTrip, itemId);
      await fetchList();
    } catch (err) {
      console.error("Fehler beim Löschen des Items:", err);
      setError("Item konnte nicht gelöscht werden: " + err.message);
    }
  }

  async function handleToggleTicked(item) {
    setError("");
    try {
      await editPackingItem(token, selectedTrip, item.id, { 
        name: item.name, 
        tickedOff: !item.tickedOff 
      });
      await fetchList();
    } catch (err) {
      console.error("Fehler beim Aktualisieren des Items:", err);
      setError("Item konnte nicht aktualisiert werden: " + err.message);
    }
  }

  async function handleDeleteAll() {
    if (!window.confirm("Alle Packlisten-Einträge für diese Reise löschen?")) return;
    setLoading(true);
    setError("");
    try {
      // Verwende den deleteAll Endpoint
      const res = await fetch(`http://localhost:8080/PackingList/?tripId=${selectedTrip}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(await res.text());
      await fetchList();
    } catch (err) {
      console.error("Fehler beim Löschen aller Items:", err);
      setError("Items konnten nicht gelöscht werden: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (error) return <main><div className="alert alert-error" role="alert">{error}</div></main>;

  return (
    <main>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Packliste</h2>
        </div>

        <div className="form-group">
          <label>Geschäftsreise auswählen:</label>
          <select value={selectedTrip} onChange={e => setSelectedTrip(e.target.value)}>
            <option value="">Bitte wählen...</option>
            {trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>

        {selectedTrip && (
          <>
            <div className="card">
              <h3>KI-Packliste generieren</h3>
              <p>Fülle die Felder aus, damit die KI eine passende Packliste erstellen kann.</p>
              
              <form onSubmit={handleGenerate}>
                <div className="form-group">
                  <label>Zielort:</label>
                  <input 
                    value={generationData.zielohrt} 
                    onChange={e => setGenerationData({...generationData, zielohrt: e.target.value})} 
                    placeholder="z.B. Berlin"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Geschlecht:</label>
                  <select 
                    value={generationData.geschlecht} 
                    onChange={e => setGenerationData({...generationData, geschlecht: e.target.value})}
                  >
                    <option value="männlich">Männlich</option>
                    <option value="weiblich">Weiblich</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Startdatum:</label>
                  <input 
                    type="date"
                    value={generationData.startDatum} 
                    onChange={e => setGenerationData({...generationData, startDatum: e.target.value})} 
                  />
                </div>
                
                <div className="form-group">
                  <label>Enddatum:</label>
                  <input 
                    type="date"
                    value={generationData.endDatum} 
                    onChange={e => setGenerationData({...generationData, endDatum: e.target.value})} 
                  />
                </div>
                
                <div className="form-group">
                  <label>Besonderheiten:</label>
                  <textarea 
                    value={generationData.besonderheiten} 
                    onChange={e => setGenerationData({...generationData, besonderheiten: e.target.value})} 
                    placeholder="z.B. Konferenz, Winter, formelle Kleidung"
                  />
                </div>
                
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? <span className="spinner"></span> : ""}
                  {loading ? "Generiere..." : "KI-Packliste generieren"}
                </button>
              </form>
            </div>

            <div className="card">
              <h3>Manuelle Einträge</h3>
              <form onSubmit={handleAddItem} className="flex gap-8">
                <input 
                  value={newItemName} 
                  onChange={e => setNewItemName(e.target.value)} 
                  placeholder="Neuen Gegenstand hinzufügen" 
                  className="flex-1"
                />
                <button type="submit" className="btn btn-secondary" disabled={!newItemName}>
                  Hinzufügen
                </button>
              </form>

              {loading && <div className="loading"><span className="spinner"></span> Lade Packliste...</div>}
              
              {items.length > 0 && (
                <div className="packing-list">
                  <ul>
                    {items.map((item) => (
                      <li key={item.id || item.name} className="packing-item">
                        <input 
                          type="checkbox" 
                          checked={item.tickedOff} 
                          onChange={() => handleToggleTicked(item)} 
                        />
                        <span className={`item-name ${item.tickedOff ? 'completed' : ''}`}>
                          {item.name}
                        </span>
                        <button onClick={() => handleDeleteItem(item.id)} className="btn btn-danger">
                          Löschen
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button onClick={handleDeleteAll} className="btn btn-danger mt-24">
                    Ganze Liste löschen
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  // Beim Start: Token und Rolle aus localStorage laden
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (storedToken) {
      setIsLoggedIn(true);
      setToken(storedToken);
      setRole(storedRole);
    }
  }, []);

  function handleLogin(token, role) {
    setIsLoggedIn(true);
    setToken(token);
    setRole(role);
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
  }
  function handleLogout() {
    setIsLoggedIn(false);
    setToken(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }
  function handleRegister(token, role) {
    setIsLoggedIn(true);
    setToken(token);
    setRole(role);
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
  }

  function renderTrip(t) {
    return (
      <div className="product" key={t.id}>
        <figure>
          <div>
            <img src={"images/items/" + t.id + ".jpg"} alt="name " />
          </div>
          <figcaption>
            <a href="#. . . ">{t.title}</a>
            <div>
              <span>
                {t.startTrip[2] + "-" + t.startTrip[1] + "-" + t.startTrip[0]}
              </span>
            </div>
            <p>{t.description}</p>
            <div>
              <button type="button" disabled>
                Add to Triplist
              </button>
            </div>
          </figcaption>
        </figure>
      </div>
    );
  }

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <Register onRegister={handleRegister} />} />
        <Route path="/users" element={isLoggedIn ? <Users token={token} role={role} /> : <Navigate to="/login" />} />
        <Route path="/trips" element={isLoggedIn ? <Trips token={token} /> : <Navigate to="/login" />} />
        <Route path="/expenses" element={isLoggedIn ? <Expenses token={token} role={role} /> : <Navigate to="/login" />} />
        <Route path="/currency" element={isLoggedIn ? <Currency token={token} /> : <Navigate to="/login" />} />
        <Route path="/packinglist" element={isLoggedIn ? <PackingList token={token} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
      <Footer />
    </Router>
  );
}
