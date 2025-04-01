
import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="food-card">
      <div className="h-48 w-full bg-gray-200 animate-pulse-slow"></div>
      <div className="p-4">
        <div className="h-5 w-3/4 bg-gray-200 rounded-md animate-pulse-slow mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded-md animate-pulse-slow mb-3"></div>
        <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse-slow mb-2"></div>
        <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse-slow mb-3"></div>
        
        <div className="border-t pt-3">
          <div className="h-4 w-1/3 bg-gray-200 rounded-md animate-pulse-slow mb-2"></div>
          <div className="space-y-2">
            <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse-slow"></div>
            <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse-slow"></div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="h-4 w-1/3 bg-gray-200 rounded-md animate-pulse-slow"></div>
            <div className="h-9 w-24 bg-gray-200 rounded-md animate-pulse-slow"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
