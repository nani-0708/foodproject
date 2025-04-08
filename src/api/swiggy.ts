
export async function fetchSwiggyRestaurants(lat: string, lng: string) {
  const url = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${lat}&lng=${lng}&page_type=DESKTOP_WEB_LISTING`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Swiggy data");
  }

  const data = await response.json();
  return data;
}
