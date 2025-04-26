import { useSelector } from "react-redux";

const PayButton = ({ cartItems, cartTotalAmount, deliveryfee }) => {
  const { currentUser } = useSelector((state) => state.user);
  const apiUrl = import.meta.env.VITE_PAYMENT_API_URL;

  const handleCheckout = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cartItems,
            cartTotalAmount,
            deliveryfee,
            userId: currentUser._id,
          }),
        }
      );

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No URL returned from Stripe session creation");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <div className="grid place-items-center my-10">
      <button
        onClick={handleCheckout}
        className="w-full max-w-md mx-auto block mt-100xl  bg-[#FE8180] hover:bg-[#e57373] text-white font-medium py-3 px-6 rounded-lg shadow-md"
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default PayButton;
