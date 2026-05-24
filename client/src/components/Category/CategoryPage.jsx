import React from "react";
import {
  FiHeart,
  FiShoppingCart,
  FiFilter,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import shirt from "../../assets/home-images/shirt.png";
import pant from "../../assets/home-images/pant.png";
import shoes from "../../assets/home-images/pant.png";
import bag from "../../assets/home-images/pant.png";
import watch from "../../assets/home-images/shirt.png";
import perfume from "../../assets/home-images/pant.png";

function CategoryPage() {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      name: "Premium Beige Shirt",
      category: "Men",
      price: "₹8999",
      image: shirt,
    },
    {
      id: 2,
      name: "Classic Formal Pant",
      category: "Men",
      price: "₹7200",
      image: pant,
    },
    {
      id: 3,
      name: "Minimal Leather Shoes",
      category: "Footwear",
      price: "₹4400",
      image: shoes,
    },
    {
      id: 4,
      name: "Luxury Hand Bag",
      category: "Bags",
      price: "₹5160",
      image: bag,
    },
    {
      id: 5,
      name: "Premium Gold Watch",
      category: "Accessories",
      price: "₹3220",
      image: watch,
    },
    {
      id: 6,
      name: "Luxury Perfume",
      category: "Beauty",
      price: "₹4595",
      image: perfume,
    },
  ];

  return (
    <section className="w-full bg-white min-h-screen py-10 lg:py-16">
      
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          
          <div>
            
            <span className="text-sm tracking-[4px] uppercase text-[#c5a46d]">
              Premium Collection
            </span>

            <h1 className="text-4xl lg:text-5xl font-serif text-gray-900 mt-4">
              Mens
            </h1>

          </div>

          {/* Sort */}
          <div className="flex items-center gap-3 border border-[#e6dcc8] rounded-full px-5 py-3 w-fit">
            
            <FiFilter className="text-[#b89552]" />

            <select className="outline-none bg-transparent text-gray-600">
              <option>Sort By</option>
              <option>Newest</option>
              <option>Price Low To High</option>
              <option>Price High To Low</option>
            </select>

          </div>

        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate("/product-detail")}
              className="group bg-white rounded-[30px] overflow-hidden border border-[#f1e8db] hover:shadow-xl transition duration-300 cursor-pointer"
            >
              
              {/* Product Image */}
              <div className="relative overflow-hidden bg-[#faf7f2]">
                
                {/* Wishlist */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Wishlist clicked");
                  }}
                  className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-[#b89552] hover:bg-[#c5a46d] hover:text-white transition"
                >
                  <FiHeart size={18} />
                </button>

                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[380px] object-cover transition duration-500 group-hover:scale-105"
                />

              </div>

              {/* Product Details */}
              <div className="p-6">
                
                <span className="text-sm uppercase tracking-[3px] text-[#c5a46d]">
                  {product.category}
                </span>

                <h2 className="text-2xl font-serif text-gray-900 mt-2">
                  {product.name}
                </h2>

                <div className="flex items-center justify-between mt-5">
                  
                  <p className="text-2xl font-semibold text-[#b89552]">
                    {product.price}
                  </p>

                  {/* Add To Cart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Add To Cart clicked");
                    }}
                    className="flex items-center gap-2 border border-[#d9c4a0] hover:bg-[#c5a46d] hover:text-white transition text-[#b89552] px-5 py-2 rounded-full text-sm"
                  >
                    <FiShoppingCart />
                    Add To Cart
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default CategoryPage;