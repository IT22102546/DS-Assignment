import mongoose from "mongoose";

const shopRequestSchema = new mongoose.Schema({
    username: { type: String, required: true, unique:true },
    email: { type: String, required: true  , nique:true},
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    isConfirm:{type:Boolean, default:false},
    isReject:{type:Boolean, default:false}
}, { timestamps: true });

const ShopRequest = mongoose.model('ShopRequest',shopRequestSchema);
export default ShopRequest;
