import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import "swiper/css";

import shirt from "../../assets/home-images/pant.png";
import pant from "../../assets/home-images/pant.png";
import shirt2 from "../../assets/home-images/shirt.png";
import shoes from "../../assets/home-images/pant.png";

function NewArrival() {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      name: "Premium Beige Shirt",
      price: "₹8999",
      image: shirt,
    },
    {
      id: 2,
      name: "Classic Formal Pant",
      price: "₹7200",
      image: pant,
    },
    {
      id: 3,
      name: "Luxury Overshirt",
      price: "₹3999",
      image: shirt2,
    },
    {
      id: 4,
      name: "Minimal Leather Shoes",
      price: "₹4400",
      image: shoes,
    },
  ];

  return (
    <section className="w-full pb-16 bg-white">
      <div className="container mx-auto px-4 md:px-[40px] lg:px-[80px]">
        
        {/* Heading */}
        <div className="flex items-end justify-between mb-10">
          
          <div>
            <span className="text-sm tracking-[4px] uppercase text-[#c5a46d]">
              New Collection
            </span>

            <h2 className="text-3xl lg:text-5xl font-serif text-gray-900 mt-3">
              New Arrivals
            </h2>
          </div>

          <button className="hidden md:block border border-[#d9c4a0] text-[#b89552] px-6 py-3 rounded-full hover:bg-[#faf7f2] transition">
            View All
          </button>
        </div>

        {/* Swiper */}
        <Swiper
          spaceBetween={24}
          slidesPerView={4}
          breakpoints={{
            0: {
              slidesPerView: 1.2,
            },
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              
              {/* Clickable Card */}
              <div
                onClick={() => navigate("/product-detail")}
                className="group cursor-pointer"
              >
                
                {/* Product Card */}
                <div className="relative overflow-hidden rounded-[30px] bg-[#faf7f2]">
                  
                  {/* Wishlist */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Wishlist clicked");
                    }}
                    className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md text-[#b89552] hover:bg-[#c5a46d] hover:text-white transition"
                  >
                    <FiHeart size={20} />
                  </button>

                  {/* Product Image */}
                  <div className="overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-[380px] object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Add To Cart */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition duration-300">
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Add To Cart clicked");
                      }}
                      className="flex items-center gap-2 bg-[#c5a46d] hover:bg-[#b89552] text-white px-6 py-3 rounded-full shadow-lg whitespace-nowrap"
                    >
                      <FiShoppingCart />
                      Add To Cart
                    </button>

                  </div>
                </div>

                {/* Product Details */}
                <div className="pt-5">
                  
                  <h3 className="text-lg font-medium text-gray-900">
                    {product.name}
                  </h3>

                  <p className="text-[#b89552] text-lg mt-2">
                    {product.price}
                  </p>

                </div>

              </div>

            </SwiperSlide>
          ))}
        </Swiper>

        {/* Mobile Button */}
        <div className="mt-8 flex justify-center md:hidden">
          <button className="border border-[#d9c4a0] text-[#b89552] px-6 py-3 rounded-full hover:bg-[#faf7f2] transition">
            View All
          </button>
        </div>

      </div>
    </section>
  );
}

export default NewArrival;