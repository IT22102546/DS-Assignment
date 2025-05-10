// controllers/deliveryController.js
import Delivery from '../Models/Delivery.js';

export const createDelivery = async (req, res) => {
    try {
        const delivery = new Delivery(req.body);
        console.log("create",req.body)
        await delivery.save();
        res.status(201).json({ message: 'Delivery created successfully', delivery });
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Failed to create delivery', error });
    }
};

export const getAllDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.find();
        res.status(200).json(deliveries);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve deliveries', error });
    }
};

export const updateDeliveryStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      console.log(id,status)
  
      const updatedDelivery = await Delivery.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
  
      if (!updatedDelivery) {
        return res.status(404).json({ message: "Delivery not found" });
      }
  
      res.status(200).json(updatedDelivery);
    } catch (error) {
        console.log(error)
      res.status(500).json({ message: "Failed to update delivery status", error });
    }
  };
  

export const getDeliveryById = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id);
        if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
        res.status(200).json(delivery);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch delivery', error });
    }
};



export const getAssignedDeliveriesForPerson = async (req, res) => {
    try {
        const { deliveryPerson } = req.params;
        console.log(deliveryPerson)
        const deliveries = await Delivery.find({
            deliveryPerson: deliveryPerson,
            status: 'assigned'
        });
        console.log(deliveries);
        res.status(200).json(deliveries);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Failed to fetch deliveries', error });
    }
};


export const getInTransmitDeliveriesForPerson = async (req, res) => {
    try {
        const { deliveryPerson } = req.params;
        const deliveries = await Delivery.find({
            deliveryPerson: deliveryPerson,
            status: 'in-transit'
        });
        res.status(200).json(deliveries);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch deliveries', error });
    }
};

export const getDeiveredDeliveriesForPerson = async (req, res) => {
    try {
        const { deliveryPerson } = req.params;
        const deliveries = await Delivery.find({
            deliveryPerson: deliveryPerson,
            status: 'delivered'
        });
        res.status(200).json(deliveries);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch deliveries', error });
    }
};