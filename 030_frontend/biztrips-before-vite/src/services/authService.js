const baseUrl = "http://localhost:8080";

export async function register(username, password, email, phoneNumber, role) {
  const res = await fetch(`${baseUrl}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email, phoneNumber, role })
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function login(username, password) {
  const res = await fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  localStorage.setItem("token", data.token);
  return data;
}