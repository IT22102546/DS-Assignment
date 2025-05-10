import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    deliveryPerson: { type:  mongoose.Schema.Types.ObjectId, required: true },
    customerName  : {type : String},
    customerEmail:{type:String},
    CustomerMobile:{type:Number},
    customerLocation: { type: String, required: true},
    restaurantLocation: { type: String},
    orderAmount :{type:Number},
    delveryFee:{type:Number,required:true},
    status: { type: String, enum: ['assigned', 'in-transit', 'delivered'], default: 'assigned' },
}, { timestamps: true });

const Delivery = mongoose.model("Delivery", deliverySchema);
export default Delivery;