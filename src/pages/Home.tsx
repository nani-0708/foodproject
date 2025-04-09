
import { useEffect, useState } from "react";
import { fetchSwiggyRestaurants } from "@/api/swiggy";
import { fetchZomatoRestaurants } from "@/api/zomatoMock";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "@/hooks/use-location";
import { Button } from "@/components/ui/button";
import { MapPin, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Home = () => {
  const { coords, loading: locationLoading, error: locationError } = useLocation();
  const [swiggyRestaurants, setSwiggyRestaurants] = useState<any[]>([]);
  const [zomatoRestaurants, setZomatoRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string>("all");
  const { toast } = useToast();

  const defaultLat = "17.385044";
  const defaultLng = "78.486671";

  const refreshLocation = () => {
    // Reload the page to trigger location access again
    window.location.reload();
  };

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

  // Filter restaurants by price range
  const filterByPrice = (restaurants: any[], range: string) => {
    if (range === "all") return restaurants;
    
    // For demo purposes, we'll use a simple random assignment of price categories
    return restaurants.filter((restaurant) => {
      // Use the last digit of the ID to assign a price category (simulating price ranges)
      const id = restaurant.id || "";
      const lastDigit = parseInt(id.toString().slice(-1)) || 0;
      
      switch(range) {
        case "low": return lastDigit >= 0 && lastDigit <= 3;
        case "medium": return lastDigit >= 4 && lastDigit <= 6;
        case "high": return lastDigit >= 7 && lastDigit <= 9;
        default: return true;
      }
    });
  };

  const filteredSwiggyRestaurants = filterByPrice(swiggyRestaurants, priceRange);
  const filteredZomatoRestaurants = filterByPrice(zomatoRestaurants, priceRange);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="p-6 flex-grow">
        <h1 className="text-3xl font-bold mb-4 text-center">Restaurant Comparison</h1>
        
        {/* Location and Price Filter Controls */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          {locationError ? (
            <div className="bg-yellow-50 p-4 mb-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-yellow-500" />
                <p className="text-yellow-700">
                  {locationError} - Using default location instead
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshLocation}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </div>
          ) : coords ? (
            <div className="flex items-center justify-center mb-4 text-gray-600">
              <MapPin className="mr-2" />
              <span>Using your current location</span>
            </div>
          ) : (
            <div className="flex items-center justify-center mb-4 text-gray-600">
              <AlertCircle className="mr-2 text-yellow-500" />
              <span>Using default location: Hyderabad, India</span>
            </div>
          )}
          
          {/* Price Range Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-2">
            <span className="text-gray-700 font-medium">Price Range:</span>
            <div className="flex gap-2">
              <Button 
                variant={priceRange === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setPriceRange("all")}
                className={priceRange === "all" ? "bg-food-orange" : ""}
              >
                All
              </Button>
              <Button 
                variant={priceRange === "low" ? "default" : "outline"}
                size="sm"
                onClick={() => setPriceRange("low")}
                className={priceRange === "low" ? "bg-food-orange" : ""}
              >
                $ Low
              </Button>
              <Button 
                variant={priceRange === "medium" ? "default" : "outline"}
                size="sm"
                onClick={() => setPriceRange("medium")}
                className={priceRange === "medium" ? "bg-food-orange" : ""}
              >
                $$ Medium
              </Button>
              <Button 
                variant={priceRange === "high" ? "default" : "outline"}
                size="sm"
                onClick={() => setPriceRange("high")}
                className={priceRange === "high" ? "bg-food-orange" : ""}
              >
                $$$ High
              </Button>
            </div>
          </div>
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
              ) : filteredSwiggyRestaurants.length > 0 ? (
                filteredSwiggyRestaurants.map((r) => (
                  <div key={r.id} className="border p-4 rounded-xl shadow-sm mb-4">
                    <h2 className="font-semibold">{r.name}</h2>
                    <p>⭐ {r.avgRating} | ⏱️ {r.sla?.deliveryTime} mins</p>
                    <p>{r.cuisines?.join(", ")}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Price Range: {
                        parseInt(r.id.toString().slice(-1)) <= 3 ? "$" : 
                        parseInt(r.id.toString().slice(-1)) <= 6 ? "$$" : 
                        "$$$"
                      }
                    </p>
                  </div>
                ))
              ) : (
                <p>No Swiggy restaurants found matching your criteria</p>
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
              ) : filteredZomatoRestaurants.length > 0 ? (
                filteredZomatoRestaurants.map((r) => (
                  <div key={r.id} className="border p-4 rounded-xl shadow-sm mb-4">
                    <h2 className="font-semibold">{r.name}</h2>
                    <p>⭐ {r.avgRating} | ⏱️ {r.deliveryTime} mins</p>
                    <p>{r.cuisines.join(", ")}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Price Range: {
                        parseInt(r.id.toString().slice(-1)) <= 3 ? "$" : 
                        parseInt(r.id.toString().slice(-1)) <= 6 ? "$$" : 
                        "$$$"
                      }
                    </p>
                  </div>
                ))
              ) : (
                <p>No Zomato restaurants found matching your criteria</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
