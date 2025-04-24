import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PayButton from "../Components/PayButton";

export default function OrderSummary() {
  const cart = useSelector((state) => state.cart);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const deliveryfee = 300;
  const [paymentMethod, setPaymentMethod] = useState("online");

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleCOD = () => {
    navigate("/cod-form", {
      state: {
        userId: currentUser?._id,
        cartItems: cart.cartItems,
        subtotal: cart.cartTotalAmount,
        deliveryfee: deliveryfee,
        totalcost: cart.cartTotalAmount + deliveryfee,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)]">
      <div className="py-10 px-6">
        <div className="px-4 pt-8 lg:pt-16">
          <h2 className="text-xl font-medium">Order Summary</h2>
          <div className="mt-8 space-y-3 rounded-lg border border-gray-300 px-2 py-4 sm:px-6">
            {cart.cartItems?.map((cartItem) => (
              <div
                className="flex flex-col rounded-lg bg-white sm:flex-row"
                key={cartItem._id}
              >
                <img
                  className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                  src={cartItem.mainImage}
                  alt={cartItem.title}
                />
                <div className="flex w-full flex-col px-4 py-4">
                  <p className="text-lg font-bold">{cartItem.storename}</p>
                  <span className="font-semibold">
                    {cartItem.title} ({cartItem.cartTotalQuantity})
                  </span>
                  <p className="text-lg font-bold">
                    LKR {cartItem.cartTotalQuantity * cartItem.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Payment Options */}
        <div className="mt-10 px-4 pt-20 lg:mt-0">
          <h2 className="text-xl font-medium">Payment Methods</h2>
          <form className="mt-8 space-y-3 rounded-lg px-2 py-4 sm:px-6">
            <div className="flex items-center rounded-lg border border-gray-200 bg-white p-4">
              <input
                id="online-payment"
                type="radio"
                value="online"
                name="payment-method"
                className="h-4 w-4 border-gray-300 text-[#FE8180] focus:ring-2 focus:ring-[#e57373]"
                checked={paymentMethod === "online"}
                onChange={handlePaymentMethodChange}
              />
              <label htmlFor="online-payment" className="ml-2 text-sm font-medium text-gray-900">
                Online Payment
              </label>
            </div>
            <div className="flex items-center rounded-lg border border-gray-200 bg-white p-4">
              <input
                id="cash-on-delivery"
                type="radio"
                value="cod"
                name="payment-method"
                className="h-4 w-4 border-gray-300 text-[#FE8180] focus:ring-2 focus:ring-[#e57373]"
                checked={paymentMethod === "cod"}
                onChange={handlePaymentMethodChange}
              />
              <label htmlFor="cash-on-delivery" className="ml-2 text-sm font-medium text-gray-900">
                Cash on Delivery
              </label>
            </div>
          </form>

          {paymentMethod === "online" ? (
            <PayButton
              cartItems={cart.cartItems}
              cartTotalAmount={cart.cartTotalAmount}
              deliveryfee={deliveryfee}
            />
          ) : (
            <div className="grid place-items-center my-10">
              <button

                className="w-full max-w-md mx-auto block mt-100xl  bg-[#FE8180] hover:bg-[#e57373] text-white font-medium py-3 px-6 rounded-lg shadow-md"


                onClick={handleCOD}
              >
                Proceed to Cash on Delivery
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}