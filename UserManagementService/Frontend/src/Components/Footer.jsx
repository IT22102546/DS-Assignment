import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-[#FE8180] text-white py-10
">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm justify-items-center">
          {/* Useful Links */}
          <div className="mb-8 md:mb-0">
            <h1 className="text-2xl font-bold text-white mb-4">Useful Links</h1>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Products</a></li>
              <li><a href="#" className="hover:underline">Services</a></li>
              <li><a href="#" className="hover:underline">Legal</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Help</a></li>
            </ul>
          </div>

          {/* About Us */}
          <div className="text-center mb-8 md:mb-0">
            <h1 className="text-2xl  font-bold text-white mb-4">About Us</h1>
            <p className="leading-6 text-sm">
              We are a team of passionate people whose goal is to improve everyone's life through disruptive products. We build great products to solve your business problems.
            </p>
            <p className="leading-6 text-sm mt-4">
              Our products are designed for small to medium-size companies willing to optimize their performance.
            </p>
          </div>

          {/* Connect with Us */}
          <div className="text-center">
            <h1 className="text-2xl font-bold  text-white  mb-4">Connect with Us</h1>
            <ul className="space-y-2">
              <li><a href="mailto:contact@yourcompany.com" className="hover:underline">Contact Us</a></li>
              <li><a href="https://www.yourcompany.com" className="hover:underline">www.ab.com</a></li>
              <li>0214905815</li>
            </ul>
            <div className="flex justify-center space-x-4 mt-6">
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-white text-pink-600 rounded-full hover:bg-pink-200">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-white text-pink-600 rounded-full hover:bg-pink-200">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-white text-pink-600 rounded-full hover:bg-pink-200">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-white text-pink-600 rounded-full hover:bg-pink-200">
                <FontAwesomeIcon icon={faHome} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-sm text-gray-200">
          © 2025 Your Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
