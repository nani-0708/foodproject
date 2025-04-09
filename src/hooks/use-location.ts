
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
        setLocation({
          loading: false,
          error: `Unable to retrieve your location: ${error.message}`,
          coords: null,
        });
      }
    );
  }, []);

  return location;
};
