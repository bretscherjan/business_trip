export async function fetchPackingList(token, tripId) {
  const res = await fetch(`/PackingList?tripId=${tripId}`, {
    headers: { "Authorization": token }
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function generatePackingList(token, tripId, generationData) {
  const res = await fetch(`/PackingList/Generate?tripId=${tripId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": token },
    body: JSON.stringify(generationData)
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function addPackingItem(token, tripId, item) {
  const res = await fetch(`/PackingList/addItem?tripId=${tripId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": token },
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function editPackingItem(token, tripId, id, item) {
  const res = await fetch(`/PackingList/editItem/${id}?tripId=${tripId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": token },
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function deletePackingItem(token, tripId, id) {
  const res = await fetch(`/PackingList/${id}?tripId=${tripId}`, {
    method: "DELETE",
    headers: { "Authorization": token }
  });
  if (!res.ok) throw new Error(await res.text());
} 