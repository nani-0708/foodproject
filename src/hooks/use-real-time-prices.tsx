
import { useState, useEffect } from 'react';

interface PriceUpdate {
  itemId: string;
  platform: string;
  newPrice: number;
  oldPrice: number;
  hasDiscount: boolean;
  discountCode?: string;
}

export function useRealTimePrices(initialPrices: any[]) {
  const [prices, setPrices] = useState(initialPrices);
  const [updates, setUpdates] = useState<PriceUpdate[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      // Check if login is less than 24 hours old
      const loginTime = new Date(userData.timestamp).getTime();
      const now = new Date().getTime();
      const hoursElapsed = (now - loginTime) / (1000 * 60 * 60);
      
      if (hoursElapsed < 24 && userData.isLoggedIn) {
        setIsLoggedIn(true);
      } else {
        // Clear expired login
        localStorage.removeItem('user');
      }
    }
  }, []); // Only run once on mount

  // Initialize prices state when initialPrices changes
  useEffect(() => {
    setPrices(initialPrices);
  }, [initialPrices]); // Use the initialPrices directly, React will compare arrays by reference

  // Simulate real-time price updates
  useEffect(() => {
    if (!isLoggedIn || prices.length === 0) return;

    const interval = setInterval(() => {
      // Randomly select an item and platform to update
      const randomItemIndex = Math.floor(Math.random() * prices.length);
      const randomItem = prices[randomItemIndex];
      
      if (!randomItem?.pricingOptions) return;
      
      const randomPlatformIndex = Math.floor(Math.random() * randomItem.pricingOptions.length);
      const randomPlatform = randomItem.pricingOptions[randomPlatformIndex];
      
      if (!randomPlatform) return;
      
      // Generate a random price change (small fluctuation)
      const priceChange = (Math.random() * 2 - 1) * 2; // Between -2 and +2
      const oldPrice = randomPlatform.price;
      const newPrice = Math.max(0.99, oldPrice + priceChange).toFixed(2);
      
      // Random chance for a discount
      const hasDiscount = Math.random() > 0.8;
      const discountCode = hasDiscount ? generateDiscountCode() : undefined;
      
      // Create the update
      const update: PriceUpdate = {
        itemId: randomItem.id,
        platform: randomPlatform.platform,
        oldPrice: oldPrice,
        newPrice: parseFloat(newPrice),
        hasDiscount,
        discountCode
      };
      
      // Update prices
      setPrices(currentPrices => {
        return currentPrices.map(item => {
          if (item.id === randomItem.id) {
            return {
              ...item,
              pricingOptions: item.pricingOptions.map((option: any) => {
                if (option.platform === randomPlatform.platform) {
                  return {
                    ...option,
                    price: parseFloat(newPrice),
                    discountCode: update.discountCode
                  };
                }
                return option;
              })
            };
          }
          return item;
        });
      });
      
      // Add the update to the list of recent updates
      setUpdates(prev => [update, ...prev].slice(0, 5));
      
    }, 15000); // Update every 15 seconds
    
    return () => clearInterval(interval);
  }, [isLoggedIn, prices.length]); // Only depend on isLoggedIn and the length of prices array, not the entire prices array

  return { prices, updates, isLoggedIn };
}

// Helper function to generate a random discount code
function generateDiscountCode() {
  const codes = [
    "SAVE10", "NEWUSER", "TASTY20", "HUNGRY", "SPCL15", 
    "WEEKEND", "FOODIE", "WELCOME", "OFFER25", "FIRST50"
  ];
  return codes[Math.floor(Math.random() * codes.length)];
}
