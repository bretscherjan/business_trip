const baseUrl = "http://localhost:8080";

export async function fetchUsers(token) {
  const res = await fetch(`${baseUrl}/users`, {
    headers: { "Authorization": token }
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function exportUsersCsv(token) {
  const res = await fetch(`${baseUrl}/users/export/csv`, {
    headers: { "Authorization": token }
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.text();
} 