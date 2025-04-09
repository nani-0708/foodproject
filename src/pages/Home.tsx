import { useEffect, useState } from "react";
import { fetchSwiggyRestaurants } from "@/api/swiggy";
import { fetchZomatoRestaurants } from "@/api/zomatoMock";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "@/hooks/use-location";
import { Button } from "@/components/ui/button";
import { MapPin, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const { coords, loading: locationLoading, error: locationError } = useLocation();
  const [swiggyRestaurants, setSwiggyRestaurants] = useState<any[]>([]);
  const [zomatoRestaurants, setZomatoRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const defaultLat = "17.385044";
  const defaultLng = "78.486671";

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true);
        
        const latitude = coords?.latitude.toString() || defaultLat;
        const longitude = coords?.longitude.toString() || defaultLng;
        
        if (coords) {
          toast({
            title: "Using your current location",
            description: `Latitude: ${latitude.substring(0, 8)}, Longitude: ${longitude.substring(0, 8)}`,
            duration: 3000,
          });
        }
        
        const swiggyData = await fetchSwiggyRestaurants(latitude, longitude);
        const swiggyList = swiggyData?.data?.cards
          .map((card: any) => card.card?.card?.info)
          .filter(Boolean);
        setSwiggyRestaurants(swiggyList || []);

        const zomatoData = await fetchZomatoRestaurants();
        setZomatoRestaurants(zomatoData);
      } catch (error) {
        console.error(error);
        setError("Failed to load restaurant data");
      } finally {
        setLoading(false);
      }
    };

    if (!locationLoading || locationError) {
      loadRestaurants();
    }
  }, [coords, locationLoading, locationError, toast]);

  if (locationError && !loading) {
    return (
      <div className="p-6 text-center">
        <div className="bg-yellow-50 p-4 mb-4 rounded-lg flex items-center justify-center gap-2">
          <AlertCircle className="text-yellow-500" />
          <p className="text-yellow-700">
            {locationError} - Using default location instead
          </p>
        </div>
        
        <div className="mt-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Restaurant Comparison</h1>
          <div className="flex items-center justify-center mb-6 text-gray-600">
            <MapPin className="mr-2" />
            <span>Using default location: Hyderabad, India</span>
          </div>
          
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
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Restaurant Comparison</h1>
      
      {coords && (
        <div className="flex items-center justify-center mb-6 text-gray-600">
          <MapPin className="mr-2" />
          <span>Using your current location</span>
        </div>
      )}
      
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
