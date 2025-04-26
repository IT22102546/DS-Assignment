import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaStore, FaTag, FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cart/cartSlice";

export default function AllProducts() {
  const location = useLocation();
  const { shopId, shopName, shopAddress } = location.state || {};
  const [cakes, setCakes] = useState([]);
  const [sweets, setSweets] = useState([]);
  const [giftBoxes, setGiftBoxes] = useState([]);  // Renamed "gifts" to "giftBoxes"
  const [natureProducts, setNatureProducts] = useState([]);  // Renamed "nature" to "natureProducts"
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate(); 
  const [notification, setNotification] = useState({ visible: false, message: '' });

  useEffect(() => {
    if (!shopId) {
      setError("Shop ID is missing!");
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const [cakeRes, sweetRes, giftRes, natureRes] = await Promise.all([
          fetch(`/api/cakes/getcakes`),
          fetch(`/api/sweets/getsweets`),
          fetch(`/api/gift/getgifts`),
          fetch(`/api/nature/getnature`),
        ]);

        if (!cakeRes.ok || !sweetRes.ok || !giftRes.ok || !natureRes.ok) {
          throw new Error("Error fetching products");
        }

        const [cakeData, sweetData, giftData, natureData] = await Promise.all([
          cakeRes.json(),
          sweetRes.json(),
          giftRes.json(),
          natureRes.json(),
        ]);

        const filterByShop = (data) =>
          data?.products?.filter((product) => product.userId?._id === shopId) ||
          [];

        setCakes(filterByShop(cakeData));
        setSweets(filterByShop(sweetData));
        setGiftBoxes(filterByShop(giftData));  // Updated "setGifts" to "setGiftBoxes"
        setNatureProducts(filterByShop(natureData));  // Updated "setNature" to "setNatureProducts"

        setFilteredProducts([  
          ...filterByShop(cakeData),
          ...filterByShop(sweetData),
          ...filterByShop(giftData),
          ...filterByShop(natureData),
        ]);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [shopId]);

  const filterProducts = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredProducts([...cakes, ...sweets, ...giftBoxes, ...natureProducts]);  // Updated variables here
    } else if (category === "Cakes") {
      setFilteredProducts(cakes);
    } else if (category === "Sweets") {
      setFilteredProducts(sweets);
    } else if (category === "Gift Boxes") {  // Updated category name here
      setFilteredProducts(giftBoxes);
    } else if (category === "Nature Products") {  // Updated category name here
      setFilteredProducts(natureProducts);
    }
  };

  if (loading) return <p className="text-center text-lg">Loading products...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const handleAddToCart = (product) => {
    if (user) {
      dispatch(addToCart({ product, userId: user.id, storename: product.userId.username }));
      showNotification('Product added to the cart');
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
    <div className="p-6 min-h-screen bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)]">
      <h1 className="text-3xl font-bold text-center text-pink-700">
        {shopName}
      </h1>
      <p className="text-center text-gray-600 mb-6">
        {shopAddress || "No address available"}
      </p>

      {/* Category Filter Buttons with Rounded Images */}
      <div className="flex justify-center space-x-6 mb-6">
        {[  
          { name: "All", image: "https://www.shutterstock.com/image-photo/sweet-traditional-pastry-on-dark-600nw-2428064751.jpg" },
          { name: "Cakes", image: "https://i.pinimg.com/736x/ee/4e/fd/ee4efd0d960b477e4dc0373c2837f7a2.jpg" },
          { name: "Nature Products", image: "https://natrue.org/uploads/2021/01/Upcycled-cosmetics.png" },
          { name: "Sweets", image: "https://media.istockphoto.com/id/1185515984/photo/christmas-baking-table-scene-with-assorted-sweets-and-cookies-top-view-over-a-rustic-wood.jpg?s=612x612&w=0&k=20&c=cWVTyQfwrge2OfuWsRCAlDbZ9fSZO6pg_yuiGq9naLs=" },
          { name: "Gift Boxes", image: "https://www.elizabethandernest.co.uk/cdn/shop/products/MUM-ECO-INFRONT-BOX.jpg?v=1676498319" },
        ].map((cat) => (
          <button
            key={cat.name}
            onClick={() => filterProducts(cat.name)}
            className="flex flex-col items-center focus:outline-none"
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${
                selectedCategory === cat.name
                  ? "border-pink-600 bg-pink-200"
                  : "border-gray-300"
              }`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-12 h-12 object-cover rounded-full"
              />
            </div>
            <span
              className={`text-sm mt-2 font-medium ${
                selectedCategory === cat.name ? "text-pink-700" : "text-gray-600"
              }`}
            >
              {cat.name}
            </span>
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 ">
        {filteredProducts.length === 0 ? (
          <p className="text-center col-span-5 text-gray-500">
            No products found
          </p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className={` p-4 rounded-lg shadow-lg border border-gray-200 relative flex flex-col justify-between ${
                product.isAvailable ? "" : "opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 text-xs rounded flex items-center">
                <FaStore className="mr-1" /> {product.userId?.username || "Unknown"}
              </div>
              {product.isAvailable ? (
  <Link
    to={`/${
      cakes.some((c) => c._id === product._id)
        ? "cake"
        : sweets.some((s) => s._id === product._id)
        ? "sweet"
        : natureProducts.some((n) => n._id === product._id)
        ? "nature"
        : giftBoxes.some((g) => g._id === product._id)
        ? "gift"
        : "product"
    }/${product.slug}`}
  >
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
                <FaTag />{" "}
                <span
                  className={`${
                    product.isAvailable ? "text-green-600" : "text-red-600"
                  } font-semibold`}
                >
                  {product.isAvailable ? "Available" : "Out of stock"}
                </span>
              </p>
              <button
                  className={`bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-700 transition-all ${!product.isAvailable ? 'cursor-not-allowed bg-gray-400' : ''}`}
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
