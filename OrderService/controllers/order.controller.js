import Order from "../models/order.model.js";

import { mongoose } from "mongoose";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
//import User from "../models/user.model.js";

//test order

//create new order
export const createOrder = async (req, res, next) => {
  // Log the full body to see what is being received
  console.log("Request Body:", req.body);

  // Check if all the required fields are present
  if (
    !req.body.userId ||
    !req.body.productsId ||
    !req.body.first_name ||
    !req.body.last_name ||
    !req.body.email ||
    !req.body.phone ||
    !req.body.address ||
    !req.body.city ||
    !req.body.zip ||
    !req.body.subtotal ||
    !req.body.deliveryfee ||
    !req.body.totalcost
  ) {
    console.log("Missing required fields");
    return next(errorHandler(400, "Please provide all required fields"));
  }

  // Log each field to see the values being passed
  console.log("userId:", req.body.userId);
  console.log("productsId:", req.body.productsId);
  console.log("first_name:", req.body.first_name);
  console.log("last_name:", req.body.last_name);
  console.log("email:", req.body.email);
  console.log("phone:", req.body.phone);
  console.log("address:", req.body.address);
  console.log("state:", req.body.city);
  console.log("zip:", req.body.zip);
  console.log("subtotal:", req.body.subtotal);
  console.log("deliveryfee:", req.body.deliveryfee);
  console.log("totalcost:", req.body.totalcost);

  const userId = req.body.userId;
  const productsId = req.body.productsId;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const phone = req.body.phone;
  const address = req.body.address;
  const city = req.body.city;
  const zip = req.body.zip;
  const subtotal = req.body.subtotal;
  const deliveryfee = req.body.deliveryfee;
  const totalcost = req.body.totalcost;
  const status = "paid";

  function idGen(phone) {
    const randomString = Math.random().toString(36).substring(2, 10);
    const id = "ORD" + randomString + phone;
    return id;
  }

  const orderId = idGen(phone);

  const newOrder = new Order({
    orderId,
    userId,
    productsId,
    first_name,
    last_name,
    email,
    phone,
    address,
    city,
    zip,
    subtotal,
    deliveryfee,
    totalcost,
    CashOnDelivery: true,
    status,
  });

  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error saving order:", error); // Log the error if saving fails
    next(error);
  }
};

//get all orders
export const getAllOrders = async (req, res) => {
  try {
    const { storename } = req.query;
    const orders = await Order.find({ "productsId.storename": storename }); // Filter orders by storename
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err });
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//update order
export const updateOrder = async (req, res, next) => {
  let orderId = req.params.id;
  if (
    !req.body.first_name ||
    !req.body.last_name ||
    !req.body.email ||
    !req.body.address ||
    !req.body.zip
  ) {
    return next(errorHandler(400, "Please provide all required fields"));
  }
  const { first_name, last_name, email, address, zip } = req.body;

  const updateOrder = {
    first_name,
    last_name,
    email,
    address,
    zip,
  };

  try {
    await Order.findByIdAndUpdate(orderId, updateOrder);
    res.status(200).json(updateOrder);
  } catch (error) {
    next(error);
  }
};

//delete order
export const deleteOrder = async (req, res, next) => {
  let orderId = req.params.id;
  try {
    await Order.findByIdAndDelete(orderId);
    res.status(200).json("The Order has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status, deliveryPerson } = req.body;

    const validStatuses = ["paid", "preparing", "handover", "delivered"];
    if (!validStatuses.includes(status)) {
      return next(errorHandler(400, "Invalid status value"));
    }

    if (status === "handover") {
      if (!deliveryPerson) {
        return next(
          errorHandler(400, "Delivery person is required for handover status")
        );
      }

      const rider = await User.findOne({ _id: deliveryPerson, isRider: true });
      if (!rider) {
        return next(
          errorHandler(400, "Selected delivery person is not a valid rider")
        );
      }
    }

    const updateData = { status };
    if (status === "handover") {
      updateData.deliveryPerson = deliveryPerson;
    } else {
      updateData.$unset = { deliveryPerson: "" };
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
    }).populate("deliveryPerson", "username mobile");

    if (!updatedOrder) {
      return next(errorHandler(404, "Order not found"));
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};



export const FinishOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status, deliveryPerson } = req.body;

    const validStatuses = ["paid", "preparing", "handover", "delivered"];
    if (!validStatuses.includes(status)) {
      return next(errorHandler(400, "Invalid status value"));
    }

    if (status === "handover") {
      if (!deliveryPerson) {
        return next(
          errorHandler(400, "Delivery person is required for handover status")
        );
      }

      const rider = await User.findOne({ _id: deliveryPerson, isRider: true });
      if (!rider) {
        return next(
          errorHandler(400, "Selected delivery person is not a valid rider")
        );
      }
    }

    const updateData = { status };
    if (status === "delivered") {
      updateData.deliveryPerson = deliveryPerson;
    } else {
      updateData.$unset = { deliveryPerson: "" };
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
    }).populate("deliveryPerson", "username mobile");

    if (!updatedOrder) {
      return next(errorHandler(404, "Order not found"));
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};



export const getOrdersByCustomerId = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const orders = await Order.find({ userId: customerId });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMyOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).populate({
      path: "deliveryPerson",
      select: "username mobile",
    });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
