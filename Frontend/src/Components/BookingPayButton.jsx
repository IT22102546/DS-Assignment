import { useSelector } from "react-redux";

const BookingPayButton = ({ bookingItems, totalAmount, serviceFee, teamName, venue, date, time ,teamId}) => {
  const { currentUser } = useSelector((state) => state.user);

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/stripe/create-booking-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingItems,
          totalAmount,
          serviceFee,
          userId: currentUser._id,
          teamName,  
          teamId, 
          venue,      
          date,       
          time,       
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // Redirects to Stripe checkout
      } else {
        console.error("No URL returned from Stripe session creation");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="mt-4 w-full rounded-md bg-[#FE8180] hover:bg-[#e57373]  px-6 py-3 font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      Proceed to Payment
    </button>
  );
};

export default BookingPayButton;
