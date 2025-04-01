
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.8e94856e60734987a3cd05bfcd964a89',
  appName: 'bite-cost-finder',
  webDir: 'dist',
  server: {
    url: 'https://8e94856e-6073-4987-a3cd-05bfcd964a89.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    // SplashScreen config if needed
  }
};

export default config;
