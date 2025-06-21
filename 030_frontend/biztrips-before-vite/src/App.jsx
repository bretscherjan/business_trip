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
    <main style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Benutzername</label>
          <input value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Passwort</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button className="btn" type="submit">Login</button>
        {error && <div role="alert">{error}</div>}
      </form>
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
    <main style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Registrieren</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Benutzername</label>
          <input value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Passwort</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>E-Mail</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Telefonnummer</label>
          <input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
        </div>
        <div>
          <label>Rolle</label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="MITARBEITER">Mitarbeiter</option>
            <option value="TEAMLEAD">Teamlead</option>
          </select>
        </div>
        <button className="btn" type="submit">Registrieren</button>
        {error && <div role="alert">{error}</div>}
      </form>
    </main>
  );
}

function Dashboard() {
  return (
    <main>
      <h1>BusinessTrip Dashboard</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, marginTop: 32 }}>
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
    <Link to={to} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: '#fff', border: '1px solid #eaeaea', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      width: 180, height: 140, textDecoration: 'none', color: '#111', fontWeight: 600, fontSize: 18, transition: 'box-shadow 0.2s',
    }}>
      <span style={{ fontSize: 40, marginBottom: 12 }}>{icon}</span>
      {label}
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

  if (loading) return <main><p>Lade Teilnehmer...</p></main>;
  if (error) return <main><div role="alert">{error}</div></main>;

  return (
    <main>
      <h2>Teilnehmerverwaltung</h2>
      {role === "TEAMLEAD" && (
        <button className="btn" onClick={handleExport} disabled={csvLoading} style={{ marginBottom: 16 }}>
          {csvLoading ? "Exportiere..." : "Export als CSV"}
        </button>
      )}
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 600 }}>
          <thead>
            <tr style={{ background: "#f6f6f6" }}>
              <th style={{ textAlign: "left", padding: 8 }}>Benutzername</th>
              <th style={{ textAlign: "left", padding: 8 }}>E-Mail</th>
              <th style={{ textAlign: "left", padding: 8 }}>Telefon</th>
              <th style={{ textAlign: "left", padding: 8 }}>Rolle</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={{ padding: 8 }}>{u.username}</td>
                <td style={{ padding: 8 }}>{u.email}</td>
                <td style={{ padding: 8 }}>{u.phoneNumber || "-"}</td>
                <td style={{ padding: 8 }}>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

  if (loading) return <main><p>Lade Geschäftsreisen...</p></main>;
  if (error) return <main><div role="alert">{error}</div></main>;

  return (
    <main>
      <h2>Geschäftsreisen</h2>
      <button className="btn" onClick={handleNew} style={{ marginBottom: 16 }}>Neue Geschäftsreise</button>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 700 }}>
          <thead>
            <tr style={{ background: "#f6f6f6" }}>
              <th style={{ textAlign: "left", padding: 8 }}>Titel</th>
              <th style={{ textAlign: "left", padding: 8 }}>Beschreibung</th>
              <th style={{ textAlign: "left", padding: 8 }}>Start</th>
              <th style={{ textAlign: "left", padding: 8 }}>Ende</th>
              <th style={{ textAlign: "left", padding: 8 }}>Zielort</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {trips.map(trip => (
              <tr key={trip.id}>
                <td style={{ padding: 8 }}>{trip.title}</td>
                <td style={{ padding: 8 }}>{trip.description}</td>
                <td style={{ padding: 8 }}>{trip.startDate}</td>
                <td style={{ padding: 8 }}>{trip.endDate}</td>
                <td style={{ padding: 8 }}>{trip.destination}</td>
                <td style={{ padding: 8 }}>
                  <button className="btn" style={{ marginRight: 8 }} onClick={() => handleEdit(trip)}>Bearbeiten</button>
                  <button className="btn" onClick={() => handleDelete(trip.id)}>Löschen</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div style={{ background: "#fff", border: "1px solid #eaeaea", borderRadius: 8, padding: 24, maxWidth: 400, margin: "32px auto" }}>
          <h3>{editTrip ? "Geschäftsreise bearbeiten" : "Neue Geschäftsreise"}</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Titel</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div>
              <label>Beschreibung</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <label>Startdatum</label>
              <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} required />
            </div>
            <div>
              <label>Enddatum</label>
              <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} required />
            </div>
            <div>
              <label>Zielort</label>
              <input value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} required />
            </div>
            <button className="btn" type="submit">{editTrip ? "Speichern" : "Anlegen"}</button>
            <button className="btn" type="button" style={{ marginLeft: 8 }} onClick={() => setShowForm(false)}>Abbrechen</button>
            {formError && <div role="alert">{formError}</div>}
          </form>
        </div>
      )}
    </main>
  );
}

