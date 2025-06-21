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

  function loadTrips() {
    setLoading(true);
    fetchTrips(token)
      .then(setTrips)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }
  React.useEffect(loadTrips, [token]);

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
    loadTrips();
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
      loadTrips();
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
    fetchTrips().then(setTrips).catch(() => {});
  }, []);

  React.useEffect(() => {
    if (selectedTrip) {
      setLoading(true);
      fetchExpenses(selectedTrip)
        .then(setExpenses)
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    } else {
      setExpenses([]);
    }
  }, [selectedTrip]);

  async function handleDelete(id) {
    if (!window.confirm("Spese wirklich löschen?")) return;
    await deleteExpense(id);
    setExpenses(expenses => expenses.filter(e => e.id !== id));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    try {
      await createExpense({ ...form, tripId: selectedTrip });
      setShowForm(false);
      setForm({ amount: "", currency: "CHF", description: "" });
      setLoading(true);
      fetchExpenses(selectedTrip)
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
              {expenses.map(e => (
                <tr key={e.id}>
                  <td style={{ padding: 8 }}>{e.amount}</td>
                  <td style={{ padding: 8 }}>{e.currency}</td>
                  <td style={{ padding: 8 }}>{e.description}</td>
                  <td style={{ padding: 8 }}>{e.date}</td>
                  <td style={{ padding: 8 }}>
                    <button className="btn" onClick={() => handleDelete(e.id)}>Löschen</button>
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
    fetchTrips().then(setTrips).catch(() => {});
  }, []);

  async function handleCalculate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetchConvertedSums(selectedTrip, toCurrency);
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
  const [packingList, setPackingList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showGenForm, setShowGenForm] = React.useState(false);
  const [genForm, setGenForm] = React.useState({ zielohrt: "", geschlecht: "", startDatum: "", endDatum: "", besonderheiten: "" });
  const [addItemName, setAddItemName] = React.useState("");
  const [editIdx, setEditIdx] = React.useState(null);
  const [editName, setEditName] = React.useState("");

  React.useEffect(() => {
    fetchTrips().then(setTrips).catch(() => {});
  }, []);

  React.useEffect(() => {
    if (selectedTrip) {
      setLoading(true);
      setError("");
      import("./services/packingListService").then(({ fetchPackingList }) =>
        fetchPackingList(selectedTrip)
          .then(setPackingList)
          .catch(e => setPackingList([]))
          .finally(() => setLoading(false))
      );
    } else {
      setPackingList([]);
    }
  }, [selectedTrip]);

  function reload() {
    if (selectedTrip) {
      setLoading(true);
      setError("");
      import("./services/packingListService").then(({ fetchPackingList }) =>
        fetchPackingList(selectedTrip)
          .then(setPackingList)
          .catch(e => setPackingList([]))
          .finally(() => setLoading(false))
      );
    }
  }

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { generatePackingList } = await import("./services/packingListService");
      await generatePackingList(selectedTrip, genForm);
      setShowGenForm(false);
      reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddItem(e) {
    e.preventDefault();
    if (!addItemName.trim()) return;
    setLoading(true);
    setError("");
    try {
      const { addPackingItem } = await import("./services/packingListService");
      await addPackingItem(selectedTrip, { name: addItemName, tickedOff: false });
      setAddItemName("");
      reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteItem(idx) {
    setLoading(true);
    setError("");
    try {
      const { deletePackingItem } = await import("./services/packingListService");
      await deletePackingItem(selectedTrip, packingList[idx].id);
      reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleEditItem(idx) {
    setLoading(true);
    setError("");
    try {
      const { editPackingItem } = await import("./services/packingListService");
      await editPackingItem(selectedTrip, packingList[idx].id, { name: editName, tickedOff: packingList[idx].tickedOff });
      setEditIdx(null);
      setEditName("");
      reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleTicked(idx) {
    setLoading(true);
    setError("");
    try {
      const { editPackingItem } = await import("./services/packingListService");
      await editPackingItem(selectedTrip, packingList[idx].id, { name: packingList[idx].name, tickedOff: !packingList[idx].tickedOff });
      reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAll() {
    if (!window.confirm("Alle Packlisten-Einträge für diese Reise löschen?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/PackingList/?tripId=${selectedTrip}`, {
        method: "DELETE",
        headers: { "Authorization": token }
      });
      if (!res.ok) throw new Error(await res.text());
      reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h2>Packliste</h2>
      <div style={{ marginBottom: 16 }}>
        <label>Geschäftsreise:&nbsp;</label>
        <select value={selectedTrip} onChange={e => setSelectedTrip(e.target.value)}>
          <option value="">Bitte wählen...</option>
          {trips.map(t => (
            <option key={t.id} value={t.id}>{t.title} ({t.destination})</option>
          ))}
        </select>
        {selectedTrip && (
          <>
            <button className="btn" style={{ marginLeft: 16 }} onClick={() => setShowGenForm(s => !s)}>
              {showGenForm ? "Abbrechen" : "Packliste generieren (KI)"}
            </button>
            <button className="btn" style={{ marginLeft: 8 }} onClick={handleDeleteAll}>Alle löschen</button>
          </>
        )}
      </div>
      {showGenForm && (
        <form onSubmit={handleGenerate} style={{ background: "#fff", border: "1px solid #eaeaea", borderRadius: 8, padding: 16, marginBottom: 16, maxWidth: 500 }}>
          <h4>Packliste generieren (KI)</h4>
          <div>
            <label>Zielort</label>
            <input value={genForm.zielohrt} onChange={e => setGenForm(f => ({ ...f, zielohrt: e.target.value }))} required />
          </div>
          <div>
            <label>Geschlecht</label>
            <select value={genForm.geschlecht} onChange={e => setGenForm(f => ({ ...f, geschlecht: e.target.value }))} required>
              <option value="">Bitte wählen...</option>
              <option value="männlich">Männlich</option>
              <option value="weiblich">Weiblich</option>
              <option value="divers">Divers</option>
            </select>
          </div>
          <div>
            <label>Startdatum</label>
            <input type="date" value={genForm.startDatum} onChange={e => setGenForm(f => ({ ...f, startDatum: e.target.value }))} required />
          </div>
          <div>
            <label>Enddatum</label>
            <input type="date" value={genForm.endDatum} onChange={e => setGenForm(f => ({ ...f, endDatum: e.target.value }))} required />
          </div>
          <div>
            <label>Besonderheiten</label>
            <input value={genForm.besonderheiten} onChange={e => setGenForm(f => ({ ...f, besonderheiten: e.target.value }))} />
          </div>
          <button className="btn" type="submit">Generieren</button>
        </form>
      )}
      {error && <div role="alert" style={{ color: "red" }}>{error}</div>}
      {loading && <p>Lade...</p>}
      {selectedTrip && !loading && (
        <>
          <form onSubmit={handleAddItem} style={{ marginBottom: 16 }}>
            <input value={addItemName} onChange={e => setAddItemName(e.target.value)} placeholder="Neues Item..." required />
            <button className="btn" type="submit">Hinzufügen</button>
          </form>
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 400 }}>
              <thead>
                <tr style={{ background: "#f6f6f6" }}>
                  <th style={{ textAlign: "left", padding: 8 }}>Erledigt</th>
                  <th style={{ textAlign: "left", padding: 8 }}>Name</th>
                  <th style={{ textAlign: "left", padding: 8 }}></th>
                </tr>
              </thead>
              <tbody>
                {packingList.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: 8 }}>
                      <input type="checkbox" checked={item.tickedOff} onChange={() => handleToggleTicked(idx)} />
                    </td>
                    <td style={{ padding: 8 }}>
                      {editIdx === idx ? (
                        <input value={editName} onChange={e => setEditName(e.target.value)} />
                      ) : (
                        item.name
                      )}
                    </td>
                    <td style={{ padding: 8 }}>
                      {editIdx === idx ? (
                        <>
                          <button className="btn" onClick={() => handleEditItem(idx)}>Speichern</button>
                          <button className="btn" onClick={() => { setEditIdx(null); setEditName(""); }}>Abbrechen</button>
                        </>
                      ) : (
                        <>
                          <button className="btn" onClick={() => { setEditIdx(idx); setEditName(item.name); }}>Bearbeiten</button>
                          <button className="btn" onClick={() => handleDeleteItem(idx)}>Löschen</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
