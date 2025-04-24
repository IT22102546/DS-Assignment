import mongoose from "mongoose";

const rideRequestSchema = new mongoose.Schema({
    username: { type: String, required: true,unique:true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    age: { type: Number, required: true },
    idNumber: { type: String, required: true , unique:true},
    isConfirm:{type:Boolean, default:false},
    isReject:{type:Boolean, default:false}
}, { timestamps: true });

const RideRequest = mongoose.model('RideRequest',rideRequestSchema);
export default RideRequest;
