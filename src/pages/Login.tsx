
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

// Define the form schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  platform: z.enum(["swiggy", "zomato", "ubereats"]),
});

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      platform: 'swiggy',
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoggingIn(true);
    
    // Simulate API call - in a real app, this would connect to the actual platforms
    setTimeout(() => {
      // Store login info in localStorage
      localStorage.setItem('user', JSON.stringify({
        email: data.email,
        platform: data.platform,
        isLoggedIn: true,
        timestamp: new Date().toISOString()
      }));
      
      toast({
        title: "Login Successful",
        description: `You're now logged in to ${data.platform.charAt(0).toUpperCase() + data.platform.slice(1)}`,
      });
      
      setIsLoggingIn(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-food-orange">Log in to Food Platforms</h1>
        <p className="text-food-gray text-center mb-8">
          Connect your food delivery accounts to see real-time prices and offers
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Platform</FormLabel>
                  <div className="flex gap-4 pt-2">
                    {["swiggy", "zomato", "ubereats"].map((platform) => (
                      <div 
                        key={platform}
                        onClick={() => field.onChange(platform)}
                        className={`flex-1 p-3 border rounded-md text-center cursor-pointer transition-all ${
                          field.value === platform 
                            ? "border-food-orange bg-food-orange/10 text-food-orange" 
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <p className="font-medium capitalize">{platform}</p>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className={`w-full bg-food-orange hover:bg-food-orange/90 ${isLoggingIn ? 'opacity-70' : ''}`}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
        
        <div className="mt-8 pt-6 border-t text-center text-sm text-food-gray">
          <p>This is a demonstration app. In a production version, you would authenticate with the actual APIs of these food delivery platforms.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
