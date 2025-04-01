
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Clock, Utensils } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { restaurants, foodItems } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState(restaurants.find(r => r.id === id));
  const [relatedItems, setRelatedItems] = useState(foodItems.filter(item => item.restaurant === restaurant?.name));
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real app, we would fetch this data from an API
    setRestaurant(restaurants.find(r => r.id === id));
  }, [id]);
  
  useEffect(() => {
    if (restaurant) {
      setRelatedItems(foodItems.filter(item => item.restaurant === restaurant.name));
    }
  }, [restaurant]);
  
  // Handle redirect to the respective app
  const handleOrderNow = (platform: string, itemName: string = '') => {
    // In a real implementation, we would have actual deep links to the food apps
    const searchQuery = itemName || restaurant?.name || '';
    
    const platformUrls = {
      "Swiggy": "https://www.swiggy.com/search?query=" + encodeURIComponent(searchQuery),
      "Zomato": "https://www.zomato.com/search?q=" + encodeURIComponent(searchQuery),
      "UberEats": "https://www.ubereats.com/search?q=" + encodeURIComponent(searchQuery),
    };
    
    // Get the URL for the selected platform
    const url = platformUrls[platform as keyof typeof platformUrls];
    
    toast({
      title: "Redirecting to " + platform,
      description: `Taking you to order from ${restaurant?.name} on ${platform}`,
    });
    
    // Open in a new tab
    window.open(url, '_blank');
  };
  
  if (!restaurant) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-10">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Restaurant not found</h2>
            <Link to="/" className="text-food-orange hover:underline">
              Return to home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="h-64 md:h-80 w-full relative">
          <img 
            src={restaurant.imageUrl} 
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold">{restaurant.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {restaurant.cuisine.map((type, index) => (
                <Badge key={index} className="bg-food-orange">{type}</Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center text-food-orange hover:underline mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to search
          </Link>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-2">
                  <Star className="h-5 w-5 text-food-orange mr-2" />
                  <span className="font-medium">{restaurant.rating} Rating</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-food-orange mr-2" />
                  <span className="font-medium">{restaurant.deliveryTime} min delivery time</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-2">
                  <MapPin className="h-5 w-5 text-food-orange mr-2" />
                  <span className="font-medium">{restaurant.distance} away</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Available on</h2>
            <div className="flex flex-wrap gap-3">
              {restaurant.platforms.map((platform, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  className="border-food-orange text-food-orange hover:bg-food-orange hover:text-white"
                  onClick={() => handleOrderNow(platform)}
                >
                  {platform}
                </Button>
              ))}
            </div>
          </div>
          
          {relatedItems.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Menu Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Best Price</TableHead>
                    <TableHead className="text-right">Order</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relatedItems.map((item) => {
                    const cheapestOption = [...item.pricingOptions].sort((a, b) => 
                      a.price - b.price
                    )[0];
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-food-orange mr-1 fill-food-orange" />
                            {item.rating.toFixed(1)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold">
                            ${cheapestOption.price.toFixed(2)} 
                            <span className="text-xs text-gray-500 ml-1">on {cheapestOption.platform}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm"
                            className="bg-food-orange hover:bg-food-orange/90"
                            onClick={() => handleOrderNow(cheapestOption.platform, item.name)}
                          >
                            Order
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RestaurantDetail;
