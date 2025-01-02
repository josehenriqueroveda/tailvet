import Cookies from "js-cookie";

const authenticatedFetcher = async (url) => {
  const token = Cookies.get("authToken");
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

export default authenticatedFetcher;
