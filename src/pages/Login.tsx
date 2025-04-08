
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Phone, KeyRound, ArrowRight, Check } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
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

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate OTP sending with timeout
    setTimeout(() => {
      setShowOtpInput(true);
      setIsLoading(false);
      toast({
        title: "OTP sent",
        description: `OTP has been sent to ${phoneNumber}`,
      });
    }, 1500);
  };
  
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length < 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Demo verification - in a real app we would validate OTP with backend
      if (otp === "123456") { // For demo purposes only, use a fixed OTP
        // Create connected apps array based on checkbox selections
        const appConnections = [
          { platform: 'Swiggy', isConnected: connectedApps.swiggy, lastSync: new Date() },
          { platform: 'Zomato', isConnected: connectedApps.zomato, lastSync: new Date() },
          { platform: 'UberEats', isConnected: connectedApps.uberEats, lastSync: new Date() }
        ];
        
        // Save login state to localStorage
        localStorage.setItem('user', JSON.stringify({
          phoneNumber,
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
          title: "Invalid OTP",
          description: "The OTP you entered is incorrect. Please try again.",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Save login state to localStorage (same as login for demo)
      localStorage.setItem('user', JSON.stringify({
        phoneNumber,
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
                  {!showOtpInput ? (
                    <form onSubmit={handleSendOtp}>
                      <CardHeader>
                        <CardTitle>Login with Phone</CardTitle>
                        <CardDescription>Enter your phone number to receive an OTP</CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="flex">
                            <div className="flex items-center px-3 bg-gray-100 border border-r-0 border-input rounded-l-md">
                              +91
                            </div>
                            <div className="relative flex-1">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                              <Input 
                                id="phone" 
                                type="tel" 
                                placeholder="Enter your phone number" 
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="pl-10"
                                maxLength={10}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">We'll send a verification code to this number</span>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter>
                        <Button 
                          type="submit" 
                          className="w-full bg-food-orange hover:bg-food-orange/90"
                          disabled={isLoading}
                        >
                          {isLoading ? "Sending OTP..." : "Send OTP"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp}>
                      <CardHeader>
                        <CardTitle>Enter OTP</CardTitle>
                        <CardDescription>We've sent a verification code to {phoneNumber}</CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="otp">One-Time Password</Label>
                          <div className="flex justify-center">
                            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                              </InputOTPGroup>
                            </InputOTP>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <button 
                            type="button" 
                            className="text-food-orange text-sm hover:underline"
                            onClick={() => setShowOtpInput(false)}
                          >
                            Change phone number
                          </button>
                          <div className="mt-2">
                            <button 
                              type="button" 
                              className="text-food-orange text-sm hover:underline"
                              onClick={handleSendOtp}
                            >
                              Resend OTP
                            </button>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter>
                        <Button 
                          type="submit" 
                          className="w-full bg-food-orange hover:bg-food-orange/90"
                          disabled={isLoading}
                        >
                          {isLoading ? "Verifying..." : "Verify & Login"}
                          <Check className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </form>
                  )}
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignup}>
                    <CardHeader>
                      <CardTitle>Create an account</CardTitle>
                      <CardDescription>Enter your phone number to create a new account</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-phone">Phone Number</Label>
                        <div className="flex">
                          <div className="flex items-center px-3 bg-gray-100 border border-r-0 border-input rounded-l-md">
                            +91
                          </div>
                          <div className="relative flex-1">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Input 
                              id="signup-phone" 
                              type="tel" 
                              placeholder="Enter your phone number" 
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="pl-10"
                              maxLength={10}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-500">
                        <p>By continuing, you agree to our</p>
                        <div className="flex space-x-1">
                          <a href="#" className="text-food-orange hover:underline">Terms of Service</a>
                          <span>and</span>
                          <a href="#" className="text-food-orange hover:underline">Privacy Policy</a>
                        </div>
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
                  onClick={() => {
                    setActiveTab(activeTab === 'login' ? 'signup' : 'login');
                    setShowOtpInput(false);
                  }}
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
