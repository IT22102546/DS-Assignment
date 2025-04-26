import ShopRequest from "../models/shopRequest.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";



export const test = (req, res) => {
  res.json({
    message: 'API is working'
  });
};


export const deleteUser = async(req,res,next)=>{
 
  try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been Deleted...")
  } catch (error) {
      next(error)
  }
}


export const getUsers = async (req, res, next) => {

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const searchTerm = req.query.searchTerm || '';

    const usersQuery = User.find({

      $or: [
        { username: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
       
      ]
     
    });

    const users = await usersQuery

      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });


    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ isAdmin: true });
    const totalCustomers = await User.countDocuments({ isAdmin: false });

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    const lastMonthCustomers = await User.countDocuments({
      isAdmin: false ,
      createdAt: { $gte: oneMonthAgo },
    });
    const lastMonthAdmin = await User.countDocuments({
      isAdmin: true ,
      createdAt: { $gte: oneMonthAgo },
    });


    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthCustomers,
      totalAdmins,
      totalCustomers,
      lastMonthAdmin,
      lastMonthUsers

    });
  } catch (error) {
    next(error);
  }
};



export const getAdmins = async (req, res, next) => {
  try {
    
    const admins = await User.find({ isAdmin: true });
    res.status(200).json({ admins });
  } catch (error) {
    console.error("Error in getAdmins controller:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

export const getCustomers = async (req, res, next) => {
  try {
    
    const admins = await User.find({ isAdmin: false });
    res.status(200).json({ admins });
  } catch (error) {
    console.error("Error in getAdmins controller:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
export const assignAdmin = async (req, res, next) =>{
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    user.isAdmin = true;
    await user.save();
    res.status(200).json({ message: 'User assigned admin privileges successfully' });
  } catch (error) {
    next(error);
  }

};
export const resignAdmin = async (req, res, next) =>{

  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    user.isAdmin = false;
    await user.save();
    res.status(200).json({ message: 'User resigned admin privileges successfully' });
  } catch (error) {
    next(error);
  }
  
};


export const confirmShopRequest = async (req, res) => {
  const { id } = req.params;

  console.log(id);

  try {
      const shopRequest = await ShopRequest.findById(id);

      if (!shopRequest) {
          return res.status(404).json({ success: false, message: "Shop request not found." });
      }

      if (shopRequest.isConfirm) {
          return res.status(400).json({ success: false, message: "Request already confirmed." });
      }


      const hashedPassword = bcryptjs.hashSync(shopRequest.password, 10);

      console.log("Shop request",shopRequest);

      // Create a new user from the shop request
      const newUser = new User({
          username: shopRequest.username,
          email: shopRequest.email,
          password: hashedPassword, 
          adress: shopRequest.address,
          mobile: shopRequest.mobile,
          isAdmin: true,
      });

      await newUser.save();

      shopRequest.isConfirm = true;
      await shopRequest.save();

      res.status(200).json({ success: true, message: "Shop request confirmed." });
  } catch (error) {
      res.status(500).json({ success: false, message: "Server error." });
  }
};


export const rejectmShopRequest = async (req, res) => {
  const { id } = req.params;

  try {
      const shopRequest = await ShopRequest.findById(id);

      if (!shopRequest) {
          return res.status(404).json({ success: false, message: "Shop request not found." });
      }

      if (shopRequest.isReject) {
          return res.status(400).json({ success: false, message: "Request already rejected." });
      }


      shopRequest.isReject = true;
      await shopRequest.save();

      res.status(200).json({ success: true, message: "Shop request confirmed." });
  } catch (error) {
      res.status(500).json({ success: false, message: "Server error." });
  }
};


export const getAllShopRequests = async (req, res) => {
  try {
      const shopRequests = await ShopRequest.find(); 
      res.status(200).json({ success: true, data: shopRequests });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};







