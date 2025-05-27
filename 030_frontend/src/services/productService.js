const baseUrl = import.meta.env.VITE_API_BASE_URL;

export async function getProducts(category) {
  const response = await fetch(baseUrl + "/products?category=" + category);
  if (response.ok) return response.json();
  throw response;
}

export async function getProduct(id) {
  const response = await fetch(baseUrl + "products/" + id);
  if (response.ok) return response.json();
  throw response;
}

export async function storeProduct(data) {
  const response = await fetch(baseUrl + "products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (response.ok) return response.json();
  throw response;
}

export async function updateProduct(data) {
  const response = await fetch(baseUrl + "products/" + data.id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (response.ok) return response.json();
  throw response;
}

export async function deleteProduct(id) {
  const response = await fetch(baseUrl + "products/" + id, { method: "DELETE" });
  if (response.ok) return response.json();
  throw response;
}
