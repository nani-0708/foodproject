
import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import FoodCard from '@/components/FoodCard';
import RestaurantCard from '@/components/RestaurantCard';
import SkeletonCard from '@/components/SkeletonCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { foodItems, restaurants } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("food");
  const [sortOption, setSortOption] = useState("price_low");
  const [activePlatforms, setActivePlatforms] = useState<string[]>(["Swiggy", "Zomato", "UberEats"]);
  const [filteredFoodItems, setFilteredFoodItems] = useState(foodItems);
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);
  const { toast } = useToast();
  
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
      // Filter food items based on search query
      const filteredFood = foodItems.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) || 
        item.restaurant.toLowerCase().includes(query.toLowerCase()) ||
        item.cuisine.toLowerCase().includes(query.toLowerCase())
      );
      
      // Filter restaurants based on search query
      const filteredRest = restaurants.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) || 
        item.cuisine.some(c => c.toLowerCase().includes(query.toLowerCase()))
      );
      
      setFilteredFoodItems(filteredFood);
      setFilteredRestaurants(filteredRest);
      setLoading(false);
      
      toast({
        title: "Search Results",
        description: `Found ${filteredFood.length} food items and ${filteredRest.length} restaurants`,
      });
    }, 800);
  };
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortOption(value);
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let sortedItems = [...filteredFoodItems];
      
      switch (value) {
        case "price_low":
          sortedItems.sort((a, b) => {
            const minPriceA = Math.min(...a.pricingOptions.map(option => option.price));
            const minPriceB = Math.min(...b.pricingOptions.map(option => option.price));
            return minPriceA - minPriceB;
          });
          break;
        case "price_high":
          sortedItems.sort((a, b) => {
            const minPriceA = Math.min(...a.pricingOptions.map(option => option.price));
            const minPriceB = Math.min(...b.pricingOptions.map(option => option.price));
            return minPriceB - minPriceA;
          });
          break;
        case "rating":
          sortedItems.sort((a, b) => b.rating - a.rating);
          break;
        case "delivery_time":
          sortedItems.sort((a, b) => {
            const minTimeA = Math.min(...a.pricingOptions.map(option => option.estimatedTime));
            const minTimeB = Math.min(...b.pricingOptions.map(option => option.estimatedTime));
            return minTimeA - minTimeB;
          });
          break;
        default:
          break;
      }
      
      setFilteredFoodItems(sortedItems);
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
    
    // Simulate API call delay
    setTimeout(() => {
      // Filter food items based on selected platforms
      const filtered = foodItems.filter(item => 
        item.pricingOptions.some(option => 
          updatedPlatforms.includes(option.platform)
        )
      );
      
      // Filter restaurants based on selected platforms
      const filteredRest = restaurants.filter(restaurant => 
        restaurant.platforms.some(platform => 
          updatedPlatforms.includes(platform)
        )
      );
      
      setFilteredFoodItems(filtered);
      setFilteredRestaurants(filteredRest);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-white to-food-orange/5 py-16">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-food-orange">Compare</span> Food Prices & Save
            </h1>
            <p className="text-food-gray max-w-2xl mx-auto mb-8">
              Find the best prices for your favorite meals across Swiggy, Zomato, and other food delivery platforms.
            </p>
            
            <SearchBar onSearch={handleSearch} />
          </div>
        </section>
        
        <section className="py-8">
          <div className="container mx-auto px-4 md:px-6">
            <Tabs defaultValue="food" value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-center mb-6">
                <TabsList>
                  <TabsTrigger value="food">Food Items</TabsTrigger>
                  <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
                </TabsList>
              </div>
              
              <FilterBar 
                onSortChange={handleSortChange}
                onFilterChange={handleFilterChange}
                activePlatforms={activePlatforms}
              />
              
              <TabsContent value="food">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <SkeletonCard key={index} />
                    ))}
                  </div>
                ) : filteredFoodItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFoodItems.map((item) => (
                      <FoodCard key={item.id} {...item} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <h3 className="text-xl font-medium">No food items found</h3>
                    <p className="text-food-gray mt-2">Try a different search term or filter combination</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="restaurants">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <SkeletonCard key={index} />
                    ))}
                  </div>
                ) : filteredRestaurants.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRestaurants.map((restaurant) => (
                      <RestaurantCard key={restaurant.id} {...restaurant} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <h3 className="text-xl font-medium">No restaurants found</h3>
                    <p className="text-food-gray mt-2">Try a different search term or filter combination</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
