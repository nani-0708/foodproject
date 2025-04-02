
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Clock, Utensils, ArrowDown, ArrowUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { restaurants, foodItems } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { useRealTimePrices } from '@/hooks/use-real-time-prices';

interface PlatformPricing {
  platform: string;
  price: number;
  deliveryFee: number;
  estimatedTime: number;
  discountCode?: string;
}

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(restaurants.find(r => r.id === id));
  const [menuItems, setMenuItems] = useState(foodItems.filter(item => item.restaurant === restaurant?.name));
  const [platformPricing, setPlatformPricing] = useState<PlatformPricing[]>([]);
  const [selectedTab, setSelectedTab] = useState('prices');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const { toast } = useToast();
  const { isLoggedIn, updates } = useRealTimePrices(menuItems);
  
  useEffect(() => {
    // In a real app, we would fetch this data from an API
    setRestaurant(restaurants.find(r => r.id === id));
  }, [id]);
  
  useEffect(() => {
    if (restaurant) {
      // Filter menu items by restaurant name
      setMenuItems(foodItems.filter(item => item.restaurant === restaurant.name));
      
      // Generate platform pricing data
      if (isLoggedIn) {
        const platforms = restaurant.platforms.map(platform => {
          // Simulate different pricing for each platform
          const baseDeliveryFee = Math.floor(Math.random() * 5) + 1;
          const estimatedTime = platform === 'Swiggy' ? restaurant.deliveryTime - 5 :
                               platform === 'Zomato' ? restaurant.deliveryTime : 
                               restaurant.deliveryTime + 5;
          
          // Add random discounts for some platforms
          const hasDiscount = Math.random() > 0.6;
          
          return {
            platform,
            price: 0, // This will be calculated based on menu items
            deliveryFee: baseDeliveryFee,
            estimatedTime,
            discountCode: hasDiscount ? generateDiscountCode() : undefined
          };
        });
        
        // Calculate average price for menu items on each platform
        platforms.forEach(platform => {
          const relevantItems = menuItems.filter(item => 
            item.pricingOptions.some(option => option.platform === platform.platform)
          );
          
          if (relevantItems.length > 0) {
            const totalPrice = relevantItems.reduce((sum, item) => {
              const platformOption = item.pricingOptions.find(option => 
                option.platform === platform.platform
              );
              return sum + (platformOption?.price || 0);
            }, 0);
            
            platform.price = totalPrice / relevantItems.length;
          }
        });
        
        setPlatformPricing(platforms);
        
        // Set default selected platform to the cheapest option
        if (platforms.length > 0) {
          const cheapestPlatform = [...platforms].sort((a, b) => 
            (a.price + a.deliveryFee) - (b.price + b.deliveryFee)
          )[0];
          
          setSelectedPlatform(cheapestPlatform.platform);
        }
      }
    }
  }, [restaurant, isLoggedIn, menuItems]);
  
  // Handle redirect to the respective app
  const handleOrderNow = (platform: string, itemName?: string) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
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
      title: `Redirecting to ${platform}`,
      description: `Taking you to ${itemName ? `order ${itemName}` : `${restaurant?.name}`} on ${platform}`,
    });
    
    // Open in a new tab
    window.open(url, '_blank');
  };
  
  // Find the best platform based on different criteria
  const findBestPlatform = (criteria: 'price' | 'time' | 'overall') => {
    if (platformPricing.length === 0) return null;
    
    switch (criteria) {
      case 'price':
        return [...platformPricing].sort((a, b) => 
          (a.price + a.deliveryFee) - (b.price + b.deliveryFee)
        )[0];
      case 'time':
        return [...platformPricing].sort((a, b) => 
          a.estimatedTime - b.estimatedTime
        )[0];
      case 'overall':
        // Balance between price and time
        return [...platformPricing].sort((a, b) => 
          ((a.price + a.deliveryFee) * 0.7 + a.estimatedTime * 0.3) - 
          ((b.price + b.deliveryFee) * 0.7 + b.estimatedTime * 0.3)
        )[0];
      default:
        return [...platformPricing].sort((a, b) => 
          (a.price + a.deliveryFee) - (b.price + b.deliveryFee)
        )[0];
    }
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
  
  const bestOverallPlatform = findBestPlatform('overall');
  const bestPricePlatform = findBestPlatform('price');
  const bestTimePlatform = findBestPlatform('time');
  
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
                  <span className="font-medium">{restaurant.deliveryTime} min average delivery time</span>
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
          
          {!isLoggedIn ? (
            <div className="bg-gray-50 p-6 rounded-lg mb-8 text-center">
              <h3 className="text-xl font-medium mb-3">Login to see real prices and offers</h3>
              <p className="text-food-gray mb-4">Connect your food delivery accounts to compare prices across platforms.</p>
              <Button 
                className="bg-food-orange hover:bg-food-orange/90"
                onClick={() => navigate('/login')}
              >
                Login Now
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Best Ordering Option</h2>
                
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  {bestOverallPlatform ? (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-medium text-green-800">
                          Order from {bestOverallPlatform.platform}
                        </h3>
                        <Badge className="bg-green-600">Recommended</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white p-3 rounded shadow-sm">
                          <p className="text-sm text-food-gray">Average Price</p>
                          <p className="text-lg font-bold text-food-orange">${bestOverallPlatform.price.toFixed(2)}</p>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm">
                          <p className="text-sm text-food-gray">Delivery Fee</p>
                          <p className="text-lg font-bold text-food-orange">${bestOverallPlatform.deliveryFee.toFixed(2)}</p>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm">
                          <p className="text-sm text-food-gray">Estimated Time</p>
                          <p className="text-lg font-bold text-food-orange">{bestOverallPlatform.estimatedTime} min</p>
                        </div>
                      </div>
                      
                      {bestOverallPlatform.discountCode && (
                        <div className="bg-yellow-50 p-3 rounded-md mb-4 border border-yellow-200">
                          <p className="text-sm font-medium">Special Offer</p>
                          <p className="text-md">Use code: <span className="font-bold text-food-orange">{bestOverallPlatform.discountCode}</span></p>
                        </div>
                      )}
                      
                      <Button 
                        className="w-full bg-food-orange hover:bg-food-orange/90 mb-2"
                        onClick={() => handleOrderNow(bestOverallPlatform.platform)}
                      >
                        Order Now with {bestOverallPlatform.platform}
                      </Button>
                      
                      <p className="text-xs text-center text-food-gray">
                        Based on best balance of price, delivery fee, and delivery time
                      </p>
                    </>
                  ) : (
                    <p>No platform data available</p>
                  )}
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Compare All Options</h2>
                
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="prices">Platform Comparison</TabsTrigger>
                    <TabsTrigger value="menu">Menu Items</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="prices">
                    <div className="bg-white rounded-lg border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Platform</TableHead>
                            <TableHead>Avg. Price</TableHead>
                            <TableHead>Delivery Fee</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Discount</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {platformPricing.map((platform) => (
                            <TableRow key={platform.platform} className={
                              platform.platform === bestPricePlatform?.platform ? "bg-green-50" :
                              platform.platform === bestTimePlatform?.platform ? "bg-blue-50" : ""
                            }>
                              <TableCell className="font-medium">{platform.platform}</TableCell>
                              <TableCell>${platform.price.toFixed(2)}</TableCell>
                              <TableCell>${platform.deliveryFee.toFixed(2)}</TableCell>
                              <TableCell className="font-bold">${(platform.price + platform.deliveryFee).toFixed(2)}</TableCell>
                              <TableCell>{platform.estimatedTime} min</TableCell>
                              <TableCell>
                                {platform.discountCode ? (
                                  <Badge variant="outline" className="text-green-600 border-green-600">
                                    {platform.discountCode}
                                  </Badge>
                                ) : "-"}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  size="sm"
                                  className="bg-food-orange hover:bg-food-orange/90"
                                  onClick={() => handleOrderNow(platform.platform)}
                                >
                                  Order
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Badge className="bg-green-100 text-green-800">
                        Best Price
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800">
                        Fastest Delivery
                      </Badge>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="menu">
                    {menuItems.length > 0 ? (
                      <div className="bg-white rounded-lg border overflow-hidden">
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
                            {menuItems.map((item) => {
                              const cheapestOption = [...item.pricingOptions].sort((a, b) => 
                                a.price - b.price
                              )[0];
                              
                              // Check if there's a price update for this item
                              const priceUpdate = updates.find(update => 
                                update.itemId === item.id && update.platform === cheapestOption.platform
                              );
                              
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
                                    <div className={`font-bold flex items-center ${
                                      priceUpdate ? (priceUpdate.newPrice > priceUpdate.oldPrice ? "text-red-500" : "text-green-500") : "text-food-orange"
                                    }`}>
                                      {priceUpdate && priceUpdate.newPrice > priceUpdate.oldPrice && (
                                        <ArrowUp className="h-3 w-3 mr-1" />
                                      )}
                                      {priceUpdate && priceUpdate.newPrice < priceUpdate.oldPrice && (
                                        <ArrowDown className="h-3 w-3 mr-1" />
                                      )}
                                      ${cheapestOption.price.toFixed(2)} 
                                      <span className="text-xs text-gray-500 ml-1">on {cheapestOption.platform}</span>
                                    </div>
                                    {cheapestOption.discountCode && (
                                      <div className="text-xs text-green-600 mt-1">
                                        Code: {cheapestOption.discountCode}
                                      </div>
                                    )}
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
                    ) : (
                      <div className="text-center py-10">
                        <h3 className="text-xl font-medium">No menu items found</h3>
                        <p className="text-food-gray mt-2">Menu information unavailable for this restaurant</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Helper function to generate a random discount code
function generateDiscountCode() {
  const codes = [
    "SAVE10", "NEWUSER", "TASTY20", "HUNGRY", "SPCL15", 
    "WEEKEND", "FOODIE", "WELCOME", "OFFER25", "FIRST50"
  ];
  return codes[Math.floor(Math.random() * codes.length)];
}

export default RestaurantDetail;
