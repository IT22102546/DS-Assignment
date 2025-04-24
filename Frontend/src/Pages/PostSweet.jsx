import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Alert, Button, TextInput } from 'flowbite-react';
import { FaPlus, FaMinus, FaWhatsapp, FaFacebook } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cart/cartSlice';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function PostSweet() {
  const { sweetSlug } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState({ visible: false, message: '' });
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/sweets/getsweets?slug=${sweetSlug}`);
        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        if (data.products.length === 0) throw new Error('Product not found');

        setProduct(data.products[0]);

        // Fetch similar products
        const similarRes = await fetch(`/api/sweets/category?category=${data.products[0].category}`);
        const similarData = await similarRes.json();
        setSimilarProducts(similarData.products);

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProduct();
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }, [sweetSlug]);

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    if (user) {
      dispatch(addToCart({ 
        product: { ...product, quantity }, 
        userId: user.id, 
        storename: product.userId.username 
      }));
      showNotification('Product added to cart');
    } else {
      navigate('/sign-in');
    }
  };

  const showNotification = (message) => {
    setNotification({ visible: true, message });
    setTimeout(() => setNotification({ visible: false, message: '' }), 3000);
  };

  if (loading)
    return (
      <motion.div 
        className="flex justify-center items-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        ></motion.div>
      </motion.div>
    );

  if (error)
    return (
      <motion.div 
        className="p-3 max-w-5xl mx-auto min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Alert color="failure" className="max-w-md">
          {error}
        </Alert>
      </motion.div>
    );

  return (
    <motion.div 
      className="p-3 max-w-auto mx-auto min-h-screen w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)] text-gray-800 placeholder-gray-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {notification.visible && (
          <motion.div
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        {/* Left Column - Images */}
        <div className="lg:w-1/2">
          <motion.div
            className="sticky top-10"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Main Image Section */}
            <div className="mb-6 rounded-xl overflow-hidden shadow-lg p-2 h-96 object-cover">
              <AnimatePresence mode="wait">
                <motion.img
                  key={mainImageIndex}
                  src={product.images[mainImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                />
              </AnimatePresence>
            </div>

            {/* Thumbnail Gallery Section */}
            <motion.div 
              className="p-4 rounded-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <motion.div
                    key={index}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden cursor-pointer ${
                      index === mainImageIndex
                        ? "ring-4 ring-pink-400"
                        : "ring-1 ring-gray-200"
                    }`}
                    onClick={() => setMainImageIndex(index)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300,
                      damping: 15,
                      delay: index * 0.05
                    }}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Column - Content */}
        <motion.div 
          className="lg:w-1/2"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="p-6 rounded-xl shadow-sm">
            <motion.h1
              className="text-3xl text-pink-300 my-4 font-semibold"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {product.userId.username}
            </motion.h1>
            <motion.h2
              className="text-3xl font-bold text-gray-800 mb-2"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              {product.title}
            </motion.h2>

            {/* Price and Quantity */}
            <motion.div
              className="flex justify-between items-center mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <p className="text-pink-500 font-semibold text-xl">
                Rs. {product.price}
              </p>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <motion.button
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                  onClick={() => handleQuantityChange(-1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaMinus className="text-gray-600" />
                </motion.button>
                <TextInput
                  type="number"
                  value={quantity}
                  min="1"
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value)))
                  }
                  className="w-16 text-center border-0 focus:ring-0"
                />
                <motion.button
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                  onClick={() => handleQuantityChange(1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlus className="text-gray-600" />
                </motion.button>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              className="mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </motion.div>

            {/* Add to Cart Button - Centered */}
            <motion.div
              className="flex justify-center mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <motion.button
                onClick={handleAddToCart}
                className="w-full max-w-md bg-[#FE8180] hover:bg-[#e57373] text-white font-medium py-3 px-6 rounded-lg shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add to Cart
              </motion.button>
            </motion.div>

            {/* Share Icons */}
            <motion.div
              className="border-t-2 pt-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <div className="flex gap-6 justify-center">
                <motion.a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Check out ${product.title} - Rs. ${product.price}. ${window.location.href}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:text-green-600 text-5xl"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  title="Share on WhatsApp"
                >
                  <FaWhatsapp />
                </motion.a>
                <motion.a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    window.location.href
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-5xl"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  title="Share on Facebook"
                >
                  <FaFacebook />
                </motion.a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Similar Products Section (unchanged from original) */}
      <div className="mt-10" data-aos="fade-up">
        <h2 className="text-xl font-semibold mb-4">Similar Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {similarProducts.length > 0 ? (
            similarProducts.map((similarProduct, index) => (
              <Link key={index} to={`/sweet/${similarProduct.slug}`}>
                <div className="border p-4 rounded-md" data-aos="flip-left">
                  <img
                    src={similarProduct.images[0]}
                    alt={similarProduct.title}
                    className="w-full h-48 object-cover mb-4"
                  />
                  <h3 className="text-lg font-semibold">{similarProduct.title}</h3>
                  <span>Price: Rs. {similarProduct.price}</span>
                </div>
              </Link>
            ))
          ) : (
            <div>No similar products found.</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}