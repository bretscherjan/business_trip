const baseUrl = "http://localhost:8080";

export async function fetchExpenses(token, tripId) {
  const res = await fetch(`${baseUrl}/expenses/user/${tripId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function createExpense(token, expense) {
  const res = await fetch(`${baseUrl}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify(expense)
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function deleteExpense(token, id) {
  const res = await fetch(`${baseUrl}/expenses/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(await res.text());
} 