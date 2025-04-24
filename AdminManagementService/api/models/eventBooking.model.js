import mongoose from 'mongoose';

const EventBookingSchema = new mongoose.Schema({
    sessionId: { 
        type: String, 
        unique: true, 
        default: () => `session_${Date.now()}` 
      },
  bookingId: { type: String, required: true }, // Stripe Payment ID
  userId: { type: String, required: true },
  teamId: { type: String, required: true },
  events: [
    {
      id: { type: String, required: true },
      title: { type: String, required: true },
    }
  ],
  teamName: { type: String, required: true },
  venue: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  zip: { type: String, required: true },
  onlinePayment: { type: Boolean, default: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, required: true },
});

export default mongoose.model('EventBooking', EventBookingSchema);