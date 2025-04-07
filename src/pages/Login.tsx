
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [connectedApps, setConnectedApps] = useState({
    swiggy: false,
    zomato: false,
    uberEats: false
  });
  
  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.isLoggedIn) {
        navigate('/');
      }
    }
  }, [navigate]);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Demo login - in a real app we would validate credentials
      if (email && password) {
        // Create connected apps array based on checkbox selections
        const appConnections = [
          { platform: 'Swiggy', isConnected: connectedApps.swiggy, lastSync: new Date() },
          { platform: 'Zomato', isConnected: connectedApps.zomato, lastSync: new Date() },
          { platform: 'UberEats', isConnected: connectedApps.uberEats, lastSync: new Date() }
        ];
        
        // Save login state to localStorage
        localStorage.setItem('user', JSON.stringify({
          email,
          isLoggedIn: true,
          timestamp: new Date(),
          connectedApps: appConnections
        }));
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        // Redirect to home page
        navigate('/');
      } else {
        toast({
          title: "Login failed",
          description: "Please enter your email and password",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      if (email && password) {
        // Save login state to localStorage (same as login for demo)
        localStorage.setItem('user', JSON.stringify({
          email,
          isLoggedIn: true,
          timestamp: new Date(),
          connectedApps: [] // New accounts have no connected apps
        }));
        
        toast({
          title: "Account created",
          description: "Welcome to BiteCompare!",
        });
        
        // Redirect to home page
        navigate('/');
      } else {
        toast({
          title: "Signup failed",
          description: "Please fill all required fields",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-md space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Welcome to <span className="text-food-orange">BiteCompare</span></h1>
              <p className="text-gray-500 mt-2">Compare food delivery prices across platforms</p>
            </div>
            
            <Card>
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin}>
                    <CardHeader>
                      <CardTitle>Login</CardTitle>
                      <CardDescription>Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="Enter your email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="password">Password</Label>
                          <a href="#" className="text-sm text-food-orange">Forgot password?</a>
                        </div>
                        <Input 
                          id="password" 
                          type="password" 
                          placeholder="Enter your password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Connect your food delivery accounts</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="swiggy" 
                              checked={connectedApps.swiggy}
                              onCheckedChange={(checked) => 
                                setConnectedApps({...connectedApps, swiggy: !!checked})
                              }
                            />
                            <label 
                              htmlFor="swiggy" 
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Swiggy
                            </label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="zomato" 
                              checked={connectedApps.zomato}
                              onCheckedChange={(checked) => 
                                setConnectedApps({...connectedApps, zomato: !!checked})
                              }
                            />
                            <label 
                              htmlFor="zomato" 
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Zomato
                            </label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="uberEats" 
                              checked={connectedApps.uberEats}
                              onCheckedChange={(checked) => 
                                setConnectedApps({...connectedApps, uberEats: !!checked})
                              }
                            />
                            <label 
                              htmlFor="uberEats" 
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              UberEats
                            </label>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="w-full bg-food-orange hover:bg-food-orange/90"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in..." : "Sign In"}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignup}>
                    <CardHeader>
                      <CardTitle>Create an account</CardTitle>
                      <CardDescription>Enter your details to create a new account</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input 
                          id="signup-email" 
                          type="email" 
                          placeholder="Enter your email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input 
                          id="signup-password" 
                          type="password" 
                          placeholder="Create a password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="terms" className="text-sm flex items-start space-x-2">
                          <Checkbox id="terms" />
                          <span>
                            I agree to the 
                            <a href="#" className="text-food-orange mx-1">Terms of Service</a>
                            and
                            <a href="#" className="text-food-orange mx-1">Privacy Policy</a>
                          </span>
                        </Label>
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="w-full bg-food-orange hover:bg-food-orange/90"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
              </Tabs>
            </Card>
            
            <div className="text-center text-sm text-gray-500">
              <p>
                {activeTab === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
                  className="text-food-orange hover:underline"
                >
                  {activeTab === 'login' ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