function Expenses({ token }) {
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

  return (
    <main>
      <h2>Spesen/Kassenbons</h2>
      <div style={{ marginBottom: 16 }}>
        <label>Geschäftsreise:&nbsp;</label>
        <select value={selectedTrip} onChange={e => setSelectedTrip(e.target.value)}>
          <option value="">Bitte wählen...</option>
          {trips.map(t => (
            <option key={t.id} value={t.id}>{t.title} ({t.destination})</option>
          ))}
        </select>
        {selectedTrip && (
          <button className="btn" style={{ marginLeft: 16 }} onClick={() => setShowForm(true)}>Neue Spese</button>
        )}
      </div>
      {loading && <p>Lade Spesen...</p>}
      {error && <div role="alert">{error}</div>}
      {selectedTrip && !loading && !error && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 600 }}>
            <thead>
              <tr style={{ background: "#f6f6f6" }}>
                <th style={{ textAlign: "left", padding: 8 }}>Betrag</th>
                <th style={{ textAlign: "left", padding: 8 }}>Währung</th>
                <th style={{ textAlign: "left", padding: 8 }}>Beschreibung</th>
                <th style={{ textAlign: "left", padding: 8 }}>Datum</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e, idx) => (
                <tr key={e.id ?? idx}>
                  <td style={{ padding: 8 }}>{e.amount}</td>
                  <td style={{ padding: 8 }}>{e.currency}</td>
                  <td style={{ padding: 8 }}>{e.description}</td>
                  <td style={{ padding: 8 }}>{e.date}</td>
                  <td style={{ padding: 8 }}>
                    {e.id ? (
                      <button className="btn" onClick={() => handleDelete(e.id)}>Löschen</button>
                    ) : (
                      <span style={{ color: 'gray' }}>Keine ID</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showForm && (
        <div style={{ background: "#fff", border: "1px solid #eaeaea", borderRadius: 8, padding: 24, maxWidth: 400, margin: "32px auto" }}>
          <h3>Neue Spese</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Betrag</label>
              <input type="number" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
            </div>
            <div>
              <label>Währung</label>
              <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}>
                <option value="CHF">CHF</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div>
              <label>Beschreibung</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <button className="btn" type="submit">Anlegen</button>
            <button className="btn" type="button" style={{ marginLeft: 8 }} onClick={() => setShowForm(false)}>Abbrechen</button>
            {formError && <div role="alert">{formError}</div>}
          </form>
        </div>
      )}
    </main>
  );
}

