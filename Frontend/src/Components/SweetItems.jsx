import { useEffect, useState } from "react";
import { FaStore, FaShoppingCart, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../redux/cart/cartSlice";

export default function SweetItems() {
  const [products, setProducts] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [loading, setLoading] = useState(true);

  const { currentUser: user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/sweets/getsweets?limit=6");
        const data = await response.json();
        setProducts(data.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (user && product.isAvailable) {
      dispatch(addToCart({ product, userId: user.id }));
      alert("Product added to the cart");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-transparent py-16 w-full">
      <div className="relative mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div>
            <h2 className="text-3xl font-bold text-pink-800">Sweets</h2>
            <p className="text-md text-gray-600">
              Check out some of the Sweet Items. These are top-selling sweets!
            </p>
          </div>
          <Link to="/sweets">
            <button className="text-md bg-black text-white py-2 px-4 hover:bg-blue-700 rounded-lg">
              View All
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className={`bg-white p-4 rounded-lg shadow-lg border border-gray-200 relative flex flex-col justify-between ${
                product.isAvailable ? "" : "opacity-50 cursor-not-allowed"
              }`}
            >
              {/* Store Name Badge */}
              <div className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 text-xs rounded flex items-center">
                <FaStore className="mr-1" />
                {product.userId?.username || "Loading..."}
              </div>

              {/* Conditional Navigation */}
              {product.isAvailable ? (
                <Link to={`/sweet/${product.slug}`} className="block">
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <h3 className="text-lg font-semibold mb-1 text-black">{product.title}</h3>
                </Link>
              ) : (
                <div className="block">
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <h3 className="text-lg font-semibold mb-1 text-gray-400">{product.title}</h3>
                </div>
              )}

              <p className="text-lg font-bold text-pink-600">Rs. {product.price}</p>

              {/* Availability status with icons */}
              <p
                className={`text-sm font-medium mt-1 flex items-center ${
                  product.isAvailable ? "text-green-600" : "text-red-500"
                }`}
              >
                {product.isAvailable ? (
                  <>
                    <FaCheckCircle className="mr-1" /> Available
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="mr-1" /> Not Available
                  </>
                )}
              </p>

              {/* Add to Cart Button */}
              <div className="flex justify-center mt-3">
                <button
                  className={`px-3 py-2 rounded transition-all text-sm flex items-center ${
                    product.isAvailable
                      ? "bg-pink-500 text-white hover:bg-pink-700"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={!product.isAvailable}
                >
                  <FaShoppingCart className="inline mr-1" /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
