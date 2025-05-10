import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  removeFromCart,
  decreaseCart,
  getCartTotal,
  addToCart,
  clearCart,
} from "../redux/cart/cartSlice";
import { Button } from "flowbite-react";

export default function Cart() {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const deliveryFee = 300;

  const [descriptionVisibility, setDescriptionVisibility] = useState({});
  const [shopMismatch, setShopMismatch] = useState(false);
  const [currentShop, setCurrentShop] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(getCartTotal(user.id));
    }
  }, [cart, dispatch, user]);

  useEffect(() => {
    // Check if all items are from the same shop
    if (user && cart.cartItems.length > 0) {
      const userCartItems = cart.cartItems.filter(
        (cartItem) => cartItem.userId === user.id
      );
      if (userCartItems.length > 0) {
        const firstShop = userCartItems[0].storename;
        const allSameShop = userCartItems.every(
          (item) => item.storename === firstShop
        );

        setShopMismatch(!allSameShop);
        setCurrentShop(firstShop);
      }
    }
  }, [cart.cartItems, user]);

  const handleRemoveFromCart = (cartItem) => {
    dispatch(removeFromCart({ ...cartItem, userId: user.id }));
  };

  const handleDecreaseCart = (cartItem) => {
    dispatch(decreaseCart({ ...cartItem, userId: user.id }));
  };

  const handleIncreaseCart = (cartItem) => {
    dispatch(addToCart({ product: cartItem, userId: user.id }));
  };

  const handleClearCart = () => {
    const confirmation = window.confirm(
      "Are you sure you want to clear the cart?"
    );
    if (confirmation) {
      dispatch(clearCart(user.id));
    } else {
      console.log("Cart is not cleared!");
    }
  };

  const handleToggleDescription = (productId) => {
    setDescriptionVisibility((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  const userCartItems = cart.cartItems.filter(
    (cartItem) => cartItem.userId === user.id
  );

  return (
    <div className=" py-10 px-6">
      <div className="flex flex-col items-center border-b  py-4 sm:flex-row sm:px-10 lg:px-20 xl:px-32">
        <div className="mt-4 py-2 text-xs sm:mt-0 sm:ml-auto sm:text-base">
          <div className="relative">
            <ul className="relative flex w-full items-center justify-between space-x-2 sm:space-x-4">
              <li className="flex items-center space-x-3 text-left sm:space-x-4">
                <a className="flex h-6 w-6 items-center justify-center rounded-full bg-green-200 text-xs font-semibold text-green-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </a>
                <span className="font-semibold text-gray-900 font-semibold">
                  Cart
                </span>
              </li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <li className="flex items-center space-x-3 text-left sm:space-x-4">
                <a
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-xs font-semibold text-white"
                  href="/ordersummary"
                >
                  2
                </a>
                <span className="font-semibold text-gray-500 font-semibold">
                  Order Summary
                </span>
              </li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <li className="flex items-center space-x-3 text-left sm:space-x-4">
                <a
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-xs font-semibold text-white"
                  href="#"
                >
                  3
                </a>
                <span className="font-semibold text-gray-500 font-semibold">
                  Payment
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {userCartItems.length === 0 ? (
        <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
          <h2 className="title font-manrope font-bold text-4xl leading-10 mb-8 text-center text-black font-semibold">
            Shopping Cart
          </h2>
          <p className="font-semibold text-center font-semibold">
            Your cart is empty
          </p>
          <div className="text-center mt-5 mb-10">
            <Link to="/product-page">
              <span className="px-4 py-3 text-white rounded-lg size-10/12">
                Start Shopping
              </span>
            </Link>
          </div>
        </div>
      ) : (
        <section className="py-16 relative">
          <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto font-semibold text-black">
            <h2 className="title font-manrope font-bold text-4xl leading-10 mb-8 text-black font-semibold">
              Shopping Cart
            </h2>

            {shopMismatch && (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
                role="alert"
              >
                <p className="font-bold font-semibold">
                  Shop Mismatch Detected
                </p>
                <p className="font-semibold">
                  You have items from different shops in your cart. Please
                  select items from the same shop to continue. Current shop is "
                  {currentShop}".
                </p>
                <button
                  onClick={handleClearCart}
                  className="mt-2 text-red-700 underline font-semibold"
                >
                  Clear cart and start over
                </button>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-12 lg:items-start">
              <div className="basis-8/12">
                <div className="py-4 font-manrope font-semibold hidden lg:block text-black font-semibold">
                  <div className="grid grid-cols-12 gap-4">
                    <p className="col-span-6">Product</p>
                    <p className="col-span-2 text-center">Quantity</p>
                    <p className="col-span-2 text-center">Total</p>
                    <p className="col-span-2 text-center">Remove</p>
                  </div>
                </div>
                <div>
                  {userCartItems.map((cartItem) => (
                    <div
                      key={cartItem._id}
                      className="border-b border-gray-200 py-4 font-manrope text-black"
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-6">
                          <div className="flex items-center gap-4">
                            <img
                              src={cartItem.mainImage}
                              className="w-20 h-20 rounded object-cover"
                            />
                            <div>
                              <p className="font-bold text-sm mt-2 font-semibold">
                                {cartItem.storename}
                              </p>
                              <h3 className="font-semibold text-base leading-6 font-semibold">
                                {cartItem.title}
                              </h3>
                              <p className="font-bold text-sm mt-2 font-semibold">
                                Rs. {cartItem.price}
                              </p>
                              <Button
                                onClick={() =>
                                  handleToggleDescription(cartItem._id)
                                }
                                className="mt-2 text-white bg-green-500"
                              >
                                {descriptionVisibility[cartItem._id]
                                  ? "Hide"
                                  : "About Product"}
                              </Button>

                              {descriptionVisibility[cartItem._id] && (
                                <p className="mt-2 text-gray-700 font-semibold">
                                  {cartItem.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2 text-center">
                          <div className="flex justify-center items-center gap-2 border border-gray-300 rounded-full py-3 px-2 mx-auto w-max">
                            <button
                              onClick={() => handleDecreaseCart(cartItem)}
                              className="cursor-pointer text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                              -
                            </button>
                            <p className="font-semibold text-gray-900">
                              {cartItem.cartTotalQuantity}
                            </p>
                            <button
                              onClick={() => handleIncreaseCart(cartItem)}
                              className="cursor-pointer text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <p className="col-span-2 font-bold text-center font-semibold">
                          Rs. {cartItem.price * cartItem.cartTotalQuantity}
                        </p>
                        <div className="col-span-2 text-center">
                          <button
                            onClick={() => handleRemoveFromCart(cartItem)}
                            className="inline-flex items-center gap-2 mx-auto text-center text-gray-600"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7l-7 7-7-7"
                              />
                            </svg>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="basis-4/12">
                <div className="border border-gray-200 bg-white shadow-sm rounded-xl py-8 px-6">
                  <h3 className="font-manrope font-bold text-2xl leading-7 mb-6 font-semibold">
                    Summary
                  </h3>
                  <div className="flex items-center justify-between pb-4 text-sm border-b border-gray-200 font-semibold">
                    <p>Subtotal</p>
                    <p className="text-gray-900 font-bold">
                      Rs. {cart.cartTotalAmount}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-4 text-sm border-b border-gray-200 font-semibold">
                    <p>Delivery</p>
                    <p className="text-gray-900 font-bold">Rs. {deliveryFee}</p>
                  </div>
                  <div className="flex items-center justify-between py-4 text-sm border-b border-gray-200 font-semibold">
                    <p>Discount</p>
                    <p className="text-gray-900 font-bold">-</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 text-sm font-semibold">
                    <p className="text-base font-bold">Total</p>
                    <p className="text-base font-bold text-gray-900">
                      Rs. {cart.cartTotalAmount + deliveryFee}
                    </p>
                  </div>
                  <button
                    onClick={handleClearCart}
                    className="inline-block w-full bg-green-500 text-center text-white py-3 px-4 rounded-md mt-6 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE8180]"
                  >
                    Clear Cart
                  </button>
                  <Link to={shopMismatch ? "#" : "/order-summary"}>
                    <button
                      disabled={shopMismatch}
                      className={`inline-block w-full text-center text-white py-3 px-4 rounded-md mt-6 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        shopMismatch
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 focus:ring-[#FE8180]"
                      }`}
                    >
                      {shopMismatch
                        ? "Select from same shop to continue"
                        : "Proceed to Order Summary"}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
