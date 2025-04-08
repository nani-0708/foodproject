
import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import RestaurantCard from '@/components/RestaurantCard';
import SkeletonCard from '@/components/SkeletonCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { restaurants } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { useRealTimePrices } from '@/hooks/use-real-time-prices';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("rating");
  const [activePlatforms, setActivePlatforms] = useState<string[]>(["Swiggy", "Zomato", "UberEats"]);
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);
  const { toast } = useToast();
  const { isLoggedIn, connectedApps } = useRealTimePrices([]);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Filter restaurants based on search query
      const filteredRest = restaurants.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) || 
        item.cuisine.some(c => c.toLowerCase().includes(query.toLowerCase()))
      );
      
      setFilteredRestaurants(filteredRest);
      setLoading(false);
      
      toast({
        title: "Search Results",
        description: `Found ${filteredRest.length} restaurants`,
      });
    }, 800);
  };
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortOption(value);
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let sortedItems = [...filteredRestaurants];
      
      switch (value) {
        case "rating":
          sortedItems.sort((a, b) => b.rating - a.rating);
          break;
        case "delivery_time":
          sortedItems.sort((a, b) => a.deliveryTime - b.deliveryTime);
          break;
        case "distance":
          sortedItems.sort((a, b) => {
            const distA = parseFloat(a.distance.replace(' km', ''));
            const distB = parseFloat(b.distance.replace(' km', ''));
            return distA - distB;
          });
          break;
        case "price_low":
          // For this one, we'd ideally use real price data
          // For now, we'll just use a random sort
          sortedItems.sort(() => Math.random() - 0.5);
          break;
        case "price_high":
          // Same as above but reversed
          sortedItems.sort(() => Math.random() - 0.5).reverse();
          break;
        default:
          break;
      }
      
      setFilteredRestaurants(sortedItems);
      setLoading(false);
    }, 500);
  };
  
  // Handle platform filter change
  const handleFilterChange = (platform: string) => {
    setLoading(true);
    
    // Toggle platform in the active platforms list
    let updatedPlatforms;
    if (activePlatforms.includes(platform)) {
      updatedPlatforms = activePlatforms.filter(p => p !== platform);
    } else {
      updatedPlatforms = [...activePlatforms, platform];
    }
    
    // Don't allow all platforms to be deselected
    if (updatedPlatforms.length === 0) {
      toast({
        title: "Filter Error",
        description: "At least one platform must be selected",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    setActivePlatforms(updatedPlatforms);
    
    // If logged in, filter based on connected platforms as well
    const activePlatformsToUse = isLoggedIn 
      ? updatedPlatforms.filter(p => 
          connectedApps.some(app => app.platform === p && app.isConnected)
        )
      : updatedPlatforms;
    
    // Simulate API call delay
    setTimeout(() => {
      // Filter restaurants based on selected platforms
      const filteredRest = restaurants.filter(restaurant => 
        restaurant.platforms.some(platform => 
          activePlatformsToUse.includes(platform)
        )
      );
      
      setFilteredRestaurants(filteredRest);
      setLoading(false);
      
      if (isLoggedIn && activePlatformsToUse.length === 0) {
        toast({
          title: "No Connected Apps",
          description: "You need to connect apps to see their prices",
          variant: "default",
        });
      }
    }, 500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-white to-food-orange/5 py-16">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-food-orange">Compare</span> Restaurant Prices & Save
            </h1>
            <p className="text-food-gray max-w-2xl mx-auto mb-8">
              Find the best prices and delivery options across Swiggy, Zomato, and other food delivery platforms.
            </p>
            
            <SearchBar onSearch={handleSearch} />
            
            {!isLoggedIn ? (
              <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md max-w-md mx-auto">
                <p className="text-sm">
                  <strong>Login required:</strong> Connect your food delivery accounts to see real-time prices and offers.
                </p>
              </div>
            ) : connectedApps.filter(app => app.isConnected).length === 0 ? (
              <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md max-w-md mx-auto">
                <p className="text-sm">
                  <strong>Connect your accounts:</strong> Link your food delivery apps to compare prices.
                </p>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md max-w-md mx-auto">
                <p className="text-sm">
                  <strong>Connected:</strong> Showing real-time prices from {connectedApps.filter(app => app.isConnected).length} food delivery platforms.
                </p>
              </div>
            )}
          </div>
        </section>
        
        <section className="py-8">
          <div className="container mx-auto px-4 md:px-6">
            <FilterBar 
              onSortChange={handleSortChange}
              onFilterChange={handleFilterChange}
              activePlatforms={activePlatforms}
            />
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : filteredRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard 
                    key={restaurant.id} 
                    {...restaurant} 
                    showApproxPrices={!isLoggedIn}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-xl font-medium">No restaurants found</h3>
                <p className="text-food-gray mt-2">Try a different search term or filter combination</p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
