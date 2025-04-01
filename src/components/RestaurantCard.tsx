
import React from 'react';
import { MapPin, Clock, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RestaurantProps {
  id: string;
  name: string;
  cuisine: string[];
  imageUrl: string;
  rating: number;
  deliveryTime: number;
  distance: string;
  platforms: string[];
}

const RestaurantCard = ({
  name,
  cuisine,
  imageUrl,
  rating,
  deliveryTime,
  distance,
  platforms,
}: RestaurantProps) => {
  return (
    <div className="food-card flex flex-col">
      <div className="relative h-48 w-full">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover"
        />
        <Badge className="absolute top-2 right-2 bg-food-orange">
          <Star className="h-3 w-3 mr-1 fill-white stroke-white" /> {rating.toFixed(1)}
        </Badge>
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
          <p className="text-sm text-food-gray mb-1">Available on:</p>
          <div className="flex gap-2">
            {platforms.map((platform, index) => (
              <Badge key={index} variant="secondary" className="bg-gray-100 text-food-dark text-xs">
                {platform}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
