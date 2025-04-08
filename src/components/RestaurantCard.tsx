
import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Star, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useRealTimePrices } from '@/hooks/use-real-time-prices';

interface RestaurantProps {
  id: string;
  name: string;
  cuisine: string[];
  imageUrl: string;
  rating: number;
  deliveryTime: number;
  distance: string;
  platforms: string[];
  showApproxPrices?: boolean;
}

const RestaurantCard = ({
  id,
  name,
  cuisine,
  imageUrl,
  rating,
  deliveryTime,
  distance,
  platforms,
  showApproxPrices = false,
}: RestaurantProps) => {
  const navigate = useNavigate();
  const { isLoggedIn, connectedApps } = useRealTimePrices([]);
  
  const handleClick = () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { redirectTo: `/restaurant/${id}` } });
    } else {
      navigate(`/restaurant/${id}`);
    }
  };
  
  // Get a list of platforms that the user has connected
  const connectedPlatforms = connectedApps
    .filter(app => app.isConnected)
    .map(app => app.platform);
  
  // Determine which platforms are actually available (both supported by restaurant and connected)
  const availablePlatforms = isLoggedIn 
    ? platforms.filter(platform => connectedPlatforms.includes(platform))
    : platforms;
  
  return (
    <div className="food-card flex flex-col cursor-pointer hover:shadow-md transition-shadow" onClick={handleClick}>
      <div className="relative h-48 w-full">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover"
        />
        <Badge className="absolute top-2 right-2 bg-food-orange">
          <Star className="h-3 w-3 mr-1 fill-white stroke-white" /> {rating.toFixed(1)}
        </Badge>
        {!isLoggedIn && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-center p-4">
              <Lock className="h-8 w-8 mx-auto mb-2" />
              <p className="font-bold">Login to see real prices</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg">{name}</h3>
        
        <div className="flex flex-wrap gap-1 my-2">
          {cuisine.map((type, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {type}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center text-sm text-food-gray gap-4 mt-auto">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{deliveryTime} min</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{distance}</span>
          </div>
        </div>
        
        <div className="mt-3 border-t pt-3">
          <p className="text-sm text-food-gray mb-1">
            {isLoggedIn ? "Connected app prices:" : "Available on:"}
          </p>
          
          {availablePlatforms.length > 0 ? (
            <div className="flex gap-2">
              {availablePlatforms.map((platform, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className={`${isLoggedIn && connectedPlatforms.includes(platform) 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-food-dark"} text-xs`}
                >
                  {platform}
                </Badge>
              ))}
            </div>
          ) : isLoggedIn ? (
            <p className="text-xs text-amber-600">
              Connect apps in settings to see prices
            </p>
          ) : null}
          
          {/* Display approximate prices if showApproxPrices is true */}
          {showApproxPrices && (
            <div className="mt-2 text-xs text-food-gray">
              <p>~$15-18</p>
            </div>
          )}
          
          {/* Show connection status message */}
          {isLoggedIn && connectedPlatforms.length > 0 && (
            <div className="mt-2 text-xs text-green-600">
              Showing real-time prices from your connected accounts
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
