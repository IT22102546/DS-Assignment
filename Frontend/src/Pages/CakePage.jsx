import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cart/cartSlice';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaSearch, FaShoppingCart, FaTag, FaStore, FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function CakePage({ searchTermFromHeader }) {
  const location = useLocation();
  const { category } = queryString.parse(location.search);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [notification, setNotification] = useState({ visible: false, message: '' });
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);

  const { search: searchQuery } = queryString.parse(location.search);
  const [searchTerm, setSearchTerm] = useState(searchQuery || '');
  const apiUrl = import.meta.env.VITE_Inventory_API_URL;
  const categories = ['Birthday', 'Wedding', 'Anniversary', 'Custom'];
  const priceRanges = [
    { label: 'Under Rs. 1000', value: '0-1000' },
    { label: 'Rs. 1000 - Rs. 3000', value: '1000-3000' },
    { label: 'Above Rs. 3000', value: '3000-1000000000000' },
  ];

  const handleAddToCart = (product) => {
    if (user) {
      dispatch(addToCart({ product, userId: user.id, storename: product.userId.username }));
      showNotification('Product added to the cart');
    } else {
      console.log('User not logged in');
    }
  };

  const showNotification = (message) => {
    setNotification({ visible: true, message });
    setTimeout(() => {
      setNotification({ visible: false, message: '' });
    }, 3000);
  };

  useEffect(() => {
    fetchProducts();
    AOS.init();
  }, [searchTerm, selectedCategory, selectedPriceRange, currentPage]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/api/inventory/getcakes?searchTerm=${searchTerm}&category=${selectedCategory}&priceRange=${selectedPriceRange}&page=${currentPage}`
      );
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products);
        setTotalProducts(data.totalProducts);
        setTotalPages(Math.ceil(data.totalProducts / 4));
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 bg-white">
      {/* Collapsible Filter Section */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-between px-10 py-3 rounded-lg border border-gray-300 focus:outline-none bg-white text-gray-800 hover:bg-gray-50 transition-all"
        >
          <span className="flex items-center">
            <FaFilter className="mr-4" /> Filters
          </span>
          {showFilters ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {/* Filter Options */}
        <div
          className={`mt-2 rounded-lg border border-gray-300 overflow-hidden transition-all duration-300 ${
            showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{ backgroundColor: 'white' }}
        >
          <div className="p-3 flex flex-col md:flex-row gap-20">
            {/* Search Bar */}
            <div className="flex items-center border px-4 py-2 rounded w-full md:w-auto bg-white">
              <FaSearch className="mr-2" />
              <input
                type="text"
                placeholder="Search cakes..."
                className="w-full outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={() => fetchProducts()}
              />
            </div>

            {/* Categories Dropdown */}
            <div className="w-full md:w-auto">
              <h4 className="font-semibold mb-2">Categories</h4>
              <select
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none bg-white text-gray-800"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Dropdown */}
            <div className="w-full md:w-auto">
              <h4 className="font-semibold mb-2">Price Range</h4>
              <select
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none bg-white text-gray-800"
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
              >
                <option value="">All Price Ranges</option>
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-6"> 
        {products.map((product) => (
          <div
            key={product._id}
            className={`p-4 rounded-lg shadow-lg border border-gray-200 relative flex flex-col justify-between bg-white ${
              product.isAvailable ? "" : "opacity-50 cursor-not-allowed"
            }`}
            data-aos="fade-up" data-aos-duration="500"
          >
            <div className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 text-xs rounded flex items-center">
              <FaStore className="mr-1" /> {product.userId?.username || 'Loading...'}
            </div>
            <Link to={`/cake/${product.slug}`}>
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-40 sm:h-60 object-cover mb-4 rounded"
              />
            </Link>
            <h3 className="text-lg font-semibold text-center mb-2 hover:text-green-600">
              <Link to={`/cake/${product.slug}`}>{product.title}</Link>
            </h3>
            <p className="text-center text-gray-600">Price: Rs. {product.price}</p>
            <p className="text-center flex justify-center items-center space-x-2 text-gray-600">
              <FaTag />
              <span className={`${product.isAvailable ? 'text-green-600' : 'text-red-600'} font-semibold`}>
                {product.isAvailable ? 'In Stock' : 'Out of Stock'}
              </span>
            </p>
            <div className="flex justify-center mt-4 space-x-2">
              <button
                className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all ${
                  !product.isAvailable ? 'cursor-not-allowed bg-gray-400' : ''
                }`}
                onClick={() => handleAddToCart(product)}
                disabled={!product.isAvailable}
              >
                <FaShoppingCart className="inline mr-2" /> Add to Cart
              </button>
            </div>
          </div>
        ))}
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