
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

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, connectedApps, connectApp, disconnectApp } = useRealTimePrices([]);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const { coords, loading: locationLoading, error: locationError } = useLocation();
  const [useCustomLocation, setUseCustomLocation] = useState(false);
  const [customLat, setCustomLat] = useState("");
  const [customLng, setCustomLng] = useState("");
  
  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      // Redirect to login page if not logged in
      navigate('/login', { state: { redirectTo: '/settings' } });
    }
    
    // Initialize custom location fields with saved values if they exist
    const savedLat = localStorage.getItem('customLat');
    const savedLng = localStorage.getItem('customLng');
    const savedUseCustom = localStorage.getItem('useCustomLocation');
    
    if (savedLat) setCustomLat(savedLat);
    if (savedLng) setCustomLng(savedLng);
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
      // Validate custom coordinates
      if (!customLat || !customLng || isNaN(Number(customLat)) || isNaN(Number(customLng))) {
        toast({
          title: "Invalid Coordinates",
          description: "Please enter valid latitude and longitude values.",
          variant: "destructive"
        });
        return;
      }
      
      // Save custom location to localStorage
      localStorage.setItem('customLat', customLat);
      localStorage.setItem('customLng', customLng);
      localStorage.setItem('useCustomLocation', 'true');
      
      toast({
        title: "Custom Location Saved",
        description: "Your location preferences have been updated.",
      });
    } else {
      // Remove custom location from localStorage and use browser's geolocation
      localStorage.removeItem('customLat');
      localStorage.removeItem('customLng');
      localStorage.setItem('useCustomLocation', 'false');
      
      toast({
        title: "Using Device Location",
        description: "Your app will now use your device's location for restaurant searches.",
      });
    }
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
              Manage your location preferences for restaurant searches.
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
                        Manually set a location instead of using your device location
                      </p>
                    </div>
                    <Switch
                      checked={useCustomLocation}
                      onCheckedChange={setUseCustomLocation}
                    />
                  </div>
                  
                  {useCustomLocation && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                      <div>
                        <label className="text-sm font-medium block mb-1">Latitude</label>
                        <input
                          type="text"
                          value={customLat}
                          onChange={(e) => setCustomLat(e.target.value)}
                          placeholder="e.g. 17.385044"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-1">Longitude</label>
                        <input
                          type="text"
                          value={customLng}
                          onChange={(e) => setCustomLng(e.target.value)}
                          placeholder="e.g. 78.486671"
                          className="w-full p-2 border rounded"
                        />
                      </div>
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
