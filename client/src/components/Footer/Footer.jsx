import React from "react";
import {
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiYoutube,
  FiSend,
} from "react-icons/fi";

import logo from "../../assets/home-images/logo.png";

function Footer() {
  return (
    <footer className="bg-[#faf7f2] border-t border-[#eee3d2]">
      
      {/* Top Footer */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Logo & About */}
          <div>
            
           {/* Logo */}
                      <div className="flex items-center">
                       <img src={logo} alt="Logo" className="h-[50px] mb-[20px] md:h-[80px] w-auto" />
                      </div>

            <p className="text-gray-500 mt-5 leading-relaxed">
              Premium fashion and timeless essentials crafted for
              modern lifestyles with luxury minimal design.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-6">
              
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#d9c4a0] flex items-center justify-center text-[#b89552] hover:bg-[#c5a46d] hover:text-white transition"
              >
                <FiInstagram />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#d9c4a0] flex items-center justify-center text-[#b89552] hover:bg-[#c5a46d] hover:text-white transition"
              >
                <FiFacebook />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#d9c4a0] flex items-center justify-center text-[#b89552] hover:bg-[#c5a46d] hover:text-white transition"
              >
                <FiTwitter />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#d9c4a0] flex items-center justify-center text-[#b89552] hover:bg-[#c5a46d] hover:text-white transition"
              >
                <FiYoutube />
              </a>

            </div>
          </div>

          {/* Shop */}
          <div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-5">
              Shop
            </h3>

            <ul className="space-y-3 text-gray-500">
              <li>
                <a href="#" className="hover:text-[#c5a46d] transition">
                  Men
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-[#c5a46d] transition">
                  Women
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-[#c5a46d] transition">
                  Accessories
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-[#c5a46d] transition">
                  Bags
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-[#c5a46d] transition">
                  New Arrivals
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-5">
              Support
            </h3>

            <ul className="space-y-3 text-gray-500">
              
              <li>
                <a href="#" className="hover:text-[#c5a46d] transition">
                  Contact Us
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-[#c5a46d] transition">
                  FAQs
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-[#c5a46d] transition">
                  Shipping & Returns
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-[#c5a46d] transition">
                  Privacy Policy
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-[#c5a46d] transition">
                  Terms & Conditions
                </a>
              </li>

            </ul>
          </div>

          {/* Newsletter */}
          <div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-5">
              Newsletter
            </h3>

            <p className="text-gray-500 mb-5">
              Subscribe to get updates about new collections and offers.
            </p>

            <div className="flex items-center bg-white border border-[#e6dcc8] rounded-full overflow-hidden">
              
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-5 py-3 outline-none bg-transparent text-sm"
              />

              <button className="bg-[#c5a46d] hover:bg-[#b89552] transition text-white w-14 h-12 flex items-center justify-center">
                <FiSend />
              </button>

            </div>

          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-[#eee3d2]">
        
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <p className="text-sm text-gray-500 text-center md:text-left">
            © 2026 Nebula. All Rights Reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            
            <a href="#" className="hover:text-[#c5a46d] transition">
              Privacy
            </a>

            <a href="#" className="hover:text-[#c5a46d] transition">
              Terms
            </a>

            <a href="#" className="hover:text-[#c5a46d] transition">
              Cookies
            </a>

          </div>

        </div>
      </div>

    </footer>
  );
}

export default Footer;