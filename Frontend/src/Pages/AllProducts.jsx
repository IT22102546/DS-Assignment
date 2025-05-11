import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaStore, FaTag, FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cart/cartSlice";

export default function AllProducts() {
  const location = useLocation();
  const { shopId, shopName, shopAddress } = location.state || {};
  const [cakes, setCakes] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ visible: false, message: '' });
  const apiUrl = import.meta.env.VITE_Inventory_API_URL;

  useEffect(() => {
    if (!shopId) {
      setError("Shop ID is missing!");
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const cakeRes = await fetch(`${apiUrl}/api/inventory/getcakes`);
        if (!cakeRes.ok) {
          throw new Error("Error fetching cakes");
        }
        const cakeData = await cakeRes.json();

        const filteredCakes = cakeData?.products?.filter(
          (product) => product.userId?._id === shopId
        ) || [];

        setCakes(filteredCakes);
        setFilteredProducts(filteredCakes);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [shopId]);

  if (loading) return <p className="text-center text-lg">Loading cakes...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const handleAddToCart = (product) => {
    if (user) {
      dispatch(addToCart({ product, userId: user.id, storename: product.userId.username }));
      showNotification('Cake added to the cart');
    } else {
      navigate('/sign-in');
    }
  };

  const showNotification = (message) => {
    setNotification({ visible: true, message });
    setTimeout(() => {
      setNotification({ visible: false, message: '' });
    }, 3000);
  };

  return (
    <div className="p-6 min-h-screen bg-white">
      <h1 className="text-3xl font-bold text-center text-green-700">{shopName}</h1>
      <p className="text-center text-gray-600 mb-6">{shopAddress || "No address available"}</p>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setFilteredProducts(cakes)}
          className="flex flex-col items-center focus:outline-none"
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-green-600 bg-green-200">
            <img
              src="https://i.pinimg.com/736x/ee/4e/fd/ee4efd0d960b477e4dc0373c2837f7a2.jpg"
              alt="Cakes"
              className="w-12 h-12 object-cover rounded-full"
            />
          </div>
          <span className="text-sm mt-2 font-medium text-green-700">Cakes</span>
        </button>
      </div>

      {/* Cake List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredProducts.length === 0 ? (
          <p className="text-center col-span-5 text-gray-500">No cakes found</p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className={`p-4 rounded-lg shadow-lg border border-gray-200 relative flex flex-col justify-between ${
                product.isAvailable ? "" : "opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 text-xs rounded flex items-center">
                <FaStore className="mr-1" /> {product.userId?.username || "Unknown"}
              </div>
              {product.isAvailable ? (
                <Link to={`/cake/${product.slug}`}>
                  <img
                    src={product.mainImage || "https://via.placeholder.com/150"}
                    alt={product.name}
                    className="w-full h-40 sm:h-60 object-cover mb-4 rounded"
                  />
                </Link>
              ) : (
                <div className="w-full h-40 sm:h-60 object-cover mb-4 rounded opacity-50 cursor-not-allowed">
                  <img
                    src={product.mainImage || "https://via.placeholder.com/150"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <p className="text-center text-gray-600">Price: Rs. {product.price}</p>
              <p className="text-center flex justify-center items-center space-x-2 text-gray-600">
                <FaTag />
                <span
                  className={`${
                    product.isAvailable ? "text-green-600" : "text-red-600"
                  } font-semibold`}
                >
                  {product.isAvailable ? "Available" : "Out of stock"}
                </span>
              </p>
              <button
                className={`bg-green-400 text-white px-4 py-2 rounded hover:bg-green-700 transition-all ${
                  !product.isAvailable ? "cursor-not-allowed bg-gray-400" : ""
                }`}
                onClick={() => handleAddToCart(product)}
                disabled={!product.isAvailable}
              >
                <FaShoppingCart className="inline mr-2" /> Add to Cart
              </button>
            </div>
          ))
        )}
      </div>

      {notification.visible && (
        <div className="fixed bottom-4 right-4 p-4 bg-green-500 text-white rounded shadow-lg transition-all transform scale-110">
          <div className="flex items-center space-x-2">
            <FaShoppingCart className="text-xl" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
