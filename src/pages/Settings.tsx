
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useRealTimePrices } from "@/hooks/use-real-time-prices";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { Check, Link, AlertCircle } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, connectedApps, connectApp, disconnectApp } = useRealTimePrices([]);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  
  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      // Redirect to login page if not logged in
      navigate('/login', { state: { redirectTo: '/settings' } });
    }
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
