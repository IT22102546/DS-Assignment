// controllers/deliveryController.js
import Delivery from '../Models/Delivery.js';

export const createDelivery = async (req, res) => {
    try {
        const delivery = new Delivery(req.body);
        await delivery.save();
        res.status(201).json({ message: 'Delivery created successfully', delivery });
    } catch (error) {
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
        const updated = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'Delivery updated successfully', updated });
    } catch (error) {
        res.status(400).json({ message: 'Failed to update delivery', error });
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
