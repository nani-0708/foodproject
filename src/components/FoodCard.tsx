
import React from 'react';
import { Clock, DollarSign, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface FoodItemPricing {
  platform: string;
  price: number;
  deliveryFee: number;
  estimatedTime: number;
  discountCode?: string;
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
  name,
  restaurant,
  cuisine,
  description,
  imageUrl,
  rating,
  pricingOptions,
}: FoodCardProps) => {
  // Find the lowest priced option
  const cheapestOption = [...pricingOptions].sort((a, b) => a.price - b.price)[0];
  
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
          <h4 className="font-medium mb-2">Price Comparison</h4>
          <div className="space-y-2">
            {pricingOptions.map((option, index) => (
              <div key={index} className="flex justify-between items-center p-2 rounded-md bg-gray-50">
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
                  <div className="font-bold text-food-orange">
                    ${option.price.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-food-gray">
              <span className="font-medium">Best price on {cheapestOption.platform}</span>
              {cheapestOption.discountCode && (
                <div className="text-xs">Use code: <span className="font-bold">{cheapestOption.discountCode}</span></div>
              )}
            </div>
            <Button className="bg-food-orange hover:bg-food-orange/90">
              Order Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
