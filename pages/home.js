import React from "react";
import Image from "next/image";

import { auth } from '../lib/firebase';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Home = () => {
  const slides = [
    {
      image:
        "/images/bg.jpg",
      title: "Welcome", 
      description: "Discover amazing products",
    },
  ];

  const categories = [
    {
      name: "Women Ethnic",
      image:
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      name: "Men Western",
      image:
        "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      name: "Kids Wear",
      image:
        "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      name: "Home & Kitchen",
      image:
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      name: "Beauty & Health",
      image:
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      name: "Jewellery & Accessories",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      name: "Bags & Footwear",
      image:
        "https://images.unsplash.com/photo-1594422846558-813f911817f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      name: "Homemade food products",
      image:
        "https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
  ];

  return (
    <>
    <Navbar/>    
    <div className="relative w-full bg-white">
      <div className="absolute top-4 left-0 right-0 z-10 px-4">
        <div className="flex justify-between items-center">
      
          <button
            onClick={() => auth.signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
      </div>
      <div>
        {slides.map((slide, index) => (
          <div key={index} className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
            <Image
              src={slide.image}
              alt={`E-commerce banner ${index + 1}`}
              layout="fill"
              objectFit="cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                {slide.title}
              </h2>
              <p className="text-sm md:text-base lg:text-lg">
                {slide.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="max-w-[1300px] mx-auto px-4 py-10 sm:py-16 lg:py-20">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-0">
            Browse by category
          </h2>
          <button className="border border-black px-4 py-2 text-sm sm:text-base">
            Show more
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-36 sm:h-36 rounded-full bg-gray-200 mb-2">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-xs sm:text-sm text-center">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Home;