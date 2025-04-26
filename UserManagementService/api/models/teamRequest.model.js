import mongoose from "mongoose";

const teamRequestSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    serviceAreas: { type: [String], required: true },
    isConfirm: { type: Boolean, default: false },
    isReject: { type: Boolean, default: false }
}, { timestamps: true });

const TeamRequest = mongoose.model('TeamRequest', teamRequestSchema);
export default TeamRequest;
