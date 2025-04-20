import React from 'react';
import { motion } from 'framer-motion';

export default function Career() {
  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)] min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-pink-800 text-center mb-6">
          Join Our <span className="text-pink-600">Delicious</span> Team
        </h1>
        <motion.p 
          className="text-lg md:text-xl text-center mb-12 text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Whether you're a delivery hero, a baking artist, or want to create sweet surprises, we have the perfect opportunity for you!
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Delivery Persons Card */}
          <motion.div
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.2 }}
            className=" rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Delivery Heroes</h2>
              <p className="text-gray-600 mb-6">
                Be the smile behind every delivery! Join our fleet and bring joy to customers with timely cake deliveries.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#FE8180] hover:bg-[#e57373] text-white font-medium py-3 px-8 rounded-full shadow-md transition-all duration-300"
                onClick={() => window.location.href = '/signupdelivery'}
              >
                Join as Delivery
              </motion.button>
            </div>
          </motion.div>

          {/* Bakery Shops Card */}
          <motion.div
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.2 }}
            className=" rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Baking Artists</h2>
              <p className="text-gray-600 mb-6">
                Showcase your culinary masterpieces! Partner with us to reach more customers and grow your bakery business.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#FE8180] hover:bg-[#e57373] text-white font-medium py-3 px-8 rounded-full shadow-md transition-all duration-300"
                onClick={() => window.location.href = '/signupshops'}
              >
                Partner with Us
              </motion.button>
            </div>
          </motion.div>

          {/* Surprise Team Card */}
          <motion.div
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.2 }}
            className=" rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Surprise Team</h2>
              <p className="text-gray-600 mb-6">
                Create magical moments! Join our team that specializes in creating unforgettable surprise cake experiences.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#FE8180] hover:bg-[#e57373] text-white font-medium py-3 px-8 rounded-full shadow-md transition-all duration-300"
                onClick={() => window.location.href = '/signupteam'}
              >
                Join Surprise Team
              </motion.button>
            </div>
          </motion.div>
        </div>

        
      </motion.div>
    </div>
  );
}