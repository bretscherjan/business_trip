import { useState, useEffect } from "react";

const baseUrl = "http://localhost:8080";

export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
// console.log("baseUrl", baseUrl+"/"+url)

  useEffect(() => {
    async function init() {
      try {
        const response = await fetch(`${baseUrl}/${url}`);
        if (response.ok) {
          const json = await response.json();
          setData(json);
        } else {
          throw response;
        }
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [url]);

  return { data, error, loading };
}
