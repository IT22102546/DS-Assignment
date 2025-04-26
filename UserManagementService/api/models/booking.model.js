// models/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin', 
    required: true,
  },
  cakeType: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
  },
  contactName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  isConfirm:{type:Boolean, default:false},
  isReject:{type:Boolean, default:false}
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
