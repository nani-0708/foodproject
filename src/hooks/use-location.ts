
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
  }, []);

  return location;
};
