import { useEffect, useState } from "react";
import { FaShoppingCart, FaStore, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../redux/cart/cartSlice";

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3); // Default value
  const apiUrl = import.meta.env.VITE_Inventory_API_URL;
  const { currentUser: user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width >= 1024) setItemsPerPage(6); // Show 6 products on Desktop
      else if (width >= 768) setItemsPerPage(2); // Tablets
      else setItemsPerPage(1); // Mobile
    };
  
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/inventory/featured`);
        const data = await res.json();
        if (res.ok) {
          setFeaturedProducts(data);
          fetchUsernames(data);
        } else {
          console.error("Error fetching featured products");
        }
      } catch (error) {
        console.error("Fetch Error:", error.message);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const fetchUsernames = async (products) => {
    const fetchedUsernames = {};
    for (const product of products) {
      try {
        const res = await fetch(`${apiUrl}/api/inventory/getshopById/${product.userId}`);
        const data = await res.json();
        if (res.ok) {
          fetchedUsernames[product.userId] = data.username;
        }
      } catch (error) {
        console.error("Error fetching username:", error.message);
      }
    }
    setUsernames(fetchedUsernames);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? featuredProducts.length - itemsPerPage : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= featuredProducts.length - itemsPerPage ? 0 : prevIndex + 1
    );
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (!product.isAvailable) return;
    if (user) {
      dispatch(addToCart({ product, userId: user.id, storename: usernames[product.userId] }));
      alert("Product added to the cart");
    } else {
      alert("Please log in to add items to the cart.");
    }
  };

  return (
    <div className="bg-transparent py-16 w-full">
      <div className="w-full px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-center md:text-left text-pink-800">Signature Cakes</h2>
          <p className="text-md text-gray-600 max-w-md text-center md:text-left">
            Discover Signature Cakes selected for their outstanding quality and design.
          </p>
        </div>

        {featuredProducts.length > 0 && (
          <div className="relative w-full mt-8">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${(currentIndex * 100) / itemsPerPage}%)` }}
              >
                {featuredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex-shrink-0 px-2"
                    style={{ width: `${100 / itemsPerPage}%` }}
                  >
                    <div className="bg-white p-4 rounded-lg shadow-lg h-full flex flex-col border border-gray-200 relative">
                      {/* Shop Name in Top Left Corner */}
                      <div className="absolute top-2 left-2 flex items-center bg-gray-200 px-2 py-1 rounded-md text-sm text-gray-700">
                        <FaStore className="mr-1" />
                        {usernames[product.userId] || "Loading..."}
                      </div>

                      <Link to={`/cake/${product.slug}`} className="block">
                        <img
                          src={product.mainImage}
                          alt={product.name}
                          className="w-full h-40 object-cover rounded-md mb-3"
                        />
                        <h3 className="text-lg font-semibold mb-1 text-black">{product.title}</h3>
                      </Link>

                      <p className="text-lg font-bold text-pink-600">Rs. {product.price}</p>

                      {/* Availability Indicator */}
                      <div className="flex items-center mt-2 text-sm">
                        {product.isAvailable ? (
                          <span className="text-green-600 flex items-center">
                            <FaCheckCircle className="mr-1" /> Available
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center">
                            <FaTimesCircle className="mr-1" /> Not Available
                          </span>
                        )}
                      </div>

                      <div className="flex justify-center mt-3">
                        <button
                          className={`px-3 py-2 rounded text-sm transition-all ${
                            product.isAvailable
                              ? "bg-pink-500 text-white hover:bg-pink-700"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={!product.isAvailable}
                        >
                          <FaShoppingCart className="inline mr-1" /> Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              className="absolute top-1/2 left-2 transform -translate-y-1/2 p-2 bg-gray-500 text-white rounded-full z-10 w-8 h-8 flex items-center justify-center"
              onClick={prevSlide}
            >
              &lt;
            </button>
            <button
              className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 bg-gray-500 text-white rounded-full z-10 w-8 h-8 flex items-center justify-center"
              onClick={nextSlide}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
