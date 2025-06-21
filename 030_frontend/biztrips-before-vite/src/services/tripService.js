const baseUrl = "http://localhost:8080";

export async function fetchTrips(token) {
  const res = await fetch(`${baseUrl}/trips`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Fetch trips error:", errorText); // Log the error
    throw new Error(errorText);
  }
  return await res.json();
}

export async function createTrip(trip, token) {
  const res = await fetch(`${baseUrl}/trips`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(trip)
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function updateTrip(id, trip, token) {
  const res = await fetch(`${baseUrl}/trips/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(trip)
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function deleteTrip(id, token) {
  const res = await fetch(`${baseUrl}/trips/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error(await res.text());
}