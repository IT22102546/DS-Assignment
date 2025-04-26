import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Alert, Button, TextInput } from 'flowbite-react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cart/cartSlice';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function PostEvent() {
  const { eventSlug } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const navigate = useNavigate(); // 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState({ visible: false, message: '' });
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/events/getevents?slug=${eventSlug}`);

        if (!res.ok) {
          const errorMessage = await res.text();
          setError(errorMessage);
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (data.products.length === 0) {
          setError('Product not found');
          setLoading(false);
          return;
        }

        setProduct(data.products[0]);

        // Fetch similar products
        const similarRes = await fetch(`/api/events/category?category=${data.products[0].category}`);
        const similarData = await similarRes.json();
        setSimilarProducts(similarData.products);

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProduct();
    AOS.init(); // Initialize AOS
  }, [eventSlug]);

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    if (user) {
      dispatch(addToCart({ product, userId: user.id , storename:product.userId.username}));
      showNotification('Product added to the cart');
    } else {
      navigate('/sign-in'); // Redirect to the sign-in page if not logged in
    }
  };

  const showNotification = (message) => {
    setNotification({ visible: true, message });
    setTimeout(() => {
      setNotification({ visible: false, message: '' });
    }, 3000);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <Alert color="failure">{error}</Alert>;
  }

  return (
    <div className="p-3 max-w-5xl mx-auto min-h-screen">
      {notification.visible && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-md">
          {notification.message}
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-4 sm:w-1/3">
          {product.images &&
            product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product Image ${index + 1}`}
                className={`cursor-pointer ${index === mainImageIndex ? 'border-4 border-teal-500' : 'border'}`}
                onClick={() => setMainImageIndex(index)}
                data-aos="fade-up" 
              />
            ))}
        </div>
        <div className="sm:w-2/3">
          <img src={product.images[mainImageIndex]} alt={product.title} className="w-full h-82 object-cover" data-aos="zoom-in" />
          <h1 className="text-3xl text-pink-300 my-7 font-semibold" data-aos="fade-left">{product.userId.username}</h1>
          <h1 className="text-2xl my-7 font-semibold" data-aos="fade-left">{product.title}</h1>
          <div className="flex items-center mt-4 gap-2" data-aos="fade-right">
            <div className="gap-4 sm:flex-row justify-between mt-4">
              Price: Rs. {product.price}
            </div>
            
          </div>
          <p data-aos="fade-up">{product.description}</p>

          <div className="flex justify-center gap-4 mt-4" data-aos="fade-up">
            <button
              className="block w-full text-center py-2 mt-2 bg-pink-400 border border-pink-200 text-black hover:bg-pink-600 rounded hover:border-pink-300 hover:text-white hover:font-semibold"
              onClick={handleAddToCart}
            >
              Book Event
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10" data-aos="fade-up">
        <h2 className="text-xl font-semibold mb-4">Similar Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {similarProducts.length > 0 ? (
            similarProducts.map((similarProduct, index) => (
              <Link key={index} to={`/event/${similarProduct.slug}`}>
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
            <div>No similar Events found.</div>
          )}
        </div>
      </div>
    </div>
  );
}