
import React, { useState, useEffect } from 'react';
import { Clock, Star, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useRealTimePrices } from '@/hooks/use-real-time-prices';

interface FoodItemPricing {
  platform: string;
  price: number;
  deliveryFee: number;
  estimatedTime: number;
  discountCode?: string;
  appUrl?: string;
}

interface FoodCardProps {
  id: string;
  name: string;
  restaurant: string;
  cuisine: string;
  description: string;
  imageUrl: string;
  rating: number;
  pricingOptions: FoodItemPricing[];
}

const FoodCard = ({
  id,
  name,
  restaurant,
  cuisine,
  description,
  imageUrl,
  rating,
  pricingOptions,
}: FoodCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLoggedIn, connectedApps } = useRealTimePrices([]);
  const [priceUpdates, setPriceUpdates] = useState<Record<string, { isNew: boolean, increased?: boolean }>>({});
  
  // Track price changes for animations
  useEffect(() => {
    const updates: Record<string, { isNew: boolean, increased?: boolean }> = {};
    
    pricingOptions.forEach(option => {
      updates[option.platform] = { isNew: true };
    });
    
    setPriceUpdates(updates);
    
    const timer = setTimeout(() => {
      const clearedUpdates: Record<string, { isNew: boolean, increased?: boolean }> = {};
      
      Object.keys(updates).forEach(key => {
        clearedUpdates[key] = { isNew: false };
      });
      
      setPriceUpdates(clearedUpdates);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [pricingOptions]);
  
  // Get a list of platforms that the user has connected
  const connectedPlatformNames = connectedApps
    .filter(app => app.isConnected)
    .map(app => app.platform);
  
  // Filter pricing options to only show connected platforms when logged in
  const visiblePricingOptions = isLoggedIn
    ? pricingOptions.filter(option => connectedPlatformNames.includes(option.platform))
    : pricingOptions;
  
  // Find the lowest priced option among visible options
  const cheapestOption = [...visiblePricingOptions].sort((a, b) => a.price - b.price)[0];
  
  // Handle redirect to the respective app
  const handleOrderNow = (platform: string) => {
    if (!isLoggedIn) {
      navigate('/login', { state: { redirectTo: `/restaurant/${id}` } });
      return;
    }
    
    // In a real implementation, we would have actual deep links to the food apps
    // For now, we'll simulate with a toast notification
    
    const platformUrls = {
      "Swiggy": "https://www.swiggy.com/search?query=" + encodeURIComponent(name),
      "Zomato": "https://www.zomato.com/search?q=" + encodeURIComponent(name),
      "UberEats": "https://www.ubereats.com/search?q=" + encodeURIComponent(name),
    };
    
    // Get the URL for the selected platform
    const url = platformUrls[platform as keyof typeof platformUrls];
    
    toast({
      title: "Redirecting to " + platform,
      description: `Taking you to order ${name} on ${platform}`,
    });
    
    // Open in a new tab
    window.open(url, '_blank');
  };
  
  return (
    <div className="food-card">
      <div className="relative h-48 w-full">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover"
        />
        <Badge className="absolute top-2 right-2 bg-food-orange">
          <Star className="h-3 w-3 mr-1 fill-white stroke-white" /> {rating.toFixed(1)}
        </Badge>
        <Badge className="absolute top-2 left-2">{cuisine}</Badge>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg">{name}</h3>
        <p className="text-food-gray text-sm mb-2">{restaurant}</p>
        <p className="text-sm line-clamp-2 mb-3 text-food-dark/80">{description}</p>
        
        <div className="border-t pt-3">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Price Comparison</h4>
            {!isLoggedIn && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-food-orange text-xs"
                onClick={() => navigate('/login')}
              >
                Login for real prices
              </Button>
            )}
          </div>
          
          {isLoggedIn && visiblePricingOptions.length === 0 ? (
            <div className="p-4 text-center bg-amber-50 rounded-md">
              <p className="text-amber-600">No connected food apps available for this restaurant.</p>
              <p className="text-sm text-amber-600 mt-1">Go to settings to connect your accounts.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {visiblePricingOptions.map((option, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-2 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer relative overflow-hidden" 
                  onClick={() => handleOrderNow(option.platform)}
                >
                  {priceUpdates[option.platform]?.isNew && (
                    <div className="absolute inset-0 bg-yellow-100 opacity-30 animate-pulse" />
                  )}
                  
                  <div className="flex items-center">
                    <img 
                      src={`/placeholder.svg`} 
                      alt={option.platform} 
                      className="w-6 h-6 mr-2"
                    />
                    <span className="font-medium">{option.platform}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-food-gray" />
                      <span className="text-sm">{option.estimatedTime} min</span>
                    </div>
                    
                    <div className={`font-bold flex items-center ${
                      priceUpdates[option.platform]?.isNew 
                        ? priceUpdates[option.platform]?.increased 
                          ? "text-red-500" 
                          : "text-green-500"
                        : "text-food-orange"
                    }`}>
                      {priceUpdates[option.platform]?.isNew && priceUpdates[option.platform]?.increased && (
                        <ArrowUp className="h-3 w-3 mr-1" />
                      )}
                      {priceUpdates[option.platform]?.isNew && !priceUpdates[option.platform]?.increased && (
                        <ArrowDown className="h-3 w-3 mr-1" />
                      )}
                      ${option.price.toFixed(2)}
                    </div>
                  </div>
                  
                  {option.discountCode && isLoggedIn && (
                    <Badge className="absolute top-0 right-0 bg-green-500 text-xs transform translate-x-1/4 -translate-y-1/4 py-0 px-1">
                      Deal
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {cheapestOption && (
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-food-gray">
                <span className="font-medium">Best price on {cheapestOption.platform}</span>
                {cheapestOption.discountCode && isLoggedIn && (
                  <div className="text-xs">Use code: <span className="font-bold">{cheapestOption.discountCode}</span></div>
                )}
              </div>
              
              <Button 
                className="bg-food-orange hover:bg-food-orange/90"
                onClick={() => handleOrderNow(cheapestOption.platform)}
              >
                Order Now
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