function Currency({ token }) {
  const [trips, setTrips] = React.useState([]);
  const [selectedTrip, setSelectedTrip] = React.useState("");
  const [toCurrency, setToCurrency] = React.useState("CHF");
  const [sums, setSums] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    fetchTrips(token).then(setTrips).catch(() => {});
  }, [token]);

  React.useEffect(() => {
    if (selectedTrip && toCurrency) {
      setLoading(true);
      fetchConvertedSums(token, selectedTrip, toCurrency)
        .then(setSums)
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    } else {
      setSums(null);
    }
  }, [selectedTrip, toCurrency, token]);

  async function handleCalculate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetchConvertedSums(token, selectedTrip, toCurrency);
      setSums(res);
    } catch (err) {
      setError(err.message);
      setSums(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h2>Währungsrechner</h2>
      <div style={{ marginBottom: 16 }}>
        <label>Geschäftsreise:&nbsp;</label>
        <select value={selectedTrip} onChange={e => setSelectedTrip(e.target.value)}>
          <option value="">Bitte wählen...</option>
          {trips.map(t => (
            <option key={t.id} value={t.id}>{t.title} ({t.destination})</option>
          ))}
        </select>
        <label style={{ marginLeft: 16 }}>Zielwährung:&nbsp;</label>
        <select value={toCurrency} onChange={e => setToCurrency(e.target.value)}>
          <option value="CHF">CHF</option>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
        </select>
        <button className="btn" style={{ marginLeft: 16 }} onClick={handleCalculate} disabled={!selectedTrip || loading}>
          {loading ? "Berechne..." : "Berechnen"}
        </button>
      </div>
      {error && <div role="alert">{error}</div>}
      {sums && (
        <div style={{ overflowX: "auto", marginTop: 24 }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 400 }}>
            <thead>
              <tr style={{ background: "#f6f6f6" }}>
                <th style={{ textAlign: "left", padding: 8 }}>User-ID</th>
                <th style={{ textAlign: "left", padding: 8 }}>Summe ({toCurrency})</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(sums).map(([userId, sum]) => (
                <tr key={userId}>
                  <td style={{ padding: 8 }}>{userId}</td>
                  <td style={{ padding: 8 }}>{sum.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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

  if (error) return <main><div role="alert" style={{color: 'red', padding: '10px', backgroundColor: '#ffe6e6', border: '1px solid #ff9999', borderRadius: '4px'}}>{error}</div></main>;

  return (
    <main>
      <h2>Packliste</h2>

      <div style={{ marginBottom: 24 }}>
        <label htmlFor="trip-select" style={{ marginRight: 8 }}>Geschäftsreise auswählen:</label>
        <select id="trip-select" value={selectedTrip} onChange={e => setSelectedTrip(e.target.value)}>
          <option value="">Bitte wählen...</option>
          {trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </div>

      {selectedTrip && (
        <>
          <form onSubmit={handleGenerate} style={{ marginBottom: 24, padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <h3>KI-Packliste generieren</h3>
            <p>Fülle die Felder aus, damit die KI eine passende Packliste erstellen kann.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label htmlFor="zielort">Zielort:</label>
                <input 
                  id="zielort"
                  value={generationData.zielohrt} 
                  onChange={e => setGenerationData({...generationData, zielohrt: e.target.value})} 
                  placeholder="z.B. Berlin"
                  style={{ width: '100%', padding: '8px' }}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="geschlecht">Geschlecht:</label>
                <select 
                  id="geschlecht"
                  value={generationData.geschlecht} 
                  onChange={e => setGenerationData({...generationData, geschlecht: e.target.value})}
                  style={{ width: '100%', padding: '8px' }}
                >
                  <option value="männlich">Männlich</option>
                  <option value="weiblich">Weiblich</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="startdatum">Startdatum:</label>
                <input 
                  id="startdatum"
                  type="date"
                  value={generationData.startDatum} 
                  onChange={e => setGenerationData({...generationData, startDatum: e.target.value})} 
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              
              <div>
                <label htmlFor="enddatum">Enddatum:</label>
                <input 
                  id="enddatum"
                  type="date"
                  value={generationData.endDatum} 
                  onChange={e => setGenerationData({...generationData, endDatum: e.target.value})} 
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="besonderheiten">Besonderheiten:</label>
              <textarea 
                id="besonderheiten"
                value={generationData.besonderheiten} 
                onChange={e => setGenerationData({...generationData, besonderheiten: e.target.value})} 
                placeholder="z.B. Konferenz, Winter, formelle Kleidung"
                style={{ width: '100%', padding: '8px', minHeight: '60px' }}
              />
            </div>
            
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Generiere..." : "KI-Packliste generieren"}
            </button>
          </form>

          <form onSubmit={handleAddItem} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            <input 
              value={newItemName} 
              onChange={e => setNewItemName(e.target.value)} 
              placeholder="Neuen Gegenstand hinzufügen" 
              style={{ flexGrow: 1, padding: '8px' }}
            />
            <button type="submit" className="btn-secondary" disabled={!newItemName}>Hinzufügen</button>
          </form>

          {loading && <p>Lade Packliste...</p>}
          
          {items.length > 0 && (
            <>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {items.map((item) => (
                  <li key={item.id || item.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #eee' }}>
                    <input 
                      type="checkbox" 
                      checked={item.tickedOff} 
                      onChange={() => handleToggleTicked(item)} 
                      style={{ width: 20, height: 20 }}
                    />
                    <span style={{ flexGrow: 1, textDecoration: item.tickedOff ? 'line-through' : 'none' }}>
                      {item.name}
                    </span>
                    <button onClick={() => handleDeleteItem(item.id)} className="btn-danger" style={{ padding: '4px 8px' }}>Löschen</button>
                  </li>
                ))}
              </ul>
              <button onClick={handleDeleteAll} className="btn-danger" style={{ marginTop: 24 }}>
                Ganze Liste löschen
              </button>
            </>
          )}
        </>
      )}
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
        <Route path="/expenses" element={isLoggedIn ? <Expenses token={token} /> : <Navigate to="/login" />} />
        <Route path="/currency" element={isLoggedIn ? <Currency token={token} /> : <Navigate to="/login" />} />
        <Route path="/packinglist" element={isLoggedIn ? <PackingList token={token} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
      <Footer />
    </Router>
  );
}
