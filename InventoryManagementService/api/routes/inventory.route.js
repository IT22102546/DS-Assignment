import express from 'express';
import { create, deletecake, featureCake, getFeaturedCakes, getCakes, getCakesByCategory, unfeatureCake, updateCake, admingetCakes, unavailable, available, getCakesByShop, getUserById, createShopRequest, getShops, getAllOrders, getOrder, updateOrderStatus, HandOvergetRiders, getRiders} from '../controllers/inventory.controller.js';


const router = express.Router();

router.post('/create', create);
router.get('/getcakes',getCakes);
router.get('/getadmincakes',  admingetCakes);
router.put('/updatecake/:productId/:userId',  updateCake)
router.delete('/deletecake/:productId/:userId',  deletecake);
router.put('/featurecake/:productId/:userId',  featureCake); 
router.put('/unfeaturecake/:productId/:userId', unfeatureCake);
router.put('/available/:productId/:userId',  available); 
router.put('/unavailable/:productId/:userId',  unavailable);
router.get('/featured', getFeaturedCakes);
router.get('/category', getCakesByCategory);
router.get('/getCakesByShop/:userId', getCakesByShop);
router.get("/getshopById/:userId", getUserById);
router.post("/shoprequest", createShopRequest);
router.get('/getshops', getShops);
router.get('/getorders', getAllOrders);
router.get('/getorder/:id', getOrder);
router.put('/update-status/:orderId', updateOrderStatus);
router.get('/getriders', getRiders);



export default router;