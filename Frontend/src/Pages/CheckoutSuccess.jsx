import { Link } from 'react-router-dom';

export default function CheckoutSuccess() {
  return (
    <div className="p-6 bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)] min-h-screen">
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-bounce-slow {
          animation: bounce 2s ease-in-out infinite;
        }
        .animate-delay-100 {
          animation-delay: 0.1s;
        }
        .animate-delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>

      <div className="text-center pt-36">
        <h1 className="text-4xl font-semibold font-cinzel text-pink-800 animate-fade-in">
          Your order placed successfully
        </h1>
        <h2 className="text-xl text-pink-500 animate-fade-in animate-delay-100">
          Seller is preparing your package for delivery
        </h2>
        <img 
          src="https://tse3.mm.bing.net/th?id=OIP.A5zQE0TYyCTaRL47OjfKrAHaD1&pid=Api&P=0&h=220" 
          alt="package" 
          className="w-64 mx-auto mt-10 animate-fade-in animate-delay-200 animate-bounce-slow"
        />
      </div>
      
      <div className="flex flex-wrap justify-center gap-20 pb-56 pt-5">
        <Link to="/">
          <button className="rounded-full py-4 px-6 w-full max-w-[280px] flex items-center bg-[#FE8180] hover:bg-[#e57373] justify-center transition-all duration-500 hover:scale-105">
            <span className="px-2 font-semibold text-lg leading-8 text-white font-cinzel">
              Go back to Home
            </span>
          </button>
        </Link>

        <Link to="/products">
          <button className="rounded-full py-4 px-6 w-full max-w-[280px] flex items-center bg-[#FE8180] hover:bg-[#e57373] justify-center transition-all duration-500 hover:scale-105">
            <span className="px-2 font-semibold text-lg leading-8 text-white font-cinzel">
              Continue Shopping
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
            >
              <path
                d="M8.25324 5.49609L13.7535 10.9963L8.25 16.4998"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
}