import React from 'react';
import FeaturedCakes from '../Components/FeaturedCakes';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel CSS
import banner1 from '../assets/banner1.jpg';
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)]">

      {/* Carousel Section */}
      <div className="mb-10">
        <Carousel 
          autoPlay 
          infiniteLoop 
          interval={5000} 
          showThumbs={false} 
          showStatus={false} 
          className="overflow-hidden shadow-lg"
        >
          {/* launching banner3 */}
          <div 
            onClick={() => window.location.href = "/"} 
            className="cursor-pointer"
          >
            <img src={banner3} alt="Launching Banner" className="w-full h-full object-cover" />
          </div>
          {/* Delivery banner2 */}
          <div 
            onClick={() => window.location.href = "/careers"} 
            className="cursor-pointer"
          >
            <img src={banner2} alt="Discount Banner" className="w-full h-full object-cover" />
          </div>

          {/* delivery banner1 */}
          <div 
            onClick={() => window.location.href = "/"} 
            className="cursor-pointer"
          >
            <img src={banner1} alt="Career Opportunities" className="w-full h-full object-cover" />
          </div>
        </Carousel>
      </div>

      {/* Categories Section (Cakes, Sweets, Nature Products, Gift Boxes) */}
      <div className="flex justify-between gap-1 sm:gap-2 mb-12 px-4"> {/* Reduced gap here */}
        {[
          { img: "https://www.wallsauce.com/sr/567384/5/29/0/cake-shop-wallpaper.jpg", label: "Cake Shops", link: "/shops" },
          { img: "https://i.pinimg.com/736x/24/65/37/2465374b8c535dc31528c03a9777d36d.jpg", label: "Cakes", link: "/cakes" },
          { img: "https://images.stockcake.com/public/5/f/6/5f62fe2d-5565-454e-a110-6a02d45cba24_large/delectable-sweet-treats-stockcake.jpg", label: "Sweets", link: "/sweets" },
          { img: "https://natrue.org/uploads/2021/01/Upcycled-cosmetics.png", label: "Nature Products", link: "/nature" },
          { img: "https://www.elizabethandernest.co.uk/cdn/shop/products/MUM-ECO-INFRONT-BOX.jpg?v=1676498319", label: "Gift Boxes", link: "/gift" },

          { img: "https://cdn-icons-png.flaticon.com/512/4201/4201973.png", label: "Download App", link: "/download" }

        ].map((item, index) => (
          <div 
            key={index} 
            onClick={() => window.location.href = item.link} 
            className="flex flex-col items-center cursor-pointer transition-transform transform hover:scale-105"
          >
            <div className="w-32 h-32 sm:w-36 sm:h-36 bg-white rounded-full shadow-lg overflow-hidden border-4 border-[rgba(254,129,128,0.7)]"> {/* Increased size here */}
              <img src={item.img} alt={item.label} className="w-full h-full object-cover" />
            </div>
            <p className="mt-2 text-sm sm:text-lg font-semibold text-gray-800">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Featured Cakes Section */}
      <FeaturedCakes />
     
    </div>
  );
}
