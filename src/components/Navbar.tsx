
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, LogIn, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('user') !== null;
  
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm w-full">
      <div className="container mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-food-orange">BiteCompare</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className={`${location.pathname === '/' ? 'text-food-orange' : 'text-food-dark'} hover:text-food-orange transition-colors`}>
            Home
          </Link>
          <Link to="/about" className={`${location.pathname === '/about' ? 'text-food-orange' : 'text-food-dark'} hover:text-food-orange transition-colors`}>
            About
          </Link>
          {isLoggedIn && (
            <Link to="/settings" className={`${location.pathname === '/settings' ? 'text-food-orange' : 'text-food-dark'} hover:text-food-orange transition-colors`}>
              Connected Apps
            </Link>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-food-dark hover:text-food-orange">
            <Search className="h-5 w-5" />
          </Button>
          
          {isLoggedIn ? (
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-food-orange text-food-orange hover:bg-food-orange hover:text-white"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-food-orange text-food-orange hover:bg-food-orange hover:text-white"
              onClick={() => navigate('/login')}
            >
              Login
              <LogIn className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
