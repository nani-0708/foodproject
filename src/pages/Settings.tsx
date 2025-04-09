
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useRealTimePrices } from "@/hooks/use-real-time-prices";
import { useLocation } from "@/hooks/use-location";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { Check, Link, AlertCircle, MapPin, RefreshCw } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// List of popular cities with their approximate coordinates
const popularCities = [
  { name: "New Delhi", lat: "28.6139", lng: "77.2090" },
  { name: "Mumbai", lat: "19.0760", lng: "72.8777" },
  { name: "Bangalore", lat: "12.9716", lng: "77.5946" },
  { name: "Hyderabad", lat: "17.3850", lng: "78.4867" },
  { name: "Chennai", lat: "13.0827", lng: "80.2707" },
  { name: "Kolkata", lat: "22.5726", lng: "88.3639" },
  { name: "Pune", lat: "18.5204", lng: "73.8567" },
  { name: "Ahmedabad", lat: "23.0225", lng: "72.5714" },
  { name: "Jaipur", lat: "26.9124", lng: "75.7873" },
  { name: "Lucknow", lat: "26.8467", lng: "80.9462" }
];

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, connectedApps, connectApp, disconnectApp } = useRealTimePrices([]);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const { coords, loading: locationLoading, error: locationError } = useLocation();
  const [useCustomLocation, setUseCustomLocation] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [customCity, setCustomCity] = useState("");
  
  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      // Redirect to login page if not logged in
      navigate('/login', { state: { redirectTo: '/settings' } });
    }
    
    // Initialize location settings with saved values if they exist
    const savedCity = localStorage.getItem('customCity');
    const savedUseCustom = localStorage.getItem('useCustomLocation');
    
    if (savedCity) {
      // Check if it's one of our popular cities
      const foundCity = popularCities.find(city => city.name === savedCity);
      if (foundCity) {
        setSelectedCity(savedCity);
      } else {
        setCustomCity(savedCity);
        setSelectedCity("custom");
      }
    }
    
    if (savedUseCustom) setUseCustomLocation(savedUseCustom === 'true');
  }, [navigate]);
  
  const handleToggleConnection = async (platform: string, isCurrentlyConnected: boolean) => {
    if (!isCurrentlyConnected) {
      // Start connecting
      setIsConnecting(platform);
      
      // Simulate API call to connect account
      setTimeout(() => {
        connectApp(platform);
        toast({
          title: `${platform} Connected`,
          description: `Your ${platform} account has been successfully connected.`,
        });
        setIsConnecting(null);
      }, 1500);
    } else {
      // Disconnect the account
      disconnectApp(platform);
      toast({
        title: `${platform} Disconnected`,
        description: `Your ${platform} account has been disconnected.`,
      });
    }
  };

  const refreshLocation = () => {
    // Reload the page to trigger location access again
    window.location.reload();
  };

  const saveLocationPreferences = () => {
    if (useCustomLocation) {
      // Validate city selection
      if (selectedCity === "") {
        toast({
          title: "No City Selected",
          description: "Please select a city or enter a custom city name.",
          variant: "destructive"
        });
        return;
      }
      
      let cityToSave: string;
      let latToSave: string;
      let lngToSave: string;
      
      if (selectedCity === "custom") {
        if (!customCity.trim()) {
          toast({
            title: "Invalid City",
            description: "Please enter a valid city name.",
            variant: "destructive"
          });
          return;
        }
        
        // For custom cities, we'll use a default coordinate (Hyderabad in this case)
        // In a real app, you would use a geocoding API here
        cityToSave = customCity.trim();
        latToSave = "17.385044";
        lngToSave = "78.486671";
      } else {
        // Get coordinates for the selected city
        const cityData = popularCities.find(city => city.name === selectedCity);
        if (!cityData) {
          toast({
            title: "City Not Found",
            description: "Unable to find coordinates for the selected city.",
            variant: "destructive"
          });
          return;
        }
        
        cityToSave = cityData.name;
        latToSave = cityData.lat;
        lngToSave = cityData.lng;
      }
      
      // Save custom location to localStorage
      localStorage.setItem('customCity', cityToSave);
      localStorage.setItem('customLat', latToSave);
      localStorage.setItem('customLng', lngToSave);
      localStorage.setItem('useCustomLocation', 'true');
      
      toast({
        title: "Location Saved",
        description: `Your location has been set to ${cityToSave}.`,
      });
    } else {
      // Remove custom location from localStorage and use browser's geolocation
      localStorage.removeItem('customCity');
      localStorage.removeItem('customLat');
      localStorage.removeItem('customLng');
      localStorage.setItem('useCustomLocation', 'false');
      
      toast({
        title: "Using Device Location",
        description: "Your app will now use your device's location for restaurant searches.",
      });
    }
    
    // Navigate back to home to see results with new location
    navigate('/home');
  };
  
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                Please log in to access your account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => navigate('/login')} className="bg-food-orange hover:bg-food-orange/90">
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
          
          {/* Location Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Location Settings</h2>
            <p className="text-gray-500 mb-6">
              Choose your location for restaurant searches.
            </p>
            
            <Card>
              <CardHeader>
                <CardTitle>Location Preferences</CardTitle>
                <CardDescription>
                  Choose how the app determines your location when displaying nearby restaurants.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Current Location Status */}
                <div className="p-4 rounded-lg bg-gray-100">
                  <div className="font-medium mb-2">Current Location Status:</div>
                  {locationLoading ? (
                    <div className="flex items-center text-blue-600">
                      <span className="mr-2 animate-pulse">Detecting your location...</span>
                    </div>
                  ) : locationError ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-yellow-600">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>{locationError}</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={refreshLocation} className="ml-4">
                        <RefreshCw className="h-3 w-3 mr-1" /> Retry
                      </Button>
                    </div>
                  ) : coords ? (
                    <div className="flex items-center text-green-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>
                        Location detected: {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}
                      </span>
                    </div>
                  ) : (
                    <div className="text-yellow-600">
                      Location status unknown
                    </div>
                  )}
                </div>
                
                {/* Location Preference Toggle */}
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Use Custom Location</div>
                      <p className="text-sm text-gray-500">
                        Select a city instead of using your device location
                      </p>
                    </div>
                    <Switch
                      checked={useCustomLocation}
                      onCheckedChange={setUseCustomLocation}
                    />
                  </div>
                  
                  {useCustomLocation && (
                    <div className="p-4 border rounded-lg space-y-4">
                      <div>
                        <label className="text-sm font-medium block mb-2">Select City</label>
                        <Select
                          value={selectedCity}
                          onValueChange={(value) => setSelectedCity(value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a city" />
                          </SelectTrigger>
                          <SelectContent>
                            {popularCities.map(city => (
                              <SelectItem key={city.name} value={city.name}>
                                {city.name}
                              </SelectItem>
                            ))}
                            <SelectItem value="custom">Other (enter manually)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {selectedCity === "custom" && (
                        <div>
                          <label className="text-sm font-medium block mb-2">Enter City Name</label>
                          <Input
                            type="text"
                            value={customCity}
                            onChange={(e) => setCustomCity(e.target.value)}
                            placeholder="Enter city name"
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={saveLocationPreferences}
                  className="bg-food-orange hover:bg-food-orange/90"
                >
                  Save Location Preferences
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Separator className="my-8" />
          
          {/* Connected Apps Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Connected Food Delivery Accounts</h2>
            <p className="text-gray-500 mb-6">
              Connect your food delivery accounts to compare prices across platforms in real-time.
            </p>
            
            <div className="grid gap-4">
              {connectedApps.map((app) => (
                <Card key={app.platform} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{app.platform}</CardTitle>
                      <Switch
                        checked={app.isConnected}
                        onCheckedChange={() => handleToggleConnection(app.platform, app.isConnected)}
                        disabled={isConnecting === app.platform}
                      />
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center space-x-2 text-sm">
                      <Link className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-500">
                        {app.isConnected 
                          ? `Connected since ${app.lastSync ? new Date(app.lastSync).toLocaleDateString() : 'today'}`
                          : 'Not connected'}
                      </span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="bg-gray-50 border-t">
                    {isConnecting === app.platform ? (
                      <div className="text-sm text-blue-600 animate-pulse flex items-center">
                        <span className="mr-2">Connecting...</span>
                      </div>
                    ) : app.isConnected ? (
                      <div className="text-sm text-green-600 flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        <span>Successfully connected</span>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Connect to see real-time prices from {app.platform}
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg mb-8">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">Demo Mode</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  This is a demonstration app. In a real application, you would be redirected to 
                  the respective platform's authentication page. For demo purposes, connections 
                  are simulated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
