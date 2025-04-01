
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check } from 'lucide-react';

const About = () => {
  const features = [
    'Real-time price comparison across multiple food delivery platforms',
    'Save money on your favorite meals by finding the best deals',
    'Find discount codes that can be applied to your orders',
    'Compare delivery times to get your food faster',
    'Discover new restaurants and cuisine options',
    'Create a seamless food ordering experience'
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-white to-food-orange/5 py-16">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About <span className="text-food-orange">BiteCompare</span>
            </h1>
            <p className="text-food-gray max-w-2xl mx-auto">
              Our mission is to help you save time and money on food delivery by comparing prices across multiple platforms.
            </p>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Story</h2>
                <p className="text-food-gray mb-4">
                  BiteCompare was created out of frustration with having to check multiple food delivery apps to find the best deals. We realized that people were spending too much time and money ordering food.
                </p>
                <p className="text-food-gray mb-4">
                  Our platform aggregates menu data from leading food delivery services like Swiggy and Zomato, allowing you to compare prices, delivery times, and exclusive offers all in one place.
                </p>
                <p className="text-food-gray">
                  We're dedicated to continuously improving our service to help you make smarter food ordering decisions.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Key Features</h3>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-food-orange mr-2 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        <section className="bg-food-light py-12">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="w-12 h-12 bg-food-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-food-orange">1</span>
                </div>
                <h3 className="text-xl font-medium mb-3">Search</h3>
                <p className="text-food-gray">
                  Enter a food item or restaurant name to start your search.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="w-12 h-12 bg-food-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-food-orange">2</span>
                </div>
                <h3 className="text-xl font-medium mb-3">Compare</h3>
                <p className="text-food-gray">
                  View prices, delivery times, and offers from different platforms side by side.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="w-12 h-12 bg-food-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-food-orange">3</span>
                </div>
                <h3 className="text-xl font-medium mb-3">Order</h3>
                <p className="text-food-gray">
                  Choose the best option and place your order directly through your preferred platform.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
