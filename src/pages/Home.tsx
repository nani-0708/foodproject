
import { useEffect, useState } from "react";
import { fetchSwiggyRestaurants } from "@/api/swiggy";
import { fetchZomatoRestaurants } from "@/api/zomatoMock";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Home = () => {
  const [swiggyRestaurants, setSwiggyRestaurants] = useState<any[]>([]);
  const [zomatoRestaurants, setZomatoRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true);
        // Fetch Swiggy restaurants
        const swiggyData = await fetchSwiggyRestaurants("17.385044", "78.486671");
        const swiggyList = swiggyData?.data?.cards
          .map((card: any) => card.card?.card?.info)
          .filter(Boolean);
        setSwiggyRestaurants(swiggyList || []);

        // Fetch Zomato restaurants
        const zomatoData = await fetchZomatoRestaurants();
        setZomatoRestaurants(zomatoData);
      } catch (error) {
        console.error(error);
        setError("Failed to load restaurant data");
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">{error}</p>
        <p className="mt-2">Note: The Swiggy API might be blocked by CORS policies in the browser.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Restaurant Comparison</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Swiggy 🧡</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="mb-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))
            ) : swiggyRestaurants.length > 0 ? (
              swiggyRestaurants.map((r) => (
                <div key={r.id} className="border p-4 rounded-xl shadow-sm mb-4">
                  <h2 className="font-semibold">{r.name}</h2>
                  <p>⭐ {r.avgRating} | ⏱️ {r.sla?.deliveryTime} mins</p>
                  <p>{r.cuisines?.join(", ")}</p>
                </div>
              ))
            ) : (
              <p>No Swiggy restaurants found</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Zomato ❤️</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="mb-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))
            ) : zomatoRestaurants.length > 0 ? (
              zomatoRestaurants.map((r) => (
                <div key={r.id} className="border p-4 rounded-xl shadow-sm mb-4">
                  <h2 className="font-semibold">{r.name}</h2>
                  <p>⭐ {r.avgRating} | ⏱️ {r.deliveryTime} mins</p>
                  <p>{r.cuisines.join(", ")}</p>
                </div>
              ))
            ) : (
              <p>No Zomato restaurants found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
