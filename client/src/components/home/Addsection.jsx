import React from "react";
import add from "../../assets/home-images/add.png";

function Addsection() {
  return (
    <section className=" container mx-auto bg-white pb-8 px-4 sm:px-6 lg:px-10">
      <div className="relative w-full h-[25vh] sm:h-[35vh] lg:h-[80vh] overflow-hidden rounded-3xl shadow-md">
        
        {/* Banner Image */}
        <img
          src={add}
          alt="New Arrivals Fashion"
          className="w-full h-full object-cover"
        />

     
      </div>
    </section>
  );
}

export default Addsection;