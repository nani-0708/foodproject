
import { useState, useEffect } from 'react';

interface PriceUpdate {
  itemId: string;
  platform: string;
  newPrice: number;
  oldPrice: number;
  hasDiscount: boolean;
  discountCode?: string;
}

interface ConnectedApp {
  platform: string;
  isConnected: boolean;
  lastSync?: Date;
}

export function useRealTimePrices(initialPrices: any[]) {
  const [prices, setPrices] = useState(initialPrices);
  const [updates, setUpdates] = useState<PriceUpdate[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [connectedApps, setConnectedApps] = useState<ConnectedApp[]>([
    { platform: 'Swiggy', isConnected: false },
    { platform: 'Zomato', isConnected: false },
    { platform: 'UberEats', isConnected: false }
  ]);

  // Check if user is logged in and get connected apps status
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
        
        // If user has connected apps, update the state
        if (userData.connectedApps && Array.isArray(userData.connectedApps)) {
          setConnectedApps(userData.connectedApps);
        } else {
          // Simulate that the user has connected all apps when logged in
          const updatedApps = connectedApps.map(app => ({
            ...app,
            isConnected: true,
            lastSync: new Date()
          }));
          
          setConnectedApps(updatedApps);
          
          // Update localStorage to include connected apps
          localStorage.setItem('user', JSON.stringify({
            ...userData,
            connectedApps: updatedApps
          }));
        }
      } else {
        // Clear expired login
        localStorage.removeItem('user');
      }
    }
  }, []); 

  // Initialize prices state when initialPrices changes
  useEffect(() => {
    if (initialPrices.length > 0) {
      setPrices(initialPrices);
    }
  }, [initialPrices]);

  // Connect an app
  const connectApp = (platform: string) => {
    const updatedApps = connectedApps.map(app => 
      app.platform === platform ? { ...app, isConnected: true, lastSync: new Date() } : app
    );
    
    setConnectedApps(updatedApps);
    
    // Update localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      localStorage.setItem('user', JSON.stringify({
        ...userData,
        connectedApps: updatedApps
      }));
    }
    
    // Simulate fetching new data from the connected platform
    simulatePriceUpdatesFromPlatform(platform);
  };
  
  // Disconnect an app
  const disconnectApp = (platform: string) => {
    const updatedApps = connectedApps.map(app => 
      app.platform === platform ? { ...app, isConnected: false, lastSync: undefined } : app
    );
    
    setConnectedApps(updatedApps);
    
    // Update localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      localStorage.setItem('user', JSON.stringify({
        ...userData,
        connectedApps: updatedApps
      }));
    }
  };
  
  // Simulate fetching price updates from a specific platform
  const simulatePriceUpdatesFromPlatform = (platform: string) => {
    if (!isLoggedIn || prices.length === 0) return;
    
    // Create 2-3 random updates from the specified platform
    const numUpdates = Math.floor(Math.random() * 2) + 2; // 2-3 updates
    const updates: PriceUpdate[] = [];
    
    for (let i = 0; i < numUpdates; i++) {
      const randomItemIndex = Math.floor(Math.random() * prices.length);
      const randomItem = prices[randomItemIndex];
      
      if (!randomItem?.pricingOptions) continue;
      
      const platformOption = randomItem.pricingOptions.find(
        (option: any) => option.platform === platform
      );
      
      if (!platformOption) continue;
      
      // Generate a random price change (small fluctuation)
      const priceChange = (Math.random() * 2 - 1) * 2; // Between -2 and +2
      const oldPrice = platformOption.price;
      const newPrice = Math.max(0.99, oldPrice + priceChange).toFixed(2);
      
      // Random chance for a discount
      const hasDiscount = Math.random() > 0.7;
      const discountCode = hasDiscount ? generateDiscountCode() : undefined;
      
      // Create the update
      const update: PriceUpdate = {
        itemId: randomItem.id,
        platform: platform,
        oldPrice: oldPrice,
        newPrice: parseFloat(newPrice),
        hasDiscount,
        discountCode
      };
      
      updates.push(update);
    }
    
    // Update prices
    setPrices(currentPrices => {
      return currentPrices.map(item => {
        const itemUpdate = updates.find(u => u.itemId === item.id);
        if (itemUpdate) {
          return {
            ...item,
            pricingOptions: item.pricingOptions.map((option: any) => {
              if (option.platform === itemUpdate.platform) {
                return {
                  ...option,
                  price: itemUpdate.newPrice,
                  discountCode: itemUpdate.discountCode
                };
              }
              return option;
            })
          };
        }
        return item;
      });
    });
    
    // Add the updates to the list of recent updates
    setUpdates(prev => [...updates, ...prev].slice(0, 5));
  };

  // Simulate real-time price updates
  useEffect(() => {
    if (!isLoggedIn || prices.length === 0) return;

    const interval = setInterval(() => {
      // Only use platforms that the user has connected
      const connectedPlatformNames = connectedApps
        .filter(app => app.isConnected)
        .map(app => app.platform);
      
      if (connectedPlatformNames.length === 0) return;
      
      // Randomly select a connected platform
      const randomPlatformIndex = Math.floor(Math.random() * connectedPlatformNames.length);
      const randomPlatform = connectedPlatformNames[randomPlatformIndex];
      
      // Randomly select an item
      const randomItemIndex = Math.floor(Math.random() * prices.length);
      const randomItem = prices[randomItemIndex];
      
      if (!randomItem?.pricingOptions) return;
      
      const platformOption = randomItem.pricingOptions.find(
        (option: any) => option.platform === randomPlatform
      );
      
      if (!platformOption) return;
      
      // Generate a random price change (small fluctuation)
      const priceChange = (Math.random() * 2 - 1) * 2; // Between -2 and +2
      const oldPrice = platformOption.price;
      const newPrice = Math.max(0.99, oldPrice + priceChange).toFixed(2);
      
      // Random chance for a discount
      const hasDiscount = Math.random() > 0.8;
      const discountCode = hasDiscount ? generateDiscountCode() : undefined;
      
      // Create the update
      const update: PriceUpdate = {
        itemId: randomItem.id,
        platform: randomPlatform,
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
                if (option.platform === randomPlatform) {
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
  }, [isLoggedIn, prices, connectedApps]);

  return { 
    prices, 
    updates, 
    isLoggedIn, 
    connectedApps, 
    connectApp, 
    disconnectApp, 
    simulatePriceUpdatesFromPlatform 
  };
}

// Helper function to generate a random discount code
function generateDiscountCode() {
  const codes = [
    "SAVE10", "NEWUSER", "TASTY20", "HUNGRY", "SPCL15", 
    "WEEKEND", "FOODIE", "WELCOME", "OFFER25", "FIRST50"
  ];
  return codes[Math.floor(Math.random() * codes.length)];
}
