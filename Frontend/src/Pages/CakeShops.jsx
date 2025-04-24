import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function CakeShops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);


  useEffect(() => {
    

    AOS.init({ duration: 1000, once: true });

    const fetchShops = async () => {
      try {
        const res = await fetch('/api/user/getadmins', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setShops(data.admins); // Assuming response includes an 'admins' array
      } catch (error) {
        setError('Failed to fetch cake shops');
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [currentUser, navigate]);

  const handleSelectShop = (shop) => {
    navigate('/allproducts', { state: { shopId: shop._id, shopName: shop.username,shopAddress:shop.adress } });
  };

  if (!currentUser) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)] min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-12 text-pink-800">Available Cake Shops</h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {shops.map((shop, index) => (
          <div
            key={shop._id}
            className="border rounded-lg p-6 flex flex-col items-center shadow-lg bg-white transform transition-transform hover:scale-105 hover:shadow-2xl cursor-pointer"
            data-aos="fade-up"
            data-aos-delay={index * 100}
            onClick={() => handleSelectShop(shop)}
          >
            <img
              src={shop.profilePicture || 'https://via.placeholder.com/150'}
              alt={`${shop.username}'s shop`}
              className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-pink-300"
            />
            <h3 className="text-xl font-semibold text-pink-800">{shop.username}</h3>
            <p className="text-gray-500">{shop.adress || 'Address not provided'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
