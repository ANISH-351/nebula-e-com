import React from "react";
import banner1 from "../../assets/home-images/banner1.png";

const Banner = () => {
  return (
    <section className="w-full bg-white">
      
      <div className="relative w-full h-[75vh] sm:h-[85vh] lg:h-[90vh] overflow-hidden">
        
        {/* Banner Image */}
        <img
          src={banner1}
          alt="Fashion Banner"
          className="w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          
          <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12">
            
            <div className="max-w-xl lg:max-w-2xl space-y-4 sm:space-y-6">
              
              {/* Top Text */}
              <span className="inline-block text-xs sm:text-sm tracking-[3px] sm:tracking-[4px] uppercase text-[#f1d3a2] font-medium">
                Luxury Collection
              </span>

              {/* Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-serif leading-tight text-white">
                Elevate Your <br />
                Everyday Style
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed max-w-lg">
                Discover premium fashion and timeless essentials crafted
                for modern lifestyles. Minimal design with luxury feel.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
                
                <button className="bg-[#c5a46d] hover:bg-[#b89552] transition text-white px-6 sm:px-8 py-3 rounded-full text-sm tracking-wide">
                  Shop Now
                </button>

                <button className="border border-white/40 text-white hover:bg-white hover:text-black transition px-6 sm:px-8 py-3 rounded-full text-sm tracking-wide">
                  Explore
                </button>

              </div>

            </div>

          </div>
        </div>

      </div>

    </section>
  );
};

export default Banner;