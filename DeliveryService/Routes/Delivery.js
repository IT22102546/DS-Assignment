import express from 'express';
import {
    createDelivery,
    getAllDeliveries,
    updateDeliveryStatus,
    getDeliveryById,
    getAssignedDeliveriesForPerson,
    getInTransmitDeliveriesForPerson,
    getDeiveredDeliveriesForPerson,
} from '../Controllers/Delivery.js';

const router = express.Router();

router.post('/create', createDelivery);
router.get('/', getAllDeliveries);
router.put('/update-status/:id', updateDeliveryStatus);
router.get('/:id', getDeliveryById);
router.get('/assigned/:deliveryPerson', getAssignedDeliveriesForPerson);
router.get('/in-transmit/:deliveryPerson', getInTransmitDeliveriesForPerson);
router.get('/delivered/:deliveryPerson', getDeiveredDeliveriesForPerson);

export default router;
