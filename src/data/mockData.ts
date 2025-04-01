
export interface FoodItem {
  id: string;
  name: string;
  restaurant: string;
  cuisine: string;
  description: string;
  imageUrl: string;
  rating: number;
  pricingOptions: {
    platform: string;
    price: number;
    deliveryFee: number;
    estimatedTime: number;
    discountCode?: string;
  }[];
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  imageUrl: string;
  rating: number;
  deliveryTime: number;
  distance: string;
  platforms: string[];
}

// Sample food items data
export const foodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Chicken Biryani',
    restaurant: 'Biryani House',
    cuisine: 'Indian',
    description: 'Aromatic basmati rice cooked with tender chicken pieces and authentic spices.',
    imageUrl: 'https://source.unsplash.com/random/300x200/?biryani',
    rating: 4.5,
    pricingOptions: [
      {
        platform: 'Swiggy',
        price: 12.99,
        deliveryFee: 1.99,
        estimatedTime: 35,
        discountCode: 'FIRST50',
      },
      {
        platform: 'Zomato',
        price: 13.49,
        deliveryFee: 0,
        estimatedTime: 40,
      },
      {
        platform: 'UberEats',
        price: 14.99,
        deliveryFee: 2.49,
        estimatedTime: 30,
      },
    ],
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    restaurant: 'Pizza Paradise',
    cuisine: 'Italian',
    description: 'Classic pizza with tomato sauce, mozzarella, fresh basil, salt, and olive oil.',
    imageUrl: 'https://source.unsplash.com/random/300x200/?pizza',
    rating: 4.2,
    pricingOptions: [
      {
        platform: 'Swiggy',
        price: 10.99,
        deliveryFee: 1.49,
        estimatedTime: 25,
      },
      {
        platform: 'Zomato',
        price: 9.99,
        deliveryFee: 1.99,
        estimatedTime: 30,
        discountCode: 'PIZZA10',
      },
      {
        platform: 'UberEats',
        price: 11.49,
        deliveryFee: 0,
        estimatedTime: 35,
      },
    ],
  },
  {
    id: '3',
    name: 'Butter Chicken',
    restaurant: 'Punjab Grill',
    cuisine: 'Indian',
    description: 'Tender chicken in a creamy tomato sauce with butter and aromatic spices.',
    imageUrl: 'https://source.unsplash.com/random/300x200/?curry',
    rating: 4.7,
    pricingOptions: [
      {
        platform: 'Swiggy',
        price: 14.99,
        deliveryFee: 1.99,
        estimatedTime: 40,
      },
      {
        platform: 'Zomato',
        price: 13.99,
        deliveryFee: 2.49,
        estimatedTime: 35,
        discountCode: 'TASTY15',
      },
      {
        platform: 'UberEats',
        price: 15.49,
        deliveryFee: 0,
        estimatedTime: 45,
      },
    ],
  },
  {
    id: '4',
    name: 'Sushi Platter',
    restaurant: 'Tokyo Bites',
    cuisine: 'Japanese',
    description: 'Assorted fresh sushi including salmon, tuna, and avocado rolls with pickled ginger and wasabi.',
    imageUrl: 'https://source.unsplash.com/random/300x200/?sushi',
    rating: 4.8,
    pricingOptions: [
      {
        platform: 'Swiggy',
        price: 22.99,
        deliveryFee: 2.99,
        estimatedTime: 45,
      },
      {
        platform: 'Zomato',
        price: 24.99,
        deliveryFee: 0,
        estimatedTime: 50,
        discountCode: 'SUSHI20',
      },
      {
        platform: 'UberEats',
        price: 23.49,
        deliveryFee: 3.49,
        estimatedTime: 40,
      },
    ],
  },
  {
    id: '5',
    name: 'Double Cheeseburger',
    restaurant: 'Burger Junction',
    cuisine: 'American',
    description: 'Two juicy beef patties with melted cheese, lettuce, tomato, onions, and special sauce.',
    imageUrl: 'https://source.unsplash.com/random/300x200/?burger',
    rating: 4.3,
    pricingOptions: [
      {
        platform: 'Swiggy',
        price: 8.99,
        deliveryFee: 1.49,
        estimatedTime: 25,
        discountCode: 'BURGER5',
      },
      {
        platform: 'Zomato',
        price: 9.49,
        deliveryFee: 0.99,
        estimatedTime: 30,
      },
      {
        platform: 'UberEats',
        price: 8.49,
        deliveryFee: 1.99,
        estimatedTime: 20,
      },
    ],
  },
  {
    id: '6',
    name: 'Pad Thai',
    restaurant: 'Thai Spice',
    cuisine: 'Thai',
    description: 'Stir-fried rice noodles with eggs, tofu, bean sprouts, peanuts, and lime in a sweet-savory sauce.',
    imageUrl: 'https://source.unsplash.com/random/300x200/?padthai',
    rating: 4.4,
    pricingOptions: [
      {
        platform: 'Swiggy',
        price: 11.99,
        deliveryFee: 1.99,
        estimatedTime: 35,
      },
      {
        platform: 'Zomato',
        price: 10.99,
        deliveryFee: 2.49,
        estimatedTime: 40,
      },
      {
        platform: 'UberEats',
        price: 12.49,
        deliveryFee: 0,
        estimatedTime: 30,
        discountCode: 'THAI10',
      },
    ],
  }
];

// Sample restaurants data
export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Biryani House',
    cuisine: ['Indian', 'Mughlai'],
    imageUrl: 'https://source.unsplash.com/random/300x200/?restaurant,indian',
    rating: 4.5,
    deliveryTime: 35,
    distance: '1.2 km',
    platforms: ['Swiggy', 'Zomato', 'UberEats'],
  },
  {
    id: '2',
    name: 'Pizza Paradise',
    cuisine: ['Italian', 'Fast Food'],
    imageUrl: 'https://source.unsplash.com/random/300x200/?restaurant,pizza',
    rating: 4.2,
    deliveryTime: 25,
    distance: '0.8 km',
    platforms: ['Swiggy', 'Zomato'],
  },
  {
    id: '3',
    name: 'Punjab Grill',
    cuisine: ['Indian', 'North Indian'],
    imageUrl: 'https://source.unsplash.com/random/300x200/?restaurant,punjabi',
    rating: 4.7,
    deliveryTime: 40,
    distance: '1.5 km',
    platforms: ['Swiggy', 'Zomato', 'UberEats'],
  },
  {
    id: '4',
    name: 'Tokyo Bites',
    cuisine: ['Japanese', 'Sushi'],
    imageUrl: 'https://source.unsplash.com/random/300x200/?restaurant,japanese',
    rating: 4.8,
    deliveryTime: 45,
    distance: '2.1 km',
    platforms: ['Zomato', 'UberEats'],
  },
  {
    id: '5',
    name: 'Burger Junction',
    cuisine: ['American', 'Fast Food'],
    imageUrl: 'https://source.unsplash.com/random/300x200/?restaurant,burger',
    rating: 4.3,
    deliveryTime: 25,
    distance: '1.0 km',
    platforms: ['Swiggy', 'Zomato', 'UberEats'],
  },
  {
    id: '6',
    name: 'Thai Spice',
    cuisine: ['Thai', 'Asian'],
    imageUrl: 'https://source.unsplash.com/random/300x200/?restaurant,thai',
    rating: 4.4,
    deliveryTime: 35,
    distance: '1.8 km',
    platforms: ['Swiggy', 'UberEats'],
  }
];
