import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCategories } from "../../components/features/categorySlice";

function Category() {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((s) => s.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <section className="w-full pt-14 bg-white">
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
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <Swiper
            spaceBetween={20}
            slidesPerView={4}
            breakpoints={{
              0: { slidesPerView: 1.2 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
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
                      className="w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20"></div>

                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

      </div>
    </section>
  );
}

export default Category;