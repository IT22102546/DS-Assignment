import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: String,
        required: true,
    },
    productsId: [{
        title: { type: String, required: true },
        quantity: { type: Number, required: true },
        mainImage: { type: String }, 
        storename: { type: String }
    }],
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,  
        lowercase: true, 
    },
    phone: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    zip: {
        type: Number,
        required: true,
    },
    subtotal: {
        type: Number,
        default: 0.00,
    },
    deliveryfee: {
        type: Number,
        default: 300,
    },
    totalcost: {
        type: Number,
        required: true,
    },
    CashOnDelivery: {
        type: Boolean,
        default: false
    },
    OnlinePayment: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['paid', 'preparing', 'handover', 'delivered'],
        default: 'paid'
    },
    deliveryPerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;