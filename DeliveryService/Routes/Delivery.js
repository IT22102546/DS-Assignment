import express from 'express';
import {
    createDelivery,
    getAllDeliveries,
    updateDeliveryStatus,
    getDeliveryById,
} from '../Controllers/Delivery.js';

const router = express.Router();

router.post('/', createDelivery);
router.get('/', getAllDeliveries);
router.put('/:id', updateDeliveryStatus);
router.get('/:id', getDeliveryById);

export default router;
