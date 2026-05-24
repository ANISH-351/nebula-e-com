import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import men from "../../assets/home-images/men.png";
import women from "../../assets/home-images/women.png";
import accessories from "../../assets/home-images/acc.png";
import bags from "../../assets/home-images/bag.png";
import { Link } from "react-router-dom";

function Category() {
  const categories = [
    {
      id: 1,
      name: "Men",
      image: men,
    },
    {
      id: 2,
      name: "Women",
      image: women,
    },
    {
      id: 3,
      name: "Accessories",
      image: accessories,
    },
    {
      id: 4,
      name: "Bags",
      image: bags,
    },
  ];

  return (
    <section className="w-full py-14 bg-white">
      <div className="container mx-auto px-4 md:px-[40px] lg:px-[80px] py-4">
        
        {/* Heading */}
        <div className="mb-10">
          <span className="text-sm tracking-[4px] uppercase text-[#c5a46d]">
            Categories
          </span>

          <h2 className="text-3xl lg:text-5xl font-serif text-gray-900 mt-3">
            Shop By Category
          </h2>
        </div>

        {/* Swiper */}
        <Swiper
          spaceBetween={20}
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
          {categories.map((item) => (
            <SwiperSlide key={item.id}>
              <Link to="/category">
              
              <div className="group relative overflow-hidden rounded-[30px] cursor-pointer">
                
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full  object-cover transition duration-500 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20"></div>

         

              </div>
              </Link>

            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default Category;