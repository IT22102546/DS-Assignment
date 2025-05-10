import React from "react";

export default function AboutUs() {
  return (
    <div className="w-full min-h-screen px-4 py-7 rounded-lg border ">
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .transition-slow {
          transition: all 0.5s ease;
        }
        .hover-scale {
          transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        .hover-scale:hover {
          transform: scale(1.02);
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>

      <div className="container mx-auto max-w-6xl mt-20">
        {/* Header with Image */}
        <div className="flex flex-col md:flex-row gap-8 mb-12 items-center md:items-start">
          {/* Image Section - Left Side */}
          <div className="w-full md:w-1/3 lg:w-2/5 animate-fade-in">
            <div className="rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-slow animate-float">
              <img
                src="https://i.pinimg.com/736x/1a/a1/ed/1aa1ed00ccf1d426ffe7cb5d0a279139.jpg"
                alt="OB Cakes"
                className="w-full h-auto object-cover hover-scale"
              />
            </div>
          </div>

          {/* Header Content - Right Side */}
          <div className="w-full md:w-2/3 lg:w-3/5 animate-fade-in delay-100">
            <h1 className="text-3xl sm:text-4xl font-bold text-black mb-4 transition-slow hover:text-black">
              Welcome to <span className="text-black">OB Cakes</span> -
              OverBlessings Taste
            </h1>
            <p className="text-xl text-black/90 mb-6 transition-slow hover:text-black">
              Where sweetness meets perfection! 🌟
            </p>
            <h2 className="text-2xl font-semibold text-black mb-4 transition-slow hover:text-black">
              Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed transition-slow hover:text-gray-800">
              At OB Cakes, we deliver not just desserts but an experience of joy
              and satisfaction, crafted with love and care. Every bite of our
              creations is a celebration of quality, freshness, and the essence
              of homemade goodness.
            </p>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Why Choose OB Cakes Section */}
          <div className="border rounded-xl p-8 shadow-lg hover:shadow-xl transition-slow animate-slide-up hover-scale">
            <h2 className="text-2xl font-semibold text-black mb-6 pb-2 border-b border-pink-100 transition-slow hover:text-black">
              Why Choose OB Cakes?
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start transition-slow hover:bg-green-50 p-3 rounded-lg">
                <div className="bg-green-100 rounded-full p-2 mr-4 transition-slow hover:bg-green-200">
                  <svg
                    className="w-5 h-5 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-black transition-slow hover:text-black">
                    Premium Quality
                  </h3>
                  <p className="transition-slow hover:text-gray-800">
                    We use the finest ingredients to ensure every product is as
                    indulgent as it is delightful.
                  </p>
                </div>
              </li>
              <li className="flex items-start transition-slow hover:bg-green-50 p-3 rounded-lg">
                <div className="bg-green-100 rounded-full p-2 mr-4 transition-slow hover:bg-green-200">
                  <svg
                    className="w-5 h-5 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-black transition-slow hover:text-black">
                    Freshly Made
                  </h3>
                  <p className="transition-slow hover:text-gray-800">
                    All our items are crafted with care and baked fresh to
                    order.
                  </p>
                </div>
              </li>
              <li className="flex items-start transition-slow hover:bg-green-50 p-3 rounded-lg">
                <div className="bg-green-100 rounded-full p-2 mr-4 transition-slow hover:bg-green-200">
                  <svg
                    className="w-5 h-5 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-black transition-slow hover:text-black">
                    Convenience
                  </h3>
                  <p className="transition-slow hover:text-gray-800">
                    From browsing our menu to doorstep delivery, we make it easy
                    for you to enjoy the treats you love.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Promise Section */}
          <div className="border rounded-xl p-8 shadow-lg hover:shadow-xl transition-slow animate-slide-up delay-100 hover-scale">
            <h2 className="text-2xl font-semibold text-black mb-6 pb-2 border-b border-pink-100 transition-slow hover:text-black">
              Our Promise
            </h2>
            <div className="flex items-start mb-6 transition-slow hover:bg-green-50 p-3 rounded-lg">
              <div className="bg-green-100 rounded-full p-3 mr-4 transition-slow hover:bg-green-200">
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <p className="text-gray-700 leading-relaxed transition-slow hover:text-gray-800">
                At OB Cakes, customer satisfaction is our top priority. We're
                committed to delivering exceptional products and service every
                time you order.
              </p>
            </div>
            <div className="flex items-start transition-slow hover:bg-green-50 p-3 rounded-lg">
              <div className="bg-green-100 rounded-full p-3 mr-4 transition-slow hover:bg-green-200">
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
              </div>
              <p className="text-gray-700 leading-relaxed transition-slow hover:text-gray-800">
                Have questions? Our customer service team is always ready to
                help with any inquiries or special requests.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section - Full Width */}
        <div className="border rounded-xl p-8 shadow-lg hover:shadow-xl transition-slow mb-12 animate-slide-up delay-200 hover-scale">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-black mb-6 transition-slow hover:text-black">
              Get in Touch
            </h2>
            <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed transition-slow hover:text-gray-800">
              Ready to satisfy your sweet cravings? Explore our menu, place your
              order, and experience the magic of{" "}
              <span className="text-black font-semibold">OB Cakes</span> today!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
