const API_BASE_URL = 'http://localhost:8080';

export async function fetchPackingList(token, tripId) {
  console.log('Fetching packing list for trip:', tripId);
  const res = await fetch(`${API_BASE_URL}/PackingList?tripId=${tripId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error fetching packing list:', res.status, errorText);
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }
  const data = await res.json();
  console.log('Packing list data:', data);
  return data;
}

export async function generatePackingList(token, tripId, generationData) {
  console.log('Generating packing list for trip:', tripId, 'with data:', generationData);
  const res = await fetch(`${API_BASE_URL}/PackingList/Generate?tripId=${tripId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify(generationData)
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error generating packing list:', res.status, errorText);
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }
  const data = await res.json();
  console.log('Generated packing list:', data);
  return data;
}

export async function addPackingItem(token, tripId, item) {
  console.log('Adding packing item for trip:', tripId, 'item:', item);
  const res = await fetch(`${API_BASE_URL}/PackingList/addItem?tripId=${tripId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify(item)
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error adding packing item:', res.status, errorText);
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }
  const data = await res.json();
  console.log('Added packing item:', data);
  return data;
}

export async function editPackingItem(token, tripId, id, item) {
  console.log('Editing packing item:', id, 'for trip:', tripId, 'with data:', item);
  const res = await fetch(`${API_BASE_URL}/PackingList/editItem/${id}?tripId=${tripId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify(item)
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error editing packing item:', res.status, errorText);
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }
  const data = await res.json();
  console.log('Edited packing item:', data);
  return data;
}

export async function deletePackingItem(token, tripId, id) {
  console.log('Deleting packing item:', id, 'for trip:', tripId);
  const res = await fetch(`${API_BASE_URL}/PackingList/${id}?tripId=${tripId}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error deleting packing item:', res.status, errorText);
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }
  console.log('Successfully deleted packing item:', id);
} 