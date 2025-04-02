
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
import { Phone, Loader } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

// Define the form schema
const phoneFormSchema = z.object({
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  platform: z.enum(["swiggy", "zomato", "ubereats"]),
});

const otpFormSchema = z.object({
  otp: z.string().min(4, { message: "Please enter a valid OTP" })
});

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const phoneForm = useForm<z.infer<typeof phoneFormSchema>>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phone: '',
      platform: 'swiggy',
    }
  });

  const otpForm = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: '',
    }
  });

  const onPhoneSubmit = async (data: z.infer<typeof phoneFormSchema>) => {
    setIsLoggingIn(true);
    
    // Simulate API call to send OTP
    setTimeout(() => {
      toast({
        title: "OTP Sent",
        description: `A verification code has been sent to ${data.phone}`,
      });
      
      setIsLoggingIn(false);
      setShowOtpForm(true);
    }, 1500);
  };

  const onOtpSubmit = async (data: z.infer<typeof otpFormSchema>) => {
    setVerifyingOtp(true);
    
    // Simulate API call to verify OTP and login
    setTimeout(() => {
      // Store login info in localStorage
      localStorage.setItem('user', JSON.stringify({
        phone: phoneForm.getValues('phone'),
        platform: phoneForm.getValues('platform'),
        isLoggedIn: true,
        timestamp: new Date().toISOString()
      }));
      
      toast({
        title: "Login Successful",
        description: `You're now logged in to ${phoneForm.getValues('platform').charAt(0).toUpperCase() + phoneForm.getValues('platform').slice(1)}`,
      });
      
      setVerifyingOtp(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-food-orange">Connect Food Platforms</h1>
        <p className="text-food-gray text-center mb-8">
          Link your food delivery accounts to compare real-time prices and offers
        </p>
        
        {!showOtpForm ? (
          <Form {...phoneForm}>
            <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-6">
              <FormField
                control={phoneForm.control}
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
                          <div className="text-xs text-muted-foreground mt-1">
                            ~$15-18
                          </div>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={phoneForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <div className="mr-2 text-muted-foreground">
                          <Phone size={18} />
                        </div>
                        <Input placeholder="Enter your phone number" {...field} />
                      </div>
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
                {isLoggingIn ? (
                  <span className="flex items-center">
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </span>
                ) : "Send Verification Code"}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Verification Code</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={4} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col space-y-2">
                <Button 
                  type="submit" 
                  className={`w-full bg-food-orange hover:bg-food-orange/90 ${verifyingOtp ? 'opacity-70' : ''}`}
                  disabled={verifyingOtp}
                >
                  {verifyingOtp ? (
                    <span className="flex items-center">
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </span>
                  ) : "Verify & Login"}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowOtpForm(false)}
                  disabled={verifyingOtp}
                >
                  Back to Phone Entry
                </Button>
              </div>
            </form>
          </Form>
        )}
        
        <div className="mt-8 pt-6 border-t text-center text-sm text-food-gray">
          <p>This is a demonstration app. In a production version, you would connect with the actual APIs of these food delivery platforms.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
