const baseUrl = "http://localhost:8080";

export async function fetchConvertedSums(token, tripId, toCurrency) {
  const res = await fetch(`${baseUrl}/expenses/trip/${tripId}/converted?to=${toCurrency}`, {
    headers: { "Authorization": token }
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
} 