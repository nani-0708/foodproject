
import { useState, useEffect } from 'react';

type LocationState = {
  loading: boolean;
  error: string | null;
  coords: {
    latitude: number;
    longitude: number;
  } | null;
};

export const useLocation = () => {
  const [location, setLocation] = useState<LocationState>({
    loading: true,
    error: null,
    coords: null,
  });

  useEffect(() => {
    // Check if we should use custom location from settings
    const useCustomLocation = localStorage.getItem('useCustomLocation') === 'true';
    const customLat = localStorage.getItem('customLat');
    const customLng = localStorage.getItem('customLng');
    
    if (useCustomLocation && customLat && customLng) {
      // Use custom location from settings
      try {
        const latitude = parseFloat(customLat);
        const longitude = parseFloat(customLng);
        
        if (isNaN(latitude) || isNaN(longitude)) {
          throw new Error("Invalid custom coordinates");
        }
        
        setLocation({
          loading: false,
          error: null,
          coords: { latitude, longitude },
        });
        return; // Exit early, no need to request browser geolocation
      } catch (error) {
        console.error("Error using custom location:", error);
        // If custom location fails, fall back to browser geolocation
        localStorage.removeItem('useCustomLocation');
      }
    }
    
    // If not using custom location or custom location failed, try browser geolocation
    if (!navigator.geolocation) {
      setLocation({
        loading: false,
        error: 'Geolocation is not supported by your browser',
        coords: null,
      });
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          loading: false,
          error: null,
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access was denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get your location timed out.';
            break;
          default:
            errorMessage = `An unknown error occurred: ${error.message}`;
        }
        
        setLocation({
          loading: false,
          error: errorMessage,
          coords: null,
        });
      },
      options
    );
  }, []); // The empty dependency array ensures this effect runs only once on mount

  return location;
};
