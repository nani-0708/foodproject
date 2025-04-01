
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterBarProps {
  onSortChange: (value: string) => void;
  onFilterChange: (platform: string) => void;
  activePlatforms: string[];
}

const FilterBar = ({ onSortChange, onFilterChange, activePlatforms }: FilterBarProps) => {
  const platforms = ['Swiggy', 'Zomato', 'UberEats'];
  
  return (
    <div className="flex flex-wrap justify-between items-center gap-4 my-4">
      <div className="flex items-center gap-2">
        <span className="text-food-gray">Filter:</span>
        <div className="flex flex-wrap gap-2">
          {platforms.map((platform) => (
            <Button
              key={platform}
              variant={activePlatforms.includes(platform) ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(platform)}
              className={activePlatforms.includes(platform) ? "bg-food-orange" : ""}
            >
              {platform}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-food-gray">Sort by:</span>
        <Select onValueChange={onSortChange} defaultValue="price_low">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="delivery_time">Delivery Time</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;
