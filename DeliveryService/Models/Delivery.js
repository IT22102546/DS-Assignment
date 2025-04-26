import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    deliveryPerson: { type: String, required: true },
    customerLocation: { type: String, required: true },
    restaurantLocation: { type: String, required: true },
    status: { type: String, enum: ['assigned', 'in-transit', 'delivered'], default: 'assigned' },
}, { timestamps: true });

const Delivery = mongoose.model("Delivery", deliverySchema);
export default Delivery;